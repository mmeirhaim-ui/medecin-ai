import { NextResponse } from "next/server";
import {
  allowTicketIssue,
  assertSameOrigin,
  clientIp,
  mintTicket,
} from "@/lib/consult-guard";

export async function POST(req: Request) {
  const originErr = assertSameOrigin(req);
  if (originErr) {
    return NextResponse.json({ error: originErr }, { status: 403 });
  }

  const ip = clientIp(req);
  if (!allowTicketIssue(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard." },
      { status: 429 },
    );
  }

  const { ticket, expiresAt } = mintTicket(ip);
  return NextResponse.json({ ticket, expiresAt });
}

export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée." }, { status: 405 });
}
