// F:\gadocerto-clone\src\app\lotes\page.tsx
import Link from "next/link";
import client from "../../sanity/lib/client";
import { LOTES_QUERY } from "../../sanity/lib/queries";

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
  fotos?: string[];
};

export default async function LotesPage() {
  const lotes = await client.fetch<Lote[]>(LOTES_QUERY);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Lotes</h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lotes.map((lote) => (
          <Link key={lote._id} href={`/lotes/${lote._id}`} className="block border rounded-xl overflow-hidden hover:shadow">
            <img
              src={lote.fotos?.[0] || "/hero-gado.jpg"}
              alt={lote.titulo}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-sm">
              <div className="font-semibold">{lote.titulo}</div>
              <div className="text-gray-600 mt-1">
                {lote.municipio}/{lote.uf} · {lote.cabecas ?? 0} cabeças
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
