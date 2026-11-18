import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { runConsultation, formatGeminiError } from "@/lib/gemini";
import {
  PAYLOAD_LIMITS,
  allowConsult,
  assertSameOrigin,
  clientIp,
  consumeTicket,
  readConsultSid,
} from "@/lib/consult-guard";
import type { ConsultRequest } from "@/lib/types";

const GENERIC_UNAVAILABLE =
  "Le service d’analyse est temporairement indisponible. Réessayez dans quelques instants.";

export async function GET() {
  return NextResponse.json({ error: "Méthode non autorisée." }, { status: 405 });
}

export async function POST(req: Request) {
  const originErr = assertSameOrigin(req);
  if (originErr) {
    return NextResponse.json({ error: originErr }, { status: 403 });
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (
    Number.isFinite(contentLength) &&
    contentLength > PAYLOAD_LIMITS.maxBodyBytes
  ) {
    return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });
  }

  const ip = clientIp(req);
  const sid = readConsultSid(req);
  if (!sid) {
    return NextResponse.json(
      { error: "Session manquante. Rechargez la page." },
      { status: 401 },
    );
  }

  const ticket =
    req.headers.get("x-consult-ticket") ||
    req.headers.get("X-Consult-Ticket");
  const ticketErr = await consumeTicket(ticket, ip, sid);
  if (ticketErr) {
    return NextResponse.json({ error: ticketErr }, { status: 401 });
  }

  const limitErr = await allowConsult(ip, sid);
  if (limitErr) {
    return NextResponse.json({ error: limitErr }, { status: 429 });
  }

  let body: ConsultRequest;
  try {
    const text = await req.text();
    if (text.length > PAYLOAD_LIMITS.maxBodyBytes) {
      return NextResponse.json({ error: "Requête trop volumineuse." }, { status: 413 });
    }
    body = JSON.parse(text) as ConsultRequest;
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const symptoms = (body.symptoms || "").trim();
  const message = (body.message || "").trim();
  if (!symptoms && !message) {
    return NextResponse.json(
      { error: "Veuillez décrire vos symptômes." },
      { status: 400 },
    );
  }

  if (
    symptoms.length > PAYLOAD_LIMITS.maxSymptoms ||
    message.length > PAYLOAD_LIMITS.maxMessage
  ) {
    return NextResponse.json({ error: "Texte trop long." }, { status: 400 });
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  if (rawHistory.length > PAYLOAD_LIMITS.maxHistoryItems) {
    return NextResponse.json(
      { error: "Historique trop long." },
      { status: 400 },
    );
  }
  for (const h of rawHistory) {
    if (!h || (h.role !== "user" && h.role !== "assistant")) {
      return NextResponse.json({ error: "Historique invalide." }, { status: 400 });
    }
    if (
      typeof h.content !== "string" ||
      h.content.length > PAYLOAD_LIMITS.maxHistoryItemChars
    ) {
      return NextResponse.json({ error: "Historique trop long." }, { status: 400 });
    }
  }

  const images = (body.images || []).slice(0, PAYLOAD_LIMITS.maxImages);
  if ((body.images || []).length > PAYLOAD_LIMITS.maxImages) {
    return NextResponse.json(
      { error: "Trop d’images (maximum 2)." },
      { status: 400 },
    );
  }
  for (const img of images) {
    if (!img.mimeType?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Seules les images sont acceptées." },
        { status: 400 },
      );
    }
    if (!img.data || img.data.length > PAYLOAD_LIMITS.maxImageBytesB64) {
      return NextResponse.json(
        { error: "Image trop volumineuse." },
        { status: 400 },
      );
    }
  }

  try {
    const result = await runConsultation({
      symptoms: symptoms || message,
      message: message || undefined,
      history: rawHistory,
      images,
    });

    return NextResponse.json({
      consultationId: body.consultationId || randomUUID(),
      assessment: result.assessment,
      reply: result.reply,
      emergencyDetected: result.emergencyDetected,
      mock: result.mock,
    });
  } catch (err) {
    console.error("consult error", formatGeminiError(err));
    return NextResponse.json({ error: GENERIC_UNAVAILABLE }, { status: 502 });
  }
}
