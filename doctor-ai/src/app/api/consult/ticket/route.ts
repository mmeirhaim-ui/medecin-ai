import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import {
  allowTicketIssue,
  assertSameOrigin,
  clientIp,
  mintTicket,
  readConsultSid,
  sidCookieHeader,
} from "@/lib/consult-guard";

function localeHint(req: Request): string | null {
  return (
    req.headers.get("x-locale") ||
    req.headers.get("accept-language")?.split(",")[0] ||
    null
  );
}

function jsonError(
  error: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    { error, ...extra },
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

/**
 * POST /api/consult/ticket
 * - Default: mint a single-use analysis ticket (+ refresh sid cookie).
 * - `?warm=1` or header `X-Consult-Warm: 1`: only ensure sid cookie — does
 *   not mint a ticket and does not burn ticket quota (UI preload).
 */
export async function POST(req: Request) {
  try {
    const originErr = assertSameOrigin(req);
    if (originErr) {
      return jsonError(originErr, 403);
    }

    const url = new URL(req.url);
    const warm =
      url.searchParams.get("warm") === "1" ||
      req.headers.get("x-consult-warm") === "1";

    const existingSid = readConsultSid(req);
    const sid = existingSid || randomBytes(16).toString("base64url");

    if (warm) {
      const res = NextResponse.json(
        { ok: true, warm: true },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
          },
        },
      );
      res.headers.append("Set-Cookie", sidCookieHeader(sid));
      return res;
    }

    const ip = clientIp(req);
    const limited = await allowTicketIssue(ip, localeHint(req));
    if (limited) {
      return jsonError(limited.error, 429, {
        retryAfterSeconds: limited.retryAfterSeconds,
        kind: limited.kind,
      });
    }

    const { ticket, expiresAt } = mintTicket(sid);

    const res = NextResponse.json(
      { ticket, expiresAt },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      },
    );
    res.headers.append("Set-Cookie", sidCookieHeader(sid));
    return res;
  } catch (err) {
    console.error(
      "ticket error",
      err instanceof Error ? err.message : "unknown",
    );
    return jsonError("Service temporairement indisponible.", 502);
  }
}

export async function GET() {
  return jsonError("Méthode non autorisée.", 405);
}
