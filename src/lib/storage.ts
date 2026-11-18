import type { Consultation } from "./types";

const KEY = "doctor-ia-consultations-v1";
const LEGACY_KEYS = [
  "medcin-ai-consultations-v1",
  "medecin-ai-consultations-v1",
];

function readRaw(key: string): Consultation[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Consultation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadConsultations(): Consultation[] {
  if (typeof window === "undefined") return [];
  const current = readRaw(KEY);
  if (current.length) return current;
  for (const legacy of LEGACY_KEYS) {
    const old = readRaw(legacy);
    if (old.length) {
      saveConsultations(old);
      return old;
    }
  }
  return [];
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
