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
import { isLocale } from "@/lib/i18n/locales";
import type { ConsultRequest } from "@/lib/types";

const GENERIC_UNAVAILABLE =
  "Le service d’analyse est temporairement indisponible. Réessayez dans quelques instants.";

function json(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders?: Record<string, string>,
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function localeHint(req: Request, bodyLocale?: unknown): string | null {
  if (isLocale(bodyLocale)) return bodyLocale;
  return (
    req.headers.get("x-locale") ||
    req.headers.get("accept-language")?.split(",")[0] ||
    null
  );
}

export async function GET() {
  return json({ error: "Méthode non autorisée." }, 405);
}

export async function POST(req: Request) {
  try {
    const originErr = assertSameOrigin(req);
    if (originErr) {
      return json({ error: originErr }, 403);
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (
      Number.isFinite(contentLength) &&
      contentLength > PAYLOAD_LIMITS.maxBodyBytes
    ) {
      return json({ error: "Requête trop volumineuse." }, 413);
    }

    const ip = clientIp(req);
    const sid = readConsultSid(req);
    if (!sid) {
      return json(
        { error: "Session manquante. Rechargez la page." },
        401,
      );
    }

    const ticket =
      req.headers.get("x-consult-ticket") ||
      req.headers.get("X-Consult-Ticket");
    const ticketErr = await consumeTicket(ticket, sid);
    if (ticketErr) {
      // Invalid/used tickets must not burn consult quota.
      return json({ error: ticketErr }, 401);
    }

    let body: ConsultRequest;
    try {
      const text = await req.text();
      if (text.length > PAYLOAD_LIMITS.maxBodyBytes) {
        return json({ error: "Requête trop volumineuse." }, 413);
      }
      body = JSON.parse(text) as ConsultRequest;
    } catch {
      return json({ error: "JSON invalide." }, 400);
    }

    const hint = localeHint(req, body.locale);
    const limitErr = await allowConsult(ip, sid, hint);
    if (limitErr) {
      return json(
        {
          error: limitErr.error,
          retryAfterSeconds: limitErr.retryAfterSeconds,
          kind: limitErr.kind,
        },
        429,
        { "Retry-After": String(limitErr.retryAfterSeconds) },
      );
    }

    const symptoms = (body.symptoms || "").trim();
    const message = (body.message || "").trim();
    if (!symptoms && !message) {
      return json({ error: "Veuillez décrire vos symptômes." }, 400);
    }

    if (
      symptoms.length > PAYLOAD_LIMITS.maxSymptoms ||
      message.length > PAYLOAD_LIMITS.maxMessage
    ) {
      return json({ error: "Texte trop long." }, 400);
    }

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    if (rawHistory.length > PAYLOAD_LIMITS.maxHistoryItems) {
      return json({ error: "Historique trop long." }, 400);
    }
    for (const h of rawHistory) {
      if (!h || (h.role !== "user" && h.role !== "assistant")) {
        return json({ error: "Historique invalide." }, 400);
      }
      if (
        typeof h.content !== "string" ||
        h.content.length > PAYLOAD_LIMITS.maxHistoryItemChars
      ) {
        return json({ error: "Historique trop long." }, 400);
      }
    }

    const images = (body.images || []).slice(0, PAYLOAD_LIMITS.maxImages);
    if ((body.images || []).length > PAYLOAD_LIMITS.maxImages) {
      return json({ error: "Trop d’images (maximum 2)." }, 400);
    }
    for (const img of images) {
      if (!img.mimeType?.startsWith("image/")) {
        return json({ error: "Seules les images sont acceptées." }, 400);
      }
      if (!img.data || img.data.length > PAYLOAD_LIMITS.maxImageBytesB64) {
        return json({ error: "Image trop volumineuse." }, 400);
      }
    }

    try {
      const guardStart = performance.now();
      const result = await runConsultation({
        symptoms: symptoms || message,
        message: message || undefined,
        history: rawHistory,
        images,
        locale: isLocale(body.locale) ? body.locale : undefined,
      });
      const routeOverheadMs =
        Math.round((performance.now() - guardStart - result.timings.totalMs) * 100) /
        100;

      const serverTiming = [
        `knowledge;dur=${result.timings.knowledgeMs}`,
        `model;dur=${result.timings.modelMs}`,
        `consult;dur=${result.timings.totalMs}`,
        `route;dur=${Math.max(0, routeOverheadMs)}`,
      ].join(", ");

      return json(
        {
          consultationId: body.consultationId || randomUUID(),
          assessment: result.assessment,
          reply: result.reply,
          emergencyDetected: result.emergencyDetected,
          mock: result.mock,
        },
        200,
        { "Server-Timing": serverTiming },
      );
    } catch (err) {
      console.error("consult error", formatGeminiError(err));
      return json({ error: GENERIC_UNAVAILABLE }, 502);
    }
  } catch (err) {
    console.error(
      "consult fatal",
      err instanceof Error ? err.message : "unknown",
    );
    return json({ error: GENERIC_UNAVAILABLE }, 502);
  }
}
