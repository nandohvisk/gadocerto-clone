// ./src/app/lotes/[id]/page.tsx
import { sanityClient } from "@/sanity/lib/client";
import { LOTE_BY_ID_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic"; // evita SSG no build
export const revalidate = 0;            // sempre dinâmico

type Props = { params: { id: string } };

export default async function LotePage({ params }: Props) {
  const lote = await sanityClient.fetch(LOTE_BY_ID_QUERY, { id: params.id });

  if (!lote) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-bold">Lote não encontrado</h1>
        <p className="mt-2 text-sm text-gray-600">
          Verifique o código do lote ou volte para a página de listagem.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">{lote.titulo ?? "Lote"}</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 text-sm">
          <p><b>Categoria:</b> {lote.categoria ?? "-"}</p>
          <p><b>Raça:</b> {lote.raca ?? "-"}</p>
          <p><b>Idade (meses):</b> {lote.idadeMeses ?? "-"}</p>
          <p><b>Peso médio (kg):</b> {lote.pesoMedioKg ?? "-"}</p>
          <p><b>Cabeças:</b> {lote.cabecas ?? "-"}</p>
          <p><b>Local:</b> {lote.municipio ?? "-"} / {lote.uf ?? "-"}</p>
          <p><b>WhatsApp:</b> {lote.whatsapp ?? "-"}</p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          {Array.isArray(lote.fotos) && lote.fotos.length > 0 ? (
            // mostra a primeira foto
            <img
              src={lote.fotos[0]}
              alt={lote.titulo ?? "foto do lote"}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Sem fotos
            </div>
          )}
        </div>
      </div>

      {/* vídeos (se houver) */}
      {Array.isArray(lote.videosArquivo) && lote.videosArquivo.length > 0 && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Vídeos</h2>
          {lote.videosArquivo.map((v: string, i: number) => (
            <video key={i} src={v} controls className="w-full rounded-lg" />
          ))}
        </section>
      )}

      {Array.isArray(lote.videosUrl) && lote.videosUrl.length > 0 && (
        <section className="mt-8 space-y-2">
          <h2 className="text-xl font-semibold">Links de vídeo</h2>
          <ul className="list-disc ml-6">
            {lote.videosUrl.map((url: string, i: number) => (
              <li key={i}>
                <a className="underline" href={url} target="_blank" rel="noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

// IMPORTANTE: Se houver no arquivo original algo como
// export async function generateStaticParams() { ... }
// remova esse export para evitar pré-renderização no build.
