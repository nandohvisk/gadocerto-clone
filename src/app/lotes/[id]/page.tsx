// src/app/lotes/[id]/page.tsx
import {sanityClient} from "@/sanity/lib/client";
import {LOTE_BY_ID_QUERY} from "@/sanity/lib/queries";
import Link from "next/link";
import {notFound} from "next/navigation";

type Lote = {
  _id: string;
  titulo: string;
  categoria?: string;
  raca?: string;
  idadeMeses?: number;
  pesoMedioKg?: number;
  cabecas?: number;
  municipio?: string;
  uf?: string;
  whatsapp?: string;
  fotos?: string[];
  videosArquivo?: string[];
  videosUrl?: string[];
};

export default async function LoteDetalhe({ params }: { params: { id: string } }) {
  const lote = await sanityClient.fetch<Lote>(LOTE_BY_ID_QUERY, { id: params.id });
  if (!lote?._id) return notFound();

  const waMsg = encodeURIComponent(`Olá! Tenho interesse no ${lote.titulo}. Podemos conversar?`);
  const waLink = `https://wa.me/${lote.whatsapp ?? ""}?text=${waMsg}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/lotes" className="text-sm hover:underline">← Voltar aos lotes</Link>

      <h1 className="text-2xl font-bold mt-4">{lote.titulo}</h1>

      {/* Fotos e Vídeos */}
      <div className="mt-4 grid gap-4">
        {lote.fotos?.map((src, i) => (
          <img
            key={`f${i}`}
            src={src}
            alt={`${lote.titulo} foto ${i+1}`}
            className="w-full rounded-xl border"
          />
        ))}

        {lote.videosArquivo?.map((src, i) => (
          <video
            key={`vA${i}`}
            src={src}
            controls
            className="w-full rounded-xl border"
          />
        ))}

        {lote.videosUrl?.map((url, i) => (
          <div key={`vU${i}`} className="aspect-video w-full rounded-xl border overflow-hidden">
            <iframe
              src={url}
              className="w-full h-full"
              allow="autoplay; clipboard-write; encrypted-media"
            />
          </div>
        ))}
      </div>

      {/* Detalhes do lote */}
      <div className="mt-6 space-y-1 text-sm">
        <div><b>Categoria:</b> {lote.categoria}</div>
        <div><b>Raça:</b> {lote.raca}</div>
        <div><b>Idade:</b> {lote.idadeMeses} meses</div>
        <div><b>Peso médio:</b> {lote.pesoMedioKg} kg</div>
        <div><b>Cabeças:</b> {lote.cabecas}</div>
        <div><b>Local:</b> {lote.municipio}/{lote.uf}</div>
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href={waLink}
          target="_blank"
          className="rounded-lg px-5 py-2 bg-black text-white hover:opacity-90 text-sm"
        >
          Conversar no WhatsApp
        </a>
      </div>
    </main>
  );
}
