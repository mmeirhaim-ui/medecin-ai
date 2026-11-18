import type { Consultation } from "./types";

const KEY = "medcin-ai-consultations-v1";

export function loadConsultations(): Consultation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Consultation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConsultations(list: Consultation[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertConsultation(c: Consultation): Consultation[] {
  const list = loadConsultations();
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx >= 0) list[idx] = c;
  else list.unshift(c);
  saveConsultations(list);
  return list;
}

export function getConsultation(id: string): Consultation | undefined {
  return loadConsultations().find((c) => c.id === id);
}

export function deleteConsultation(id: string): Consultation[] {
  const list = loadConsultations().filter((c) => c.id !== id);
  saveConsultations(list);
  return list;
}
