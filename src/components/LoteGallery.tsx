"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";

/**
 * Galeria de mídia do Lote
 * - Mostra vídeo (se existir) como primeiro item
 * - Thumbnails clicáveis
 * - Lightbox acessível (teclado ESC, ←/→)
 * - Sem dependências externas
 */

export type LoteGalleryProps = {
  titulo?: string;
  fotos?: string[];          // URLs absolutas das imagens
  videoUrl?: string | null;  // URL absoluta do vídeo (opcional)
};

type MediaItem =
  | { kind: "video"; src: string; thumb?: string | null }
  | { kind: "image"; src: string };

export default function LoteGallery({ titulo, fotos = [], videoUrl }: LoteGalleryProps) {
  const items: MediaItem[] = useMemo(() => {
    const arr: MediaItem[] = [];
    if (videoUrl) {
      // usa a primeira foto como poster/thumbnail do vídeo (se tiver)
      arr.push({ kind: "video", src: videoUrl, thumb: fotos[0] ?? null });
    }
    for (const f of fotos) arr.push({ kind: "image", src: f });
    // fallback caso não tenha nada
    if (arr.length === 0) arr.push({ kind: "image", src: "" });
    return arr;
  }, [videoUrl, fotos]);

  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // play/pause do vídeo no item ativo (em desktop)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // pausa sempre que troca
    v.pause();
  }, [index]);

  const next = () => setIndex((i) => (i + 1 < items.length ? i + 1 : 0));
  const prev = () => setIndex((i) => (i - 1 >= 0 ? i - 1 : items.length - 1));

  // teclado na lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, items.length]);

  // abre/fecha o <dialog>
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (lightboxOpen && !d.open) d.showModal();
    if (!lightboxOpen && d.open) d.close();
  }, [lightboxOpen]);

  const ACTIVE = items[index];

  return (
    <section aria-label="Galeria do lote" className="space-y-3">
      {/* Mídia principal */}
      <div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-200"
        onMouseEnter={() => {
          if (ACTIVE.kind === "video" && videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onMouseLeave={() => {
          if (ACTIVE.kind === "video" && videoRef.current) {
            videoRef.current.pause();
          }
        }}
      >
        {ACTIVE.kind === "video" ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={(ACTIVE as any).thumb ?? undefined}
            className="h-full w-full object-cover"
            src={ACTIVE.src}
            aria-label={titulo ? `Vídeo do lote: ${titulo}` : "Vídeo do lote"}
          />
        ) : ACTIVE.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ACTIVE.src}
            alt={titulo ? `Foto do lote: ${titulo}` : "Foto do lote"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-neutral-500">
            Sem mídia
          </div>
        )}

        {/* Controles anterior/próximo */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm shadow hover:bg-white"
              aria-label="Próximo"
            >
              ›
            </button>
          </>
        )}

        {/* Abrir lightbox */}
        {ACTIVE.src && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-2 right-2 rounded-xl bg-black/50 px-3 py-1 text-xs font-medium text-white hover:bg-black/60"
            aria-label="Abrir em tela cheia"
          >
            Ampliar
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {items.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-xl border ${
                i === index ? "border-[#1C4532] ring-2 ring-[#1C4532]" : "border-black/10"
              }`}
              aria-label={`Mídia ${i + 1} de ${items.length}`}
              title={m.kind === "video" ? "Vídeo" : "Imagem"}
            >
              {m.kind === "video" ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(m as any).thumb || ""}
                    alt="Miniatura do vídeo"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[10px] text-white">
                    ▶
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.src} alt="Miniatura da imagem" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        className="m-0 max-h-[100dvh] w-[min(92vw,1100px)] max-w-[95vw] rounded-2xl bg-black/95 p-0 backdrop:bg-black/70"
        onClose={() => setLightboxOpen(false)}
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-3 py-1 text-sm hover:bg-white"
            aria-label="Fechar"
          >
            ✕
          </button>

          <div className="aspect-[16/9] w-full overflow-hidden">
            {ACTIVE.kind === "video" ? (
              <video
                controls
                className="h-full w-full object-contain bg-black"
                src={ACTIVE.src}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ACTIVE.src}
                alt={titulo ? `Foto ampliada do lote: ${titulo}` : "Foto ampliada do lote"}
                className="h-full w-full object-contain bg-black"
              />
            )}
          </div>
        </div>
      </dialog>
    </section>
  );
}
