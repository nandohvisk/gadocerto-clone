// F:\gadocerto-clone\gadocerto-clone\src\components\LoteCard.tsx
import Link from "next/link";
import React from "react";

/** Tipo exportado (outros módulos importam { Lote } daqui) */
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
  fotos?: string[]; // urls
  whatsapp?: string;
  precoLabel?: string;
  videoUrl?: string | null;
};

type Props = {
  lote: Lote;
  primary?: string;
  isLoggedIn: boolean;
};

export default function LoteCard({ lote, primary = "var(--agro-wheat)", isLoggedIn }: Props) {
  const foto = Array.isArray(lote.fotos) && lote.fotos.length > 0 ? lote.fotos[0] : null;

  return (
    <article
      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition
                 hover:shadow-md"
    >
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

        {/* Preço ou rótulo, se houver */}
        {lote.precoLabel && (
          <span
            className="absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold text-[#1c1c1c]"
            style={{ backgroundImage: "linear-gradient(to bottom, var(--agro-wheat), #d4a106)" }}
          >
            {lote.precoLabel}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="space-y-3 p-4">
        <header className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-gray-900">
            {lote.titulo}
          </h3>
        </header>

        {/* Metadados principais */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          {lote.categoria && (
            <div>
              <span className="text-gray-500">categoria • </span>
              <span className="font-medium text-gray-800">{lote.categoria}</span>
            </div>
          )}
          {lote.raca && (
            <div>
              <span className="text-gray-500">raça • </span>
              <span className="font-medium text-gray-800">{lote.raca}</span>
            </div>
          )}
          {!!lote.cabecas && (
            <div>
              <span className="text-gray-500">cabeças • </span>
              <span className="font-medium text-gray-800">{lote.cabecas}</span>
            </div>
          )}
          {!!lote.pesoMedioKg && (
            <div>
              <span className="text-gray-500">kg médios • </span>
              <span className="font-medium text-gray-800">{lote.pesoMedioKg}</span>
            </div>
          )}
          {!!lote.idadeMeses && (
            <div>
              <span className="text-gray-500">idade • </span>
              <span className="font-medium text-gray-800">{lote.idadeMeses} meses</span>
            </div>
          )}
          {(lote.municipio || lote.uf) && (
            <div className="col-span-2">
              <span className="text-gray-500">local • </span>
              <span className="font-medium text-gray-800">
                {lote.municipio?.toLowerCase()}/{lote.uf?.toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <Link href={`/lotes/${lote.id}`} className="btn btn-secondary">
            Detalhes
          </Link>

          {/* WhatsApp – manter policy de login simples */}
          {!isLoggedIn ? (
            <span className="text-xs text-gray-500">
              Faça <Link href="/login" className="underline">login</Link> para ver preço e liberar o WhatsApp.
            </span>
          ) : lote.whatsapp ? (
            <a
              href={`https://wa.me/${lote.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ backgroundImage: "linear-gradient(to bottom, var(--agro-wheat), #d4a106)" }}
            >
              Falar no WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
