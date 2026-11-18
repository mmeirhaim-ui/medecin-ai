"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ImageUpload } from "./ImageUpload";
import { AssessmentResult } from "./AssessmentResult";
import { EmergencyBanner } from "./EmergencyBanner";
import { Disclaimer } from "./Disclaimer";
import { ThinkingDots } from "./ThinkingDots";
import { useLocale } from "./LocaleProvider";
import { detectEmergency } from "@/lib/emergency";
import { upsertConsultation, getConsultation } from "@/lib/storage";
import type {
  Assessment,
  ChatMessage,
  Consultation,
  ConsultResponse,
  UploadedImage,
} from "@/lib/types";

type Props = {
  initialId?: string;
};

function newId() {
  return crypto.randomUUID();
}

type PrefetchedTicket = { ticket: string; at: number };

async function readJsonSafe<T>(
  res: Response,
): Promise<{ ok: boolean; body: T | null; fallback: string }> {
  const statusText = res.statusText?.trim() || `HTTP ${res.status}`;
  const raw = await res.text();
  if (!raw) {
    return { ok: false, body: null, fallback: statusText };
  }
  try {
    return { ok: true, body: JSON.parse(raw) as T, fallback: statusText };
  } catch {
    const snippet = raw.replace(/\s+/g, " ").trim().slice(0, 120);
    const looksHtml = /<\s*html|<\s*body|<\s*!doctype/i.test(raw);
    return {
      ok: false,
      body: null,
      fallback: looksHtml
        ? statusText
        : snippet || statusText,
    };
  }
}

export function ConsultationClient({ initialId }: Props) {
  const { t, locale } = useLocale();
  const [consultationId, setConsultationId] = useState(initialId || newId());
  const [symptoms, setSymptoms] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [followUp, setFollowUp] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockBanner, setMockBanner] = useState(false);
  const [started, setStarted] = useState(false);
  const prefetched = useRef<PrefetchedTicket | null>(null);

  useEffect(() => {
    if (!initialId) return;
    const existing = getConsultation(initialId);
    if (!existing) return;
    setConsultationId(existing.id);
    setSymptoms(existing.symptoms);
    setMessages(existing.messages);
    setAssessment(existing.assessment);
    setEmergencyDetected(existing.emergencyDetected);
    setStarted(true);
  }, [initialId]);

  // Warm HttpOnly sid only (no ticket quota). Prefetch a real ticket later.
  useEffect(() => {
    void fetch("/api/consult/ticket?warm=1", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json", "X-Consult-Warm": "1", "X-Locale": locale },
    }).catch(() => {});
  }, [locale]);

  useEffect(() => {
    if (started || symptoms.trim().length < 12) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch("/api/consult/ticket", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              "X-Locale": locale,
            },
          });
          const data = await readJsonSafe<{ ticket?: string }>(res);
          if (!cancelled && res.ok && data.ok && data.body?.ticket) {
            prefetched.current = { ticket: data.body.ticket, at: Date.now() };
          }
        } catch {
          /* ignore warm failures */
        }
      })();
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [symptoms, started, locale]);

  const liveEmergency = useMemo(
    () => detectEmergency(`${symptoms}\n${followUp}`).detected,
    [symptoms, followUp],
  );

  function persist(
    partial: Partial<Consultation> & { assessment?: Assessment | null },
  ) {
    const now = new Date().toISOString();
    const record: Consultation = {
      id: consultationId,
      createdAt: partial.createdAt || now,
      updatedAt: now,
      symptoms: partial.symptoms ?? symptoms,
      messages: partial.messages ?? messages,
      assessment:
        partial.assessment === undefined ? assessment : partial.assessment,
      emergencyDetected: partial.emergencyDetected ?? emergencyDetected,
    };
    upsertConsultation(record);
  }

  async function fetchConsultTicket(): Promise<string> {
    const cached = prefetched.current;
    // Tickets are short-lived; reuse a warm ticket if < 45s old.
    if (cached && Date.now() - cached.at < 45_000) {
      prefetched.current = null;
      return cached.ticket;
    }
    const res = await fetch("/api/consult/ticket", {
      method: "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json", "X-Locale": locale },
    });
    const parsed = await readJsonSafe<{ ticket?: string; error?: string }>(res);
    const data = parsed.body;
    if (!res.ok || !data?.ticket) {
      throw new Error(
        data?.error ||
          t.errors.ticketFailed.replace("{status}", parsed.fallback),
      );
    }
    return data.ticket;
  }

  function isRetryableTicketError(message: string): boolean {
    const m = message.toLowerCase();
    return (
      m.includes("jeton") ||
      m.includes("ticket") ||
      m.includes("session manquante") ||
      m.includes("session expirée") ||
      m.includes("session missing") ||
      m.includes("session expired")
    );
  }

  async function postConsult(
    body: Record<string, unknown>,
  ): Promise<ConsultResponse> {
    let lastError = t.errors.analysisFailed;
    for (let attempt = 0; attempt < 2; attempt++) {
      const ticket = await fetchConsultTicket();
      const res = await fetch("/api/consult", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Consult-Ticket": ticket,
          "X-Locale": locale,
        },
        body: JSON.stringify({ ...body, locale }),
      });
      const parsed = await readJsonSafe<
        ConsultResponse & { error?: string; retryAfterSeconds?: number }
      >(res);
      if (!parsed.ok || !parsed.body) {
        throw new Error(
          t.errors.unreadable.replace("{status}", parsed.fallback),
        );
      }
      const data = parsed.body;
      if (res.ok) return data;
      lastError = data.error || lastError;
      if (attempt === 0 && isRetryableTicketError(lastError)) continue;
      throw new Error(lastError);
    }
    throw new Error(lastError);
  }

  async function submitInitial(e: FormEvent) {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError(t.consult.needSymptoms);
      return;
    }
    setError(null);
    setLoading(true);

    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: symptoms.trim(),
      createdAt: new Date().toISOString(),
      images: images.map((img) => ({
        name: img.name,
        mimeType: img.mimeType,
        previewUrl: img.previewUrl,
      })),
    };

    try {
      const data = await postConsult({
        consultationId,
        symptoms: symptoms.trim(),
        images: images.slice(0, 2).map((img) => ({
          mimeType: img.mimeType,
          data: img.data,
          name: img.name,
        })),
      });

      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };
      const nextMessages = [userMsg, assistantMsg];
      setMessages(nextMessages);
      setAssessment(data.assessment);
      setEmergencyDetected(data.emergencyDetected);
      setMockBanner(Boolean(data.mock));
      setStarted(true);
      setConsultationId(data.consultationId);
      persist({
        symptoms: symptoms.trim(),
        messages: nextMessages,
        assessment: data.assessment,
        emergencyDetected: data.emergencyDetected,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.unexpected);
    } finally {
      setLoading(false);
    }
  }

  async function submitFollowUp(e: FormEvent) {
    e.preventDefault();
    if (!followUp.trim()) return;
    setError(null);
    setLoading(true);

    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: followUp.trim(),
      createdAt: new Date().toISOString(),
    };
    const history = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content.slice(0, 1200),
    }));

    try {
      const data = await postConsult({
        consultationId,
        symptoms: symptoms.slice(0, 4000),
        message: followUp.trim().slice(0, 1500),
        history,
      });

      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };
      const nextMessages = [...messages, userMsg, assistantMsg];
      setMessages(nextMessages);
      setAssessment(data.assessment);
      setEmergencyDetected(data.emergencyDetected || emergencyDetected);
      setMockBanner(Boolean(data.mock));
      setFollowUp("");
      persist({
        messages: nextMessages,
        assessment: data.assessment,
        emergencyDetected: data.emergencyDetected || emergencyDetected,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.unexpected);
    } finally {
      setLoading(false);
    }
  }

  function resetSession() {
    setConsultationId(newId());
    setSymptoms("");
    setImages([]);
    setFollowUp("");
    setMessages([]);
    setAssessment(null);
    setEmergencyDetected(false);
    setError(null);
    setStarted(false);
    setMockBanner(false);
    prefetched.current = null;
  }

  return (
    <div className="space-y-6">
      {(emergencyDetected || liveEmergency) && <EmergencyBanner />}

      {mockBanner && (
        <p className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-center text-sm text-[var(--brand-deep)]">
          {t.consult.mockBanner}
        </p>
      )}

      {!started ? (
        <form
          onSubmit={submitInitial}
          className="glass animate-rise space-y-6 rounded-[calc(var(--radius)+4px)] p-5 sm:p-8"
        >
          <div>
            <h1 className="font-display text-3xl text-[var(--brand-deep)] sm:text-4xl">
              {t.consult.describeTitle}
            </h1>
            <p className="mt-2 text-[var(--ink-muted)]">{t.consult.describeBody}</p>
          </div>

          <div>
            <label
              htmlFor="symptoms"
              className="block text-sm font-medium text-[var(--ink)]"
            >
              {t.consult.symptomsLabel}
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={7}
              placeholder={t.consult.symptomsPlaceholder}
              className="mt-2 w-full resize-y rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-[var(--ink)] outline-none ring-[var(--brand)] placeholder:text-[var(--ink-muted)]/70 focus:ring-2"
              required
            />
          </div>

          <ImageUpload images={images} onChange={setImages} max={2} />

          <Disclaimer variant="banner" />
          <Disclaimer variant="privacy" />

          {error && (
            <p className="text-sm text-[var(--urgent)]" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/60 px-4 py-3">
              <ThinkingDots label={t.consult.thinking} />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3 text-base font-medium text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60 sm:w-auto"
          >
            {loading ? t.consult.analyzing : t.consult.getOrientation}
          </button>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass animate-rise space-y-4 rounded-[calc(var(--radius)+4px)] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl text-[var(--brand-deep)]">
                  {t.consult.consultationTitle}
                </h1>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {t.consult.consultationHint}
                </p>
              </div>
              <button
                type="button"
                onClick={resetSession}
                className="shrink-0 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                {t.consult.newSession}
              </button>
            </div>

            <div
              className="max-h-[420px] space-y-3 overflow-y-auto pe-1"
              aria-live="polite"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`animate-fade-slide rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ms-6 bg-[var(--brand)] text-white"
                      : "me-6 bg-white/80 text-[var(--ink)]"
                  }`}
                >
                  <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide opacity-70">
                    {m.role === "user" ? t.consult.you : t.consult.assistant}
                  </p>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.images && m.images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.images.map((img) =>
                        img.previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={img.name + (img.previewUrl || "")}
                            src={img.previewUrl}
                            alt={img.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : null,
                      )}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="me-6 rounded-2xl bg-white/80 px-4 py-3">
                  <ThinkingDots label={t.consult.thinking} />
                </div>
              )}
            </div>

            <form
              onSubmit={submitFollowUp}
              className="space-y-3 border-t border-[var(--line)] pt-4"
            >
              <Disclaimer variant="privacy" />
              <label htmlFor="followup" className="sr-only">
                {t.consult.followUpLabel}
              </label>
              <textarea
                id="followup"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                rows={3}
                placeholder={t.consult.followUpPlaceholder}
                className="w-full resize-y rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-sm outline-none ring-[var(--brand)] focus:ring-2"
              />
              {error && (
                <p className="text-sm text-[var(--urgent)]" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !followUp.trim()}
                className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-deep)] disabled:opacity-60"
              >
                {loading ? t.consult.sending : t.consult.send}
              </button>
            </form>
          </section>

          <section className="glass animate-rise-delay rounded-[calc(var(--radius)+4px)] p-5 sm:p-7">
            {assessment ? (
              <AssessmentResult assessment={assessment} />
            ) : (
              <p className="text-[var(--ink-muted)]">
                {t.consult.resultPlaceholder}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
