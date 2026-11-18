"use client";

import { useId, useRef } from "react";
import type { UploadedImage } from "@/lib/types";

type Props = {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max?: number;
};

const MAX_BYTES = 3.5 * 1024 * 1024;

async function fileToUploaded(file: File): Promise<UploadedImage> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const data = btoa(binary);
  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    name: file.name,
    mimeType: file.type || "image/jpeg",
    data,
    previewUrl: URL.createObjectURL(file),
  };
}

export function ImageUpload({ images, onChange, max = 4 }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const remaining = max - images.length;
    const selected = Array.from(fileList).slice(0, remaining);
    const accepted: UploadedImage[] = [];
    for (const file of selected) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_BYTES) {
        window.alert(`« ${file.name} » dépasse 3,5 Mo.`);
        continue;
      }
      accepted.push(await fileToUploaded(file));
    }
    if (accepted.length) onChange([...images, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(id: string) {
    const next = images.filter((img) => img.id !== id);
    const removed = images.find((img) => img.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    onChange(next);
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[var(--ink)]"
      >
        Photos (optionnel)
      </label>
      <p className="mt-1 text-sm text-[var(--ink-muted)]">
        Peau, éruption, blessure… jusqu’à {max} images. Ne photographiez pas de
        documents d’identité.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={images.length >= max}
          className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Ajouter des photos
        </button>
        <span className="text-xs text-[var(--ink-muted)]">
          {images.length}/{max}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <li key={img.id} className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={img.name}
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(img.id)}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                aria-label={`Retirer ${img.name}`}
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
