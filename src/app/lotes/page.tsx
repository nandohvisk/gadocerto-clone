// ./src/app/lotes/page.tsx
import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { LOTES_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LoteThumb = {
  _id: string;
  id?: string;
  titulo?: string;
  municipio?: string;
  uf?: string;
  foto?: string;
};

export default async function LotesPage() {
  const lotes = (await sanityClient.fetch<LoteThumb[]>(LOTES_QUERY)) ?? [];

  if (!lotes.length) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold">Lotes</h1>
        <p className="mt-2 text-gray-600">Ainda não há lotes cadastrados.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold mb-6">Lotes</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {lotes.map((lote) => (
          <Link
            key={lote._id}
            href={`/lotes/${lote.id ?? lote._id}`}
            className="border rounded-xl overflow-hidden hover:shadow transition"
          >
            <div className="aspect-video bg-gray-100">
              {lote.foto ? (
                <img
                  src={lote.foto}
                  alt={lote.titulo ?? "Lote"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Sem foto
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-semibold">{lote.titulo ?? "Lote"}</h2>
              <p className="text-sm text-gray-600">
                {(lote.municipio ?? "-") + " / " + (lote.uf ?? "-")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
