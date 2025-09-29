// src/app/lotes/page.tsx
import {sanityClient} from "@/sanity/lib/client";
import {LOTES_QUERY} from "@/sanity/lib/queries";

type Lote = {
  _id: string;
  titulo: string;
  fotos?: string[];
};

export default async function LotesPage() {
  const lotes = await sanityClient.fetch<Lote[]>(LOTES_QUERY);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Lotes</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {lotes.map((lote) => (
          <a
            key={lote._id}
            href={`/lotes/${lote._id}`}
            className="rounded-xl border overflow-hidden hover:shadow-lg"
          >
            <img
              src={lote.fotos?.[0] ?? "/hero-gado.jpg"}
              className="w-full h-48 object-cover"
              alt={lote.titulo}
            />
            <div className="p-3 text-sm font-medium">{lote.titulo}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
