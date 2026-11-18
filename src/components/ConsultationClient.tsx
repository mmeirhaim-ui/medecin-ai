"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ImageUpload } from "./ImageUpload";
import { AssessmentResult } from "./AssessmentResult";
import { EmergencyBanner } from "./EmergencyBanner";
import { Disclaimer } from "./Disclaimer";
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

export function ConsultationClient({ initialId }: Props) {
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
    const res = await fetch("/api/consult/ticket", { method: "POST" });
    const data = (await res.json()) as { ticket?: string; error?: string };
    if (!res.ok || !data.ticket) {
      throw new Error(data.error || "Impossible d’obtenir un jeton d’analyse.");
    }
    return data.ticket;
  }

  async function submitInitial(e: FormEvent) {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError("Décrivez vos symptômes pour commencer.");
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
      const ticket = await fetchConsultTicket();
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Consult-Ticket": ticket,
        },
        body: JSON.stringify({
          consultationId,
          symptoms: symptoms.trim(),
          images: images.slice(0, 2).map((img) => ({
            mimeType: img.mimeType,
            data: img.data,
            name: img.name,
          })),
        }),
      });
      const data = (await res.json()) as ConsultResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Échec de l’analyse");

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
      setMockBanner(data.mock);
      setStarted(true);
      setConsultationId(data.consultationId);
      persist({
        symptoms: symptoms.trim(),
        messages: nextMessages,
        assessment: data.assessment,
        emergencyDetected: data.emergencyDetected,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
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
      const ticket = await fetchConsultTicket();
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Consult-Ticket": ticket,
        },
        body: JSON.stringify({
          consultationId,
          symptoms: symptoms.slice(0, 4000),
          message: followUp.trim().slice(0, 1500),
          history,
        }),
      });
      const data = (await res.json()) as ConsultResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Échec de l’analyse");

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
      setMockBanner(data.mock);
      setFollowUp("");
      persist({
        messages: nextMessages,
        assessment: data.assessment,
        emergencyDetected: data.emergencyDetected || emergencyDetected,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
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
  }

  return (
    <div className="space-y-6">
      {(emergencyDetected || liveEmergency) && <EmergencyBanner />}

      {mockBanner && (
        <p className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-center text-sm text-[var(--brand-deep)]">
          Mode démonstration — aucune clé Gemini détectée. Les réponses sont
          réalistes mais simulées.
        </p>
      )}

      {!started ? (
        <form
          onSubmit={submitInitial}
          className="glass animate-rise space-y-6 rounded-[calc(var(--radius)+4px)] p-5 sm:p-8"
        >
          <div>
            <h1 className="font-display text-3xl text-[var(--brand-deep)] sm:text-4xl">
              Décrivez vos symptômes
            </h1>
            <p className="mt-2 text-[var(--ink-muted)]">
              Texte libre, en français. Ajoutez des photos si cela aide (peau,
              éruption, blessure…).
            </p>
          </div>

          <div>
            <label
              htmlFor="symptoms"
              className="block text-sm font-medium text-[var(--ink)]"
            >
              Symptômes
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={7}
              placeholder="Ex. : Depuis hier soir, fièvre à 38,5 °C, mal de gorge et fatigue. Pas de difficulté à respirer…"
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

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand)] px-6 py-3 text-base font-medium text-white transition hover:bg-[var(--brand-deep)] disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Analyse en cours…" : "Obtenir une orientation"}
          </button>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="glass animate-rise space-y-4 rounded-[calc(var(--radius)+4px)] p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl text-[var(--brand-deep)]">
                  Consultation
                </h1>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  Affinez votre description dans le fil de discussion.
                </p>
              </div>
              <button
                type="button"
                onClick={resetSession}
                className="shrink-0 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
              >
                Nouvelle
              </button>
            </div>

            <div
              className="max-h-[420px] space-y-3 overflow-y-auto pr-1"
              aria-live="polite"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`animate-fade-slide rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-6 bg-[var(--brand)] text-white"
                      : "mr-6 bg-white/80 text-[var(--ink)]"
                  }`}
                >
                  <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wide opacity-70">
                    {m.role === "user" ? "Vous" : "Medecin AI"}
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
            </div>

            <form
              onSubmit={submitFollowUp}
              className="space-y-3 border-t border-[var(--line)] pt-4"
            >
              <Disclaimer variant="privacy" />
              <label htmlFor="followup" className="sr-only">
                Message de suivi
              </label>
              <textarea
                id="followup"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                rows={3}
                placeholder="Précisez : durée, intensité, facteurs déclenchants…"
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
                {loading ? "Envoi…" : "Envoyer"}
              </button>
            </form>
          </section>

          <section className="glass animate-rise-delay rounded-[calc(var(--radius)+4px)] p-5 sm:p-7">
            {assessment ? (
              <AssessmentResult assessment={assessment} />
            ) : (
              <p className="text-[var(--ink-muted)]">
                L’orientation structurée apparaîtra ici.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
