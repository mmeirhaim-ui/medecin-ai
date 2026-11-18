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

export async function POST(req: Request) {
  const originErr = assertSameOrigin(req);
  if (originErr) {
    return NextResponse.json({ error: originErr }, { status: 403 });
  }

  const ip = clientIp(req);
  if (!(await allowTicketIssue(ip))) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard." },
      { status: 429 },
    );
  }

  const existingSid = readConsultSid(req);
  const sid = existingSid || randomBytes(16).toString("base64url");
  const { ticket, expiresAt } = mintTicket(ip, sid);

  const res = NextResponse.json({ ticket, expiresAt });
  if (!existingSid) {
    res.headers.append("Set-Cookie", sidCookieHeader(sid));
  }
  return res;
}

export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée." }, { status: 405 });
}
