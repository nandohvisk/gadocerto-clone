// F:\gadoterragrande\gadocerto-clone\src\components\HeroSearch.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type City = {
  id: number;
  nome: string;
  microrregiao: { mesorregiao: { UF: { sigla: string } } };
};

function normalize(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

type Props = { accent?: string };

export default function HeroSearch({ accent = "#E06B2D" }: Props) {
  const router = useRouter();

  const [tab, setTab] = useState<"comprar" | "vender">("comprar");
  const [allCities, setAllCities] = useState<City[] | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);

  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const [categoria, setCategoria] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  // carrega lista de municípios do IBGE ao focar no campo
  async function ensureCitiesLoaded() {
    if (allCities || loadingCities) return;
    try {
      setLoadingCities(true);
      const res = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
        { cache: "force-cache" }
      );
      const data: City[] = await res.json();
      setAllCities(data);
    } catch (e) {
      console.error("Falha ao carregar cidades do IBGE:", e);
      setAllCities([]);
    } finally {
      setLoadingCities(false);
    }
  }

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpenList(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const matches = useMemo(() => {
    if (!allCities || !query) return [];
    const q = normalize(query);
    const starts = allCities.filter(c => normalize(c.nome).startsWith(q));
    const contains = allCities.filter(
      c => !normalize(c.nome).startsWith(q) && normalize(c.nome).includes(q)
    );
    return [...starts, ...contains].slice(0, 8);
  }, [allCities, query]);

  function selectCity(c: City) {
    setQuery(`${c.nome} - ${c.microrregiao.mesorregiao.UF.sigla}`);
    setOpenList(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!openList || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(h => (h + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(h => (h - 1 + matches.length) % matches.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = matches[highlight];
      if (item) selectCity(item);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("localizacao", query);
    if (categoria) params.set("categoria", categoria);
    params.set("tipo", tab);
    // redireciona para /lotes
    router.push(`/lotes?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-5xl rounded-2xl bg-white/95 shadow p-4 md:p-5">
      {/* abas */}
      <div className="mb-3 flex gap-8 px-1">
        <button
          type="button"
          onClick={() => setTab("comprar")}
          className={`text-sm font-semibold pb-1 border-b-2 ${tab === "comprar" ? "opacity-100" : "opacity-60"}`}
          style={{ borderColor: tab === "comprar" ? accent : "transparent" }}
        >
          Quero comprar
        </button>
        <button
          type="button"
          onClick={() => setTab("vender")}
          className={`text-sm font-semibold pb-1 border-b-2 ${tab === "vender" ? "opacity-100" : "opacity-60"}`}
          style={{ borderColor: tab === "vender" ? accent : "transparent" }}
        >
          Quero vender
        </button>
      </div>

      {/* linha única no desktop; empilha no mobile */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch" ref={boxRef}>
        {/* localização com autocomplete */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Digite sua localização (cidade)"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
            style={{ borderColor: "#D1D5DB" }}
            onFocus={ensureCitiesLoaded}
            onChange={(e) => { setQuery(e.target.value); setOpenList(true); setHighlight(0); }}
            onKeyDown={onKeyDown}
            value={query}
            autoComplete="off"
          />
          {openList && matches.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 max-h-72 overflow-auto rounded-xl border bg-white shadow-lg z-20">
              {matches.map((c, idx) => {
                const uf = c.microrregiao.mesorregiao.UF.sigla;
                const active = idx === highlight;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => selectCity(c)}
                    className={`w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                  >
                    <div className="font-medium">{c.nome}</div>
                    <div className="text-xs text-gray-500">{uf}, Brasil</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* categoria */}
        <select
          className="md:w-60 w-full rounded-xl border px-4 py-3"
          style={{ borderColor: "#D1D5DB" }}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Categoria</option>
          <option value="bezerro">Bezerro</option>
          <option value="novilha">Novilha</option>
          <option value="boi">Boi gordo</option>
          <option value="vaca">Vaca</option>
        </select>

        {/* botão */}
        <button
          type="submit"
          className="rounded-xl px-6 py-3 font-medium text-white md:w-44 w-full"
          style={{ background: accent }}
        >
          Procurar
        </button>
      </div>

      {loadingCities && <div className="mt-2 text-xs text-gray-500">Carregando cidades do IBGE…</div>}
    </form>
  );
}
