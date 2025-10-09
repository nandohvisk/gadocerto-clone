// F:\gadocerto-clone\gadocerto-clone\src\app\lotes\LotesClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoteCard, { type Lote as LoteType } from "@/components/LoteCard";

type Category = { id?: string; label: string; value: string };

export default function LotesClient() {
  const router = useRouter();
  const search = useSearchParams();

  // lê params atuais
  const qParam = search.get("q") ?? "";
  const catParam = search.get("categoria") ?? "";
  const ufParam = search.get("uf") ?? "";

  // estados dos filtros
  const [textoBusca, setTextoBusca] = useState(qParam);
  const [categoria, setCategoria] = useState(catParam);
  const [uf, setUf] = useState(ufParam);

  // dados
  const [cats, setCats] = useState<Category[]>([]);
  const [lotes, setLotes] = useState<LoteType[]>([]);
  const [loading, setLoading] = useState(false);

  // carrega categorias do painel
  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data: Category[] = await res.json();
        if (!stop) setCats(Array.isArray(data) ? data : []);
      } catch {
        if (!stop) setCats([]);
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  // função para montar /api/lotes?q=...&categoria=...&uf=...
  const buildQuery = useMemo(() => {
    return (q?: string, categoria?: string, uf?: string) => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (categoria) p.set("categoria", categoria);
      if (uf) p.set("uf", uf);
      return p.toString();
    };
  }, []);

  // busca lotes sempre que os params mudarem (navegação do usuário)
  useEffect(() => {
    let stop = false;
    (async () => {
      setLoading(true);
      try {
        const qs = buildQuery(qParam || undefined, catParam || undefined, ufParam || undefined);
        const res = await fetch(`/api/lotes${qs ? `?${qs}` : ""}`, { cache: "no-store" });
        const data: any[] = await res.json();
        if (!stop) {
          const mapped: LoteType[] = (data ?? []).map((r: any) => ({
            id: r._id ?? r.id,
            titulo: r.titulo ?? "Lote",
            categoria: r.categoriaValue ?? r.categoriaLabel ?? r.categoria,
            raca: r.raca ?? "",
            idadeMeses: r.idadeMeses ?? 0,
            pesoMedioKg: r.pesoMedioKg ?? 0,
            cabecas: r.cabecas ?? 0,
            municipio: r.municipio ?? "",
            uf: r.uf ?? "",
            fotos: Array.isArray(r.fotos) ? r.fotos.filter(Boolean) : [],
            whatsapp: r.whatsapp || "",
            // 🔧 normaliza para string | undefined (nunca null)
            precoLabel: r.precoLabel ?? undefined,
            // opcional no card; manter por compat
            videoUrl: r.videoUrl ?? r.video?.url ?? r.video?.asset?.url ?? undefined,
          }));
          setLotes(mapped);
        }
      } catch {
        if (!stop) setLotes([]);
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [qParam, catParam, ufParam, buildQuery]);

  function aplicarFiltros(e?: React.FormEvent) {
    e?.preventDefault();
    const qs = buildQuery(
      textoBusca ? textoBusca.trim() : undefined,
      categoria || undefined,
      uf || undefined
    );
    router.push(`/lotes${qs ? `?${qs}` : ""}`);
  }

  function limpar() {
    setTextoBusca("");
    setCategoria("");
    setUf("");
    router.push("/lotes");
  }

  const primary = "var(--agro-wheat)";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-medium text-emerald-700">Lotes</p>
      <h1 className="h-section mt-1">Todos os lotes publicados</h1>
      <p className="mt-1 text-sm text-gray-600">
        Use os filtros para encontrar o lote ideal por categoria, UF ou pesquisa.
      </p>

      {/* Filtros */}
      <form onSubmit={aplicarFiltros} className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Buscar por título, cidade, raça…"
          className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={textoBusca}
          onChange={(e) => setTextoBusca(e.target.value)}
        />

        <select
          className="md:w-56 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Categoria</option>
          {cats.map((c, idx) => (
            <option key={`${c.id ?? c.value ?? "opt"}-${idx}`} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          className="md:w-40 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={uf}
          onChange={(e) => setUf(e.target.value)}
        >
          <option value="">UF</option>
          {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(
            (sigla) => (
              <option key={sigla} value={sigla}>
                {sigla}
              </option>
            )
          )}
        </select>

        <button
          type="submit"
          className="btn btn-primary md:w-40 w-full"
          style={{ backgroundImage: "linear-gradient(to bottom, #eab308, #d4a106)" }}
        >
          Pesquisar
        </button>

        <button
          type="button"
          className="btn btn-secondary md:w-40 w-full"
          onClick={limpar}
        >
          Limpar filtros
        </button>
      </form>

      {/* Lista */}
      <div className="mt-6 text-sm text-gray-600">
        {loading ? "Carregando…" : `${lotes.length} resultado${lotes.length === 1 ? "" : "s"}`}
      </div>

      {!loading && lotes.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-gray-600">
          Nenhum lote encontrado.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lotes.map((l) => (
            <LoteCard key={l.id} lote={l} primary={primary} isLoggedIn={false} />
          ))}
        </div>
      )}
    </main>
  );
}
