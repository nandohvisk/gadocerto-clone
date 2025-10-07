// F:\gadocerto-clone\gadocerto-clone\src\components\LotesExplorer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import LoteCard, { Lote } from "./LoteCard";

type Category = { id?: string; label: string; value: string };

const UFs = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI",
  "PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

type Props = { initialLots: Lote[] };

export default function LotesExplorer({ initialLots }: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [categoria, setCategoria] = useState("");
  const [uf, setUF] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        setCats(Array.isArray(data) && data.length ? data : [
          { label: "Bezerro", value: "bezerro" },
          { label: "Novilha", value: "novilha" },
          { label: "Boi gordo", value: "boi" },
          { label: "Vaca", value: "vaca" },
        ]);
      } catch {
        setCats([
          { label: "Bezerro", value: "bezerro" },
          { label: "Novilha", value: "novilha" },
          { label: "Boi gordo", value: "boi" },
          { label: "Vaca", value: "vaca" },
        ]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const nq = q.trim().toLowerCase();
    return initialLots.filter((l) => {
      const okCat = categoria ? (l.categoria ?? "").toLowerCase() === categoria.toLowerCase() : true;
      const okUF  = uf        ? (l.uf ?? "").toLowerCase()        === uf.toLowerCase()         : true;

      const texto = `${l.titulo ?? ""} ${l.municipio ?? ""} ${l.raca ?? ""} ${l.categoria ?? ""}`;
      const okQ = nq ? texto.toLowerCase().includes(nq) : true;

      return okCat && okUF && okQ;
    });
  }, [initialLots, categoria, uf, q]);

  function clearFilters() {
    setCategoria("");
    setUF("");
    setQ("");
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px_160px_140px]">
        <input
          type="text"
          placeholder="Buscar por título, cidade, raça…"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Categoria</option>
          {cats.map((c) => (
            <option key={c.id ?? c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <select
          className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={uf}
          onChange={(e) => setUF(e.target.value)}
        >
          <option value="">UF</option>
          {UFs.map((sigla) => (
            <option key={sigla} value={sigla}>{sigla}</option>
          ))}
        </select>

        <button onClick={clearFilters} className="btn btn-secondary">
          Limpar filtros
        </button>
      </div>

      {/* Contagem */}
      <div className="mb-4 text-sm p-muted">
        {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm p-10 text-center">
          <h3 className="text-base font-semibold text-gray-900">Nenhum resultado</h3>
          <p className="mt-1 text-sm p-muted">
            Ajuste os filtros ou limpe-os para ver todos os lotes disponíveis.
          </p>
          <div className="mt-5 flex items-center justify-center">
            <button onClick={clearFilters} className="btn btn-primary">
              Limpar e mostrar todos
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lote) => (
            <LoteCard key={lote.id} lote={lote} isLoggedIn={false} />
          ))}
        </div>
      )}
    </div>
  );
}
