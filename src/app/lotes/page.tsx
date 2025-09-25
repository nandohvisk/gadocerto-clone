// src/app/lotes/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LOTES, Lote } from "@/data/lotes";

export default function LotesPage() {
  const [q, setQ] = useState("");
  const [uf, setUf] = useState<string>("");

  const filtrados = useMemo(() => {
    return LOTES.filter((l) => {
      const termo = q.toLowerCase();
      const bateTexto =
        l.titulo.toLowerCase().includes(termo) ||
        l.raca.toLowerCase().includes(termo) ||
        l.categoria.toLowerCase().includes(termo);
      const bateUf = uf ? l.uf === uf : true;
      return bateTexto && bateUf;
    });
  }, [q, uf]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lotes disponíveis</h1>
            <p className="text-gray-600 text-sm">
              Dados fictícios — clique para detalhes ou entre em contato pelo WhatsApp.
            </p>
          </div>
          <Link href="/" className="text-sm hover:underline">← Voltar</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por categoria/raça/título..."
            className="border rounded-lg px-3 py-2"
          />
          <select
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">UF (todas)</option>
            <option value="MT">MT</option>
            {/* adicione outras UFs quando tiver dados */}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((lote) => (
            <CardLote key={lote.id} lote={lote} />
          ))}
        </div>
      </div>
    </main>
  );
}

function CardLote({ lote }: { lote: Lote }) {
  const waMsg = encodeURIComponent(`Olá! Tenho interesse no ${lote.titulo} (${lote.cabecas} cabeças)`);
  const waLink = `https://wa.me/${lote.whatsapp}?text=${waMsg}`;

  return (
    <div className="border rounded-2xl overflow-hidden flex flex-col">
      <img
        src={lote.fotos[0]}
        alt={lote.titulo}
        className="w-full h-44 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold">{lote.titulo}</h3>
        <p className="text-sm text-gray-600">
          {lote.categoria} • {lote.raca}
        </p>
        <p className="text-sm text-gray-600">
          {lote.cabecas} cabeças • {lote.pesoMedioKg} kg médios
        </p>
        <p className="text-sm text-gray-600">
          {lote.municipio}/{lote.uf}
        </p>
        <div className="mt-auto flex gap-2 pt-3">
          <Link
            href={`/lotes/${lote.id}`}
            className="flex-1 text-center rounded-lg border px-3 py-2 hover:bg-gray-50 text-sm"
          >
            Detalhes
          </Link>
          <a
            href={waLink}
            target="_blank"
            className="flex-1 text-center rounded-lg px-3 py-2 bg-black text-white text-sm hover:opacity-90"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
