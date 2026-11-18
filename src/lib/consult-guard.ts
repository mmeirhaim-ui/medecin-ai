import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/** Strict per-IP / global budgets (in-memory per instance). */
const TICKET_LIMIT_PER_IP = 8;
const TICKET_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONSULT_LIMIT_PER_IP = 5;
const CONSULT_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONSULT_DAILY_PER_IP = 20;
const GLOBAL_CONSULT_DAILY = 250;
const TICKET_TTL_MS = 3 * 60 * 1000; // 3 min, single-use

type Counter = { count: number; resetAt: number };
type Daily = { count: number; day: string };

const ticketBuckets = new Map<string, Counter>();
const consultBuckets = new Map<string, Counter>();
const consultDaily = new Map<string, Daily>();
let globalDaily: Daily = { count: 0, day: utcDay() };

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

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

function pruneMap<T extends { resetAt?: number } | number>(
  map: Map<string, T>,
  now: number,
  getExpiry: (v: T) => number,
) {
  if (map.size < 500) return;
  for (const [k, v] of map) {
    if (getExpiry(v) <= now) map.delete(k);
  }
}

function bumpWindow(
  map: Map<string, Counter>,
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  pruneMap(map, now, (v) => v.resetAt);
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function bumpDaily(map: Map<string, Daily>, key: string, limit: number): boolean {
  const day = utcDay();
  const entry = map.get(key);
  if (!entry || entry.day !== day) {
    map.set(key, { count: 1, day });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function bumpGlobalDaily(limit: number): boolean {
  const day = utcDay();
  if (globalDaily.day !== day) {
    globalDaily = { count: 1, day };
    return true;
  }
  if (globalDaily.count >= limit) return false;
  globalDaily.count += 1;
  return true;
}

export function clientIp(req: Request): string {
  const raw =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "anon";
  // Normalize IPv4-mapped IPv6 so ticket mint/verify agree.
  return raw.replace(/^::ffff:/i, "");
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

  // Non-browser clients without Origin/Referer are rejected.
  return "Requête non autorisée.";
}

export function allowTicketIssue(ip: string): boolean {
  return bumpWindow(ticketBuckets, ip, TICKET_LIMIT_PER_IP, TICKET_WINDOW_MS);
}

export function allowConsult(ip: string): string | null {
  if (!bumpWindow(consultBuckets, ip, CONSULT_LIMIT_PER_IP, CONSULT_WINDOW_MS)) {
    return "Trop de requêtes. Réessayez plus tard.";
  }
  if (!bumpDaily(consultDaily, ip, CONSULT_DAILY_PER_IP)) {
    return "Limite quotidienne atteinte. Réessayez demain.";
  }
  if (!bumpGlobalDaily(GLOBAL_CONSULT_DAILY)) {
    return "Service temporairement saturé. Réessayez plus tard.";
  }
  return null;
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * Mint a short-lived HMAC ticket bound to the client IP.
 * Stateless (works across serverless isolates); replay window is TICKET_TTL_MS,
 * with consult rate limits as the primary abuse brake.
 * Format: base64url(id|expiresAt|ip).signature  (avoid "." inside IPs).
 */
export function mintTicket(ip: string): { ticket: string; expiresAt: number } {
  const id = randomBytes(16).toString("base64url");
  const expiresAt = Date.now() + TICKET_TTL_MS;
  const body = Buffer.from(`${id}|${expiresAt}|${ip}`, "utf8").toString(
    "base64url",
  );
  const ticket = `${body}.${sign(body)}`;
  return { ticket, expiresAt };
}

/** Verify ticket. Returns error message or null if ok. */
export function consumeTicket(ticket: string | null, ip: string): string | null {
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
  if (parts.length !== 3) return "Jeton invalide.";
  const [, expStr, ticketIp] = parts;
  const expiresAt = Number(expStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return "Jeton expiré. Rechargez la page.";
  }
  if (ticketIp !== ip) return "Jeton invalide.";
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
