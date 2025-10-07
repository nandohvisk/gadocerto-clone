"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

type Category = { id?: string; label: string; value: string };

// util: normaliza para buscas
function normalize(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

export default function LotesPage() {
  const router = useRouter();
  const params = useSearchParams();

  // filtros vindos da URL (para URL compartilhável)
  const qFromUrl = params.get("q") ?? "";
  const catFromUrl = params.get("categoria") ?? "";
  const ufFromUrl = params.get("uf") ?? "";

  const [q, setQ] = useState(qFromUrl);
  const [categoria, setCategoria] = useState(catFromUrl);
  const [uf, setUf] = useState(ufFromUrl);

  // categorias do painel
  const [cats, setCats] = useState<Category[]>([]);
  // lotes (lista já filtrada pelo servidor – se você quiser, depois a gente move o filtro pro server)
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  // carrega categorias e lotes (client-side simples)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        // categorias
        const catsRes = await fetch("/api/categories");
        const catsJson: Category[] = (await catsRes.json()) ?? [];
        if (!ignore) setCats(catsJson);

        // lotes — aqui passamos os filtros atuais (q/categoria/uf) como querystring
        const qs = new URLSearchParams({});
        if (qFromUrl) qs.set("q", qFromUrl);
        if (catFromUrl) qs.set("categoria", catFromUrl);
        if (ufFromUrl) qs.set("uf", ufFromUrl);

        const lotesRes = await fetch("/api/lotes?" + qs.toString());
        const lotesJson: Lote[] = (await lotesRes.json()) ?? [];
        if (!ignore) setLotes(lotesJson);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl, catFromUrl, ufFromUrl]);

  // opções de UF estáticas
  const ufs = useMemo(
    () =>
      [
        "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
        "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
      ] as const,
    []
  );

  // submit → atualiza a URL (query params)
  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams({});
    if (q.trim()) qs.set("q", q.trim());
    if (categoria.trim()) qs.set("categoria", categoria.trim());
    if (uf.trim()) qs.set("uf", uf.trim());
    router.push("/lotes" + (qs.toString() ? `?${qs.toString()}` : ""));
  }

  // limpar → vai para /lotes (sem filtros)
  function onClear() {
    setQ("");
    setCategoria("");
    setUf("");
    router.push("/lotes");
  }

  // Para “Categoria” pesquisável usamos <input list="..."> com <datalist> (leve e nativo).
  const catOptions = useMemo(() => cats.map(c => c.label ?? c.value).filter(Boolean), [cats]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm text-emerald-700 font-medium">Lotes</p>
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Todos os lotes publicados</h1>
      <p className="mt-2 text-sm text-gray-600">
        Use os filtros para encontrar o lote ideal por categoria, UF ou pesquisa.
      </p>

      {/* Barra de filtros */}
      <form onSubmit={onSearch} className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="Buscar por título, cidade, raça..."
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        {/* Categoria pesquisável com datalist */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            list="lista-categorias"
            placeholder="Categoria"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <datalist id="lista-categorias">
            {catOptions.map((label) => (
              <option key={label} value={label} />
            ))}
          </datalist>
        </div>

        {/* UF */}
        <select
          className="w-full md:w-40 rounded-xl border px-4 py-3 outline-none focus:ring-2"
          value={uf}
          onChange={(e) => setUf(e.target.value)}
        >
          <option value="">UF</option>
          {ufs.map((sigla) => (
            <option key={sigla} value={sigla}>
              {sigla}
            </option>
          ))}
        </select>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="btn btn-primary rounded-xl px-5 py-3"
            style={{ backgroundImage: "linear-gradient(to bottom, #eab308, #d4a106)" }}
          >
            Pesquisar
          </button>

          <button
            type="button"
            onClick={onClear}
            className="btn btn-secondary rounded-xl px-5 py-3"
            style={{ border: "1px solid rgba(0,0,0,0.06)" }}
          >
            Limpar filtros
          </button>
        </div>
      </form>

      {/* contagem */}
      <div className="mt-3 text-sm text-gray-600">
        {loading ? "Carregando..." : `${lotes.length} resultado${lotes.length === 1 ? "" : "s"}`}
      </div>

      {/* grid de cards (placeholder simples – mantém o que você já tinha) */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lotes.map((l) => (
          <div key={l._id} className="rounded-2xl border p-3">
            <div className="aspect-[16/10] bg-gray-100 rounded-xl mb-3 overflow-hidden" />
            <div className="font-semibold">{l.titulo}</div>
            <div className="text-sm text-gray-600 mt-1">
              {l.categoria ? `categoria • ${l.categoria}` : ""}{" "}
              {l.raca ? ` · raça • ${l.raca}` : ""}{" "}
              {l.municipio && l.uf ? ` · ${l.municipio}/${l.uf}` : ""}
            </div>
            <div className="mt-3">
              <button className="btn btn-outline-dynamic rounded-xl px-4 py-2">Detalhes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
