// F:\gadocerto-clone\gadocerto-clone\src\components\LoteCard.tsx
import Link from "next/link";
import React from "react";

export type Lote = {
  id: string;
  titulo: string;
  categoria?: string;
  raca?: string;
  idadeMeses?: number;
  pesoMedioKg?: number;
  cabecas?: number;
  municipio?: string;
  uf?: string;
  fotos?: string[];
  whatsapp?: string;
  precoLabel?: string;
  videoUrl?: string | null;
  emoji?: string; // definível pelo painel admin (futuro)
};

type Props = {
  lote: Lote;
  primary?: string; // cor primária do tema (verde escuro)
  isLoggedIn: boolean;
};

/* ----------------- Ícones ----------------- */
const IconLocal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
    />
  </svg>
);
const IconHeads = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M16 11a4 4 0 1 0-3.446-6.03A4 4 0 1 0 8 11c-2.21 0-4 1.79-4 4v1h16v-1c0-2.21-1.79-4-4-4Z"
    />
  </svg>
);
const IconWeight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M5 20h14l-2-12H7L5 20Zm8-10v2h-2v-2h2Zm-2 4h2v2h-2v-2Z"
    />
  </svg>
);
const IconAge = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M12 7V3l-2 .02V7H7l5 5l5-5h-3V3h-2v4Z"
    />
    <path fill="currentColor" d="M19 13H5v6h14v-6Z" />
  </svg>
);
const IconBreed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M2 12s3-5 10-5s10 5 10 5s-3 5-10 5S2 12 2 12Zm10-3.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z"
    />
  </svg>
);
const IconCategory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path fill="currentColor" d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z" />
  </svg>
);
const IconWhats = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="currentColor"
      d="M20 3.5A10.5 10.5 0 0 0 3.5 20L2 22l2-.5A10.5 10.5 0 1 0 20 3.5m-8.6 4c.3 0 .6 0 .8.6l.5 1.2c.1.4.1.6-.1.8l-.5.6c.4.8 1.1 1.6 1.9 2.2c.7.5 1.4.8 2.1 1l.5-.5c.2-.2.5-.2.8 0l1.2.5c.3.1.5.2.6.4c.1.2.1.5-.1.8c-.4.6-1.1 1.2-2 1.2c-.4 0-1.2-.1-2.4-.7c-1.3-.6-2.4-1.5-3.4-2.7c-1-1.1-1.6-2.2-1.9-3.1c-.3-1-.3-1.7 0-2.2c.3-.8 1-1.4 1.9-1.6Z"
    />
  </svg>
);

export default function LoteCard({
  lote,
  primary = "#1C4532",
  isLoggedIn,
}: Props) {
  const foto =
    Array.isArray(lote.fotos) && lote.fotos.length > 0 ? lote.fotos[0] : null;
  const whatsHref = lote.whatsapp
    ? `https://wa.me/${lote.whatsapp.replace(/\D/g, "")}`
    : undefined;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-[#F7F4EE] shadow-sm transition hover:shadow-md">
      {/* Mídia */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        {foto ? (
          <img
            src={foto}
            alt={lote.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
            Sem mídia
          </div>
        )}

        {/* canto superior esquerdo: emoji pulsante + login */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span
            className="relative text-2xl animate-pulse"
            style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.2))" }}
          >
            {lote.emoji || "🐮"}
          </span>

          {!isLoggedIn && (
            <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
              Faça{" "}
              {/* ✅ agora aponta para /login */}
              <Link href="/login" className="mx-1 underline">
                login
              </Link>{" "}
              para ver preço.
            </span>
          )}
        </div>

        {/* selo de preço */}
        {lote.precoLabel && (
          <span
            className="absolute right-3 top-3 rounded-md px-2 py-1 text-xs font-semibold text-[#1c1c1c]"
            style={{
              backgroundImage: "linear-gradient(to bottom, #C9A227, #a8841a)",
            }}
          >
            {lote.precoLabel}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-gray-900">
          {lote.titulo}
        </h3>

        {/* informações */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
          {lote.categoria && (
            <div className="inline-flex items-center gap-2">
              <IconCategory />
              <span className="text-gray-500">Categoria</span> •{" "}
              <span className="font-medium">{lote.categoria}</span>
            </div>
          )}
          {lote.raca && (
            <div className="inline-flex items-center gap-2">
              <IconBreed />
              <span className="text-gray-500">Raça</span> •{" "}
              <span className="font-medium">{lote.raca}</span>
            </div>
          )}
          {!!lote.cabecas && (
            <div className="inline-flex items-center gap-2">
              <IconHeads />
              <span className="text-gray-500">Cabeças</span> •{" "}
              <span className="font-medium">{lote.cabecas}</span>
            </div>
          )}
          {!!lote.pesoMedioKg && (
            <div className="inline-flex items-center gap-2">
              <IconWeight />
              <span className="text-gray-500">Kg médios</span> •{" "}
              <span className="font-medium">{lote.pesoMedioKg}</span>
            </div>
          )}
          {!!lote.idadeMeses && (
            <div className="inline-flex items-center gap-2">
              <IconAge />
              <span className="text-gray-500">Idade</span> •{" "}
              <span className="font-medium">{lote.idadeMeses} meses</span>
            </div>
          )}
          {(lote.municipio || lote.uf) && (
            <div className="col-span-2 inline-flex items-center gap-2">
              <IconLocal />
              <span className="font-medium">
                {lote.municipio?.toLowerCase()}/{lote.uf?.toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {/* empurra ações para o rodapé, mantendo altura consistente */}
        <div className="mt-auto" />

        {/* botões lado a lado */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href={`/lotes/${lote.id}`}
            className="btn btn-primary w-full"
            style={{
              backgroundColor: "#C9A227",
              color: "#1C4532",
              fontWeight: 600,
            }}
          >
            Ver lote
          </Link>

          {whatsHref ? (
            <a
              href={whatsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-full hover:opacity-90 transition"
              style={{
                backgroundColor: "#4CAF50",
                color: "#FFFFFF",
                border: `2px solid ${primary}`, // usa a cor primária para borda
              }}
              title="Falar no WhatsApp"
              aria-label="Falar no WhatsApp"
            >
              <span className="mr-2 inline-flex">
                <IconWhats />
              </span>
              WhatsApp
            </a>
          ) : (
            <span className="btn w-full opacity-60 cursor-not-allowed">
              Sem WhatsApp
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
