import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  runConsultation,
  isMockMode,
  formatGeminiError,
  getApiKey,
  DEFAULT_GEMINI_MODEL,
} from "@/lib/gemini";
import type { ConsultRequest } from "@/lib/types";

/** Simple in-memory rate limit (per instance). */
const buckets = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 20;
const WINDOW_MS = 60_000;
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES_B64 = 4_500_000;

function clientKey(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon"
  );
}

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count += 1;
  return true;
}

export async function GET() {
  const mock = isMockMode();
  return NextResponse.json({
    ok: true,
    mock,
    provider: mock ? "mock" : "gemini",
    model: mock
      ? null
      : process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL,
    hasKey: Boolean(getApiKey()),
  });
}

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req))) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  let body: ConsultRequest;
  try {
    body = (await req.json()) as ConsultRequest;
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

  if (symptoms.length > 8000 || message.length > 4000) {
    return NextResponse.json({ error: "Texte trop long." }, { status: 400 });
  }

  const images = (body.images || []).slice(0, MAX_IMAGES);
  for (const img of images) {
    if (!img.mimeType?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Seules les images sont acceptées." },
        { status: 400 },
      );
    }
    if (!img.data || img.data.length > MAX_IMAGE_BYTES_B64) {
      return NextResponse.json(
        { error: "Image trop volumineuse (max ~3 Mo)." },
        { status: 400 },
      );
    }
  }

  try {
    const result = await runConsultation({
      symptoms: symptoms || message,
      message: message || undefined,
      history: body.history?.slice(-12),
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
    const detail = formatGeminiError(err);
    console.error("consult error", detail);
    return NextResponse.json(
      {
        error: `Le service d’analyse est temporairement indisponible. ${detail}`,
        detail,
      },
      { status: 502 },
    );
  }
}
