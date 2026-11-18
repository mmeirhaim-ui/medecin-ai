import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { sql } from "@/lib/db";

/** Shared (DB-backed) per-IP / global budgets. */
const TICKET_LIMIT_PER_IP = 8;
const TICKET_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONSULT_LIMIT_PER_IP = 5;
const CONSULT_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONSULT_DAILY_PER_IP = 20;
const GLOBAL_CONSULT_DAILY = 250;
const TICKET_TTL_MS = 3 * 60 * 1000; // 3 min

export const CONSULT_SID_COOKIE = "medecin_consult_sid";

type GlobalSecret = typeof globalThis & { __medecinConsultHmac?: string };

/** Prefer env secrets; else process-local random (local/mock only). */
function getSigningSecret(): string {
  const fromEnv =
    process.env.CONSULT_TOKEN_SECRET?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  const g = globalThis as GlobalSecret;
  if (!g.__medecinConsultHmac) {
    g.__medecinConsultHmac = randomBytes(32).toString("hex");
  }
  return g.__medecinConsultHmac;
}

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeIp(raw: string): string {
  return raw.replace(/^::ffff:/i, "").trim();
}

/**
 * Trusted client IP for rate limits / ticket binding.
 * Prefer platform `x-real-ip`. Never trust the first X-Forwarded-For hop
 * (client-spoofable); use only the last hop (closest to the edge).
 */
export function clientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp && !realIp.includes(",")) {
    return normalizeIp(realIp) || "anon";
  }

  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return normalizeIp(last) || "anon";
  }

  return "anon";
}

export function readConsultSid(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSULT_SID_COOKIE}=([^;]+)`),
  );
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function sidCookieHeader(sid: string): string {
  const maxAge = 60 * 60; // 1h
  const secure =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.CURSOR_APP_ID) ||
    Boolean(process.env.VERCEL)
      ? "; Secure"
      : "";
  return `${CONSULT_SID_COOKIE}=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

/** Require same-origin browser navigation / fetch. */
export function assertSameOrigin(req: Request): string | null {
  const host = req.headers.get("host");
  if (!host) return "Requête invalide.";

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const o = new URL(origin);
      if (o.host !== host) return "Origine non autorisée.";
      return null;
    } catch {
      return "Origine non autorisée.";
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const r = new URL(referer);
      if (r.host !== host) return "Origine non autorisée.";
      return null;
    } catch {
      return "Origine non autorisée.";
    }
  }

  return "Requête non autorisée.";
}

async function bumpCounter(
  bucketKey: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const resetAt = new Date(Date.now() + windowMs).toISOString();
  const rows = await sql<{ count: number }>(
    `INSERT INTO rate_counters (bucket_key, count, reset_at)
     VALUES ($1, 1, $2::timestamptz)
     ON CONFLICT (bucket_key) DO UPDATE
     SET
       count = CASE
         WHEN rate_counters.reset_at <= now() THEN 1
         ELSE rate_counters.count + 1
       END,
       reset_at = CASE
         WHEN rate_counters.reset_at <= now() THEN EXCLUDED.reset_at
         ELSE rate_counters.reset_at
       END
     RETURNING count`,
    [bucketKey, resetAt],
  );
  const count = Number(rows[0]?.count ?? 0);
  return count <= limit;
}

export async function allowTicketIssue(ip: string): Promise<boolean> {
  return bumpCounter(`ticket:ip:${ip}`, TICKET_LIMIT_PER_IP, TICKET_WINDOW_MS);
}

export async function allowConsult(ip: string, sid: string): Promise<string | null> {
  if (
    !(await bumpCounter(`consult:ip:${ip}`, CONSULT_LIMIT_PER_IP, CONSULT_WINDOW_MS))
  ) {
    return "Trop de requêtes. Réessayez plus tard.";
  }
  if (
    !(await bumpCounter(
      `consult:sid:${sid}`,
      CONSULT_LIMIT_PER_IP,
      CONSULT_WINDOW_MS,
    ))
  ) {
    return "Trop de requêtes. Réessayez plus tard.";
  }
  if (
    !(await bumpCounter(
      `consult:day:ip:${ip}:${utcDay()}`,
      CONSULT_DAILY_PER_IP,
      24 * 60 * 60 * 1000,
    ))
  ) {
    return "Limite quotidienne atteinte. Réessayez demain.";
  }
  if (
    !(await bumpCounter(
      `consult:global:${utcDay()}`,
      GLOBAL_CONSULT_DAILY,
      24 * 60 * 60 * 1000,
    ))
  ) {
    return "Service temporairement saturé. Réessayez plus tard.";
  }
  return null;
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(payload)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * Mint a short-lived HMAC ticket bound to IP + browser sid.
 * Format: base64url(id|expiresAt|ip|sid).signature
 */
export function mintTicket(
  ip: string,
  sid: string,
): { ticket: string; expiresAt: number; ticketId: string } {
  const ticketId = randomBytes(16).toString("base64url");
  const expiresAt = Date.now() + TICKET_TTL_MS;
  const body = Buffer.from(
    `${ticketId}|${expiresAt}|${ip}|${sid}`,
    "utf8",
  ).toString("base64url");
  const ticket = `${body}.${sign(body)}`;
  return { ticket, expiresAt, ticketId };
}

/**
 * Verify HMAC + IP/sid binding, then atomically mark ticket used in DB
 * (true single-use across instances).
 */
export async function consumeTicket(
  ticket: string | null,
  ip: string,
  sid: string,
): Promise<string | null> {
  if (!ticket || ticket.length > 512) return "Jeton manquant ou invalide.";
  const dot = ticket.lastIndexOf(".");
  if (dot <= 0) return "Jeton invalide.";
  const body = ticket.slice(0, dot);
  const sig = ticket.slice(dot + 1);
  if (!body || !sig) return "Jeton invalide.";
  if (!safeEqual(sign(body), sig)) return "Jeton invalide.";

  let decoded: string;
  try {
    decoded = Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return "Jeton invalide.";
  }
  const parts = decoded.split("|");
  if (parts.length !== 4) return "Jeton invalide.";
  const [ticketId, expStr, ticketIp, ticketSid] = parts;
  if (!ticketId) return "Jeton invalide.";
  const expiresAt = Number(expStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return "Jeton expiré. Rechargez la page.";
  }
  if (ticketIp !== ip || ticketSid !== sid) return "Jeton invalide.";

  // Opportunistic cleanup of expired rows (best-effort).
  void sql(`DELETE FROM used_tickets WHERE expires_at < now()`).catch(() => {});

  const inserted = await sql<{ ticket_id: string }>(
    `INSERT INTO used_tickets (ticket_id, expires_at)
     VALUES ($1, to_timestamp($2 / 1000.0))
     ON CONFLICT (ticket_id) DO NOTHING
     RETURNING ticket_id`,
    [ticketId, expiresAt],
  );
  if (!inserted[0]?.ticket_id) {
    return "Jeton déjà utilisé.";
  }
  return null;
}

export const PAYLOAD_LIMITS = {
  maxBodyBytes: 1_200_000,
  maxSymptoms: 4000,
  maxMessage: 1500,
  maxHistoryItems: 6,
  maxHistoryItemChars: 1200,
  maxImages: 2,
  maxImageBytesB64: 900_000,
} as const;
