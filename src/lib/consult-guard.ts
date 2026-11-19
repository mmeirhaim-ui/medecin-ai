import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { sql } from "@/lib/db";

/**
 * Shared (DB-backed) per-IP / global budgets.
 * Ticket minting is generous: UI warms sid + prefetches tickets without
 * counting those as consults. Only successful consult posts burn consult quota.
 */
const TICKET_LIMIT_PER_IP = 60;
const TICKET_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONSULT_LIMIT_PER_IP = 30;
const CONSULT_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONSULT_DAILY_PER_IP = 80;
const GLOBAL_CONSULT_DAILY = 2000;
const TICKET_TTL_MS = 3 * 60 * 1000; // 3 min

export const CONSULT_SID_COOKIE = "doctor_ai_consult_sid";
/** Legacy cookies from Doctor IA / Medecin AI builds — still accepted for sid continuity. */
export const CONSULT_SID_COOKIE_LEGACY = "doctor_ia_consult_sid";
export const CONSULT_SID_COOKIE_LEGACY_MEDECIN = "medecin_consult_sid";

type GlobalSecret = typeof globalThis & { __medecinConsultHmac?: string };

/**
 * Shared HMAC secret for multi-instance hosts.
 * Prefer explicit CONSULT_TOKEN_SECRET; else derive from DATABASE_URL
 * (same Postgres on every instance). Avoid GEMINI_API_KEY alone — it can be
 * missing on a cold instance and fall back to a process-local random secret,
 * which produces intermittent « Jeton invalide. ».
 */
function getSigningSecret(): string {
  const explicit = process.env.CONSULT_TOKEN_SECRET?.trim();
  if (explicit) return explicit;

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl) {
    return createHash("sha256")
      .update(`medecin-consult-hmac-v1:${databaseUrl}`)
      .digest("hex");
  }

  const fromGemini =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();
  if (fromGemini) return fromGemini;

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
 * Client IP for rate limits only (not ticket binding).
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

function readCookieValue(cookie: string, name: string): string | null {
  const match = cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]+)`),
  );
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function readConsultSid(req: Request): string | null {
  const cookie = req.headers.get("cookie") || "";
  return (
    readCookieValue(cookie, CONSULT_SID_COOKIE) ||
    readCookieValue(cookie, CONSULT_SID_COOKIE_LEGACY) ||
    readCookieValue(cookie, CONSULT_SID_COOKIE_LEGACY_MEDECIN)
  );
}

export type RateLimitKind =
  | "ticket"
  | "consult_hour"
  | "consult_day"
  | "consult_global";

export type RateLimitResult = {
  ok: false;
  kind: RateLimitKind;
  retryAfterSeconds: number;
  error: string;
};

function rateLimitMessage(
  kind: RateLimitKind,
  retryAfterSeconds: number,
  localeHint?: string | null,
): string {
  const mins = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  const locale = (localeHint || "fr").toLowerCase().slice(0, 2);

  const messages: Record<string, Record<RateLimitKind, string>> = {
    en: {
      ticket: `Too many ticket requests. Try again in about ${mins} min.`,
      consult_hour: `Too many analyses. Try again in about ${mins} min.`,
      consult_day: `Daily analysis limit reached. Try again tomorrow.`,
      consult_global: `Service is busy. Try again in about ${mins} min.`,
    },
    fr: {
      ticket: `Trop de demandes de jeton. Réessayez dans environ ${mins} min.`,
      consult_hour: `Trop de demandes d’analyse. Réessayez dans environ ${mins} min.`,
      consult_day: `Limite quotidienne atteinte. Réessayez demain.`,
      consult_global: `Service temporairement saturé. Réessayez dans environ ${mins} min.`,
    },
    he: {
      ticket: `יותר מדי בקשות כרטיס. נסו שוב בעוד כ־${mins} דק׳.`,
      consult_hour: `יותר מדי ניתוחים. נסו שוב בעוד כ־${mins} דק׳.`,
      consult_day: `הגעתם למגבלת היום. נסו שוב מחר.`,
      consult_global: `השירות עמוס. נסו שוב בעוד כ־${mins} דק׳.`,
    },
    ru: {
      ticket: `Слишком много запросов билета. Повторите примерно через ${mins} мин.`,
      consult_hour: `Слишком много анализов. Повторите примерно через ${mins} мин.`,
      consult_day: `Дневной лимит исчерпан. Попробуйте завтра.`,
      consult_global: `Сервис перегружен. Повторите примерно через ${mins} мин.`,
    },
  };

  const pack = messages[locale] || messages.en;
  return pack[kind];
}

async function bumpCounterDetailed(
  bucketKey: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const resetAt = new Date(Date.now() + windowMs).toISOString();
  const rows = await sql<{ count: number; reset_at: string | Date }>(
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
     RETURNING count, reset_at`,
    [bucketKey, resetAt],
  );
  const count = Number(rows[0]?.count ?? 0);
  const resetRaw = rows[0]?.reset_at;
  const resetMs =
    resetRaw instanceof Date
      ? resetRaw.getTime()
      : Date.parse(String(resetRaw || ""));
  const retryAfterSeconds = Number.isFinite(resetMs)
    ? Math.max(1, Math.ceil((resetMs - Date.now()) / 1000))
    : Math.ceil(windowMs / 1000);
  return { allowed: count <= limit, retryAfterSeconds };
}

export function sidCookieHeader(sid: string): string {
  const maxAge = 60 * 60; // 1h
  const secure =
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.CURSOR_APP_ID) ||
    Boolean(process.env.VERCEL)
      ? "; Secure"
      : "";
  // Lax: same-site navigations + our credentialed fetches; Strict can drop
  // the cookie on some hosted edge redirects before the first ticket POST.
  return `${CONSULT_SID_COOKIE}=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function normalizeHost(raw: string): string {
  return raw.trim().toLowerCase().replace(/\.$/, "");
}

/** Extract host[:port] from Host / X-Forwarded-Host / origin-like values. */
function hostFromValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  if (!first) return null;
  try {
    if (first.includes("://")) {
      return normalizeHost(new URL(first).host);
    }
    // Reject clearly invalid header values.
    if (/[\s/]/.test(first)) return null;
    return normalizeHost(first);
  } catch {
    return null;
  }
}

function hostnameOnly(host: string): string {
  // Strip brackets for IPv6 and a trailing :port (not inside [...]).
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    return end >= 0 ? host.slice(0, end + 1) : host;
  }
  const idx = host.lastIndexOf(":");
  if (idx > 0 && /^\d+$/.test(host.slice(idx + 1))) {
    return host.slice(0, idx);
  }
  return host;
}

function isLocalDevHost(host: string): boolean {
  const name = hostnameOnly(host);
  return name === "localhost" || name === "127.0.0.1" || name === "[::1]" || name === "::1";
}

/** Cursor-published apps (e.g. doctor-ai.apps.grok.bot, legacy medecin-ai). */
function isCursorAppsHost(host: string): boolean {
  const name = hostnameOnly(host);
  return name === "apps.grok.bot" || name.endsWith(".apps.grok.bot");
}

/**
 * Trusted request hosts from the incoming request + deploy env.
 * Prefer ALLOWED_ORIGINS / VERCEL_URL over hardcoding a single domain.
 */
function trustedRequestHosts(req: Request): Set<string> {
  const trusted = new Set<string>();
  const add = (raw: string | null | undefined) => {
    const host = hostFromValue(raw);
    if (!host) return;
    trusted.add(host);
    trusted.add(hostnameOnly(host));
  };

  add(req.headers.get("host"));
  add(req.headers.get("x-forwarded-host"));

  for (const entry of (process.env.ALLOWED_ORIGINS || "").split(",")) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    add(trimmed);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    add(vercelUrl.includes("://") ? vercelUrl : `https://${vercelUrl}`);
  }

  return trusted;
}

function isAllowedBrowserHost(candidateHost: string, trusted: Set<string>): boolean {
  const host = normalizeHost(candidateHost);
  const name = hostnameOnly(host);
  if (trusted.has(host) || trusted.has(name)) return true;
  if (isLocalDevHost(host)) return true;
  if (isCursorAppsHost(host)) return true;
  return false;
}

/**
 * Require browser Origin/Referer from a trusted host.
 * Allows request Host / X-Forwarded-Host, ALLOWED_ORIGINS, VERCEL_URL,
 * localhost, and *.apps.grok.bot (Cursor published apps).
 */
export function assertSameOrigin(req: Request): string | null {
  const trusted = trustedRequestHosts(req);

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const o = new URL(origin);
      if (!isAllowedBrowserHost(o.host, trusted)) {
        return "Origine non autorisée.";
      }
      return null;
    } catch {
      return "Origine non autorisée.";
    }
  }

  const referer = req.headers.get("referer");
  if (referer) {
    try {
      const r = new URL(referer);
      if (!isAllowedBrowserHost(r.host, trusted)) {
        return "Origine non autorisée.";
      }
      return null;
    } catch {
      return "Origine non autorisée.";
    }
  }

  return "Requête non autorisée.";
}

export async function allowTicketIssue(
  ip: string,
  localeHint?: string | null,
): Promise<RateLimitResult | null> {
  const result = await bumpCounterDetailed(
    `ticket:ip:${ip}`,
    TICKET_LIMIT_PER_IP,
    TICKET_WINDOW_MS,
  );
  if (result.allowed) return null;
  return {
    ok: false,
    kind: "ticket",
    retryAfterSeconds: result.retryAfterSeconds,
    error: rateLimitMessage("ticket", result.retryAfterSeconds, localeHint),
  };
}

/**
 * Count only real consult attempts (after a valid ticket is consumed).
 * Failed ticket/auth paths must not call this.
 */
export async function allowConsult(
  ip: string,
  sid: string,
  localeHint?: string | null,
): Promise<RateLimitResult | null> {
  const hourIp = await bumpCounterDetailed(
    `consult:ip:${ip}`,
    CONSULT_LIMIT_PER_IP,
    CONSULT_WINDOW_MS,
  );
  if (!hourIp.allowed) {
    return {
      ok: false,
      kind: "consult_hour",
      retryAfterSeconds: hourIp.retryAfterSeconds,
      error: rateLimitMessage(
        "consult_hour",
        hourIp.retryAfterSeconds,
        localeHint,
      ),
    };
  }

  const hourSid = await bumpCounterDetailed(
    `consult:sid:${sid}`,
    CONSULT_LIMIT_PER_IP,
    CONSULT_WINDOW_MS,
  );
  if (!hourSid.allowed) {
    return {
      ok: false,
      kind: "consult_hour",
      retryAfterSeconds: hourSid.retryAfterSeconds,
      error: rateLimitMessage(
        "consult_hour",
        hourSid.retryAfterSeconds,
        localeHint,
      ),
    };
  }

  const day = await bumpCounterDetailed(
    `consult:day:ip:${ip}:${utcDay()}`,
    CONSULT_DAILY_PER_IP,
    24 * 60 * 60 * 1000,
  );
  if (!day.allowed) {
    return {
      ok: false,
      kind: "consult_day",
      retryAfterSeconds: day.retryAfterSeconds,
      error: rateLimitMessage("consult_day", day.retryAfterSeconds, localeHint),
    };
  }

  const global = await bumpCounterDetailed(
    `consult:global:${utcDay()}`,
    GLOBAL_CONSULT_DAILY,
    24 * 60 * 60 * 1000,
  );
  if (!global.allowed) {
    return {
      ok: false,
      kind: "consult_global",
      retryAfterSeconds: global.retryAfterSeconds,
      error: rateLimitMessage(
        "consult_global",
        global.retryAfterSeconds,
        localeHint,
      ),
    };
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
 * Mint a short-lived HMAC ticket bound to browser sid only (sticky-safe).
 * IP is intentionally not bound: multi-instance / edge hops often change
 * x-real-ip between ticket mint and consult, which caused « Jeton invalide. ».
 * Format: base64url(v2|id|expiresAt|sid).signature
 */
export function mintTicket(
  sid: string,
): { ticket: string; expiresAt: number; ticketId: string } {
  const ticketId = randomBytes(16).toString("base64url");
  const expiresAt = Date.now() + TICKET_TTL_MS;
  const body = Buffer.from(
    `v2|${ticketId}|${expiresAt}|${sid}`,
    "utf8",
  ).toString("base64url");
  const ticket = `${body}.${sign(body)}`;
  return { ticket, expiresAt, ticketId };
}

/**
 * Verify HMAC + sid binding, then atomically mark ticket used in DB
 * (true single-use across instances).
 */
export async function consumeTicket(
  ticket: string | null,
  sid: string,
): Promise<string | null> {
  if (!ticket || ticket.length > 512) {
    return "Jeton manquant. Rechargez la page et réessayez.";
  }
  const dot = ticket.lastIndexOf(".");
  if (dot <= 0) return "Jeton invalide. Rechargez la page.";
  const body = ticket.slice(0, dot);
  const sig = ticket.slice(dot + 1);
  if (!body || !sig) return "Jeton invalide. Rechargez la page.";
  if (!safeEqual(sign(body), sig)) {
    return "Jeton invalide. Rechargez la page.";
  }

  let decoded: string;
  try {
    decoded = Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return "Jeton invalide. Rechargez la page.";
  }
  const parts = decoded.split("|");

  // v2|id|expires|sid — sticky-safe (no IP)
  if (parts[0] === "v2" && parts.length === 4) {
    const [, ticketId, expStr, ticketSid] = parts;
    if (!ticketId) return "Jeton invalide. Rechargez la page.";
    const expiresAt = Number(expStr);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return "Jeton expiré. Rechargez la page.";
    }
    if (ticketSid !== sid) {
      return "Session expirée. Rechargez la page.";
    }
    return markTicketUsed(ticketId, expiresAt);
  }

  // Legacy v1: id|expires|ip|sid — accept sid match only (ignore IP drift)
  if (parts.length === 4 && parts[0] !== "v2") {
    const [ticketId, expStr, , ticketSid] = parts;
    if (!ticketId) return "Jeton invalide. Rechargez la page.";
    const expiresAt = Number(expStr);
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return "Jeton expiré. Rechargez la page.";
    }
    if (ticketSid !== sid) {
      return "Session expirée. Rechargez la page.";
    }
    return markTicketUsed(ticketId, expiresAt);
  }

  return "Jeton invalide. Rechargez la page.";
}

async function markTicketUsed(
  ticketId: string,
  expiresAt: number,
): Promise<string | null> {
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
    return "Jeton déjà utilisé. Réessayez.";
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
