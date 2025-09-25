// src/app/lotes/[id]/page.tsx
import { LOTES } from "@/data/lotes";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default function LoteDetalhe({ params }: Props) {
  const lote = LOTES.find((l) => l.id === params.id);
  if (!lote) return notFound();

  const waMsg = encodeURIComponent(`Olá! Tenho interesse no ${lote.titulo}. Podemos conversar?`);
  const waLink = `https://wa.me/${lote.whatsapp}?text=${waMsg}`;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/lotes" className="text-sm hover:underline">← Voltar aos lotes</Link>

        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <img
            src={lote.fotos[0]}
            alt={lote.titulo}
            className="w-full h-72 object-cover rounded-2xl border"
          />
          <div>
            <h1 className="text-2xl font-bold">{lote.titulo}</h1>
            <ul className="mt-3 text-sm text-gray-700 space-y-1">
              <li><b>Categoria:</b> {lote.categoria}</li>
              <li><b>Raça:</b> {lote.raca}</li>
              <li><b>Idade:</b> {lote.idadeMeses} meses</li>
              <li><b>Peso médio:</b> {lote.pesoMedioKg} kg</li>
              <li><b>Cabeças:</b> {lote.cabecas}</li>
              <li><b>Local:</b> {lote.municipio}/{lote.uf}</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <a
                href={waLink}
                target="_blank"
                className="rounded-lg px-5 py-2 bg-black text-white hover:opacity-90 text-sm"
              >
                Conversar no WhatsApp
              </a>
              <Link
                href="/contato"
                className="rounded-lg px-5 py-2 border hover:bg-gray-50 text-sm"
              >
                Enviar proposta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
