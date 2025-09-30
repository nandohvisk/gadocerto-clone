import Link from "next/link";
import { notFound } from "next/navigation";

import { sanityClient } from "../../../sanity/lib/client";
import { LOTE_BY_ID_QUERY } from "../../../sanity/lib/queries";

type Lote = {
  _id: string;
  id: string;
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

export default async function LoteDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lote = (await sanityClient.fetch(LOTE_BY_ID_QUERY, { id })) as Lote | null;
  if (!lote?._id) return notFound();

  const fotos = lote.fotos ?? [];
  const videos = [...(lote.videosUrl ?? []), ...(lote.videosArquivo ?? [])];

  const msg = encodeURIComponent(`Olá! Tenho interesse no lote: ${lote.titulo}. Podemos conversar?`);
  const wa = lote.whatsapp ? `https://wa.me/${lote.whatsapp}?text=${msg}` : undefined;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/lotes" className="text-sm hover:underline">
          ← Voltar aos lotes
        </Link>

        <header className="mt-4">
          <h1 className="text-2xl md:text-3xl font-bold">{lote.titulo}</h1>
          <ul className="mt-3 text-sm text-gray-700 grid gap-1">
            {lote.categoria && <li><b>Categoria:</b> {lote.categoria}</li>}
            {lote.raca && <li><b>Raça:</b> {lote.raca}</li>}
            {typeof lote.idadeMeses === "number" && <li><b>Idade:</b> {lote.idadeMeses} meses</li>}
            {typeof lote.pesoMedioKg === "number" && <li><b>Peso médio:</b> {lote.pesoMedioKg} kg</li>}
            {typeof lote.cabecas === "number" && <li><b>Cabeças:</b> {lote.cabecas}</li>}
            {(lote.municipio || lote.uf) && (
              <li><b>Local:</b> {lote.municipio}{lote.municipio && lote.uf ? "/" : ""}{lote.uf}</li>
            )}
          </ul>

          <div className="mt-6 flex gap-3">
            {wa && (
              <a href={wa} target="_blank" className="rounded-lg px-5 py-2 bg-black text-white hover:opacity-90 text-sm">
                Conversar no WhatsApp
              </a>
            )}
            <Link href="/contato" className="rounded-lg px-5 py-2 border hover:bg-gray-50 text-sm">
              Enviar proposta
            </Link>
          </div>
        </header>

        {fotos.length > 0 && (
          <section className="mt-8">
            <h2 className="font-semibold mb-3">Fotos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fotos.map((src, i) => (
                <img
                  key={`foto-${i}`}
                  src={src}
                  alt={`${lote.titulo} foto ${i + 1}`}
                  className="w-full aspect-video object-cover rounded-xl border"
                  loading="lazy"
                />
              ))}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="mt-10">
            <h2 className="font-semibold mb-3">Vídeos</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {videos.map((src, i) => (
                <div key={`video-${i}`} className="w-full">
                  <video src={src} controls className="w-full aspect-video rounded-xl border" preload="metadata" />
                  <div className="mt-1 text-xs text-gray-500">Vídeo {i + 1}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {fotos.length === 0 && videos.length === 0 && (
          <p className="mt-8 text-sm text-gray-500">Este lote ainda não possui mídias cadastradas.</p>
        )}
      </div>
    </main>
  );
}
