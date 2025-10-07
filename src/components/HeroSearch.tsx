// F:\gadocerto-clone\gadocerto-clone\src\components\HeroSearch.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type City = {
  id: number;
  nome: string;
  microrregiao: { mesorregiao: { UF: { sigla: string } } };
};

type Category = { id?: string; label: string; value: string };

function normalize(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

type Props = { accent?: string };

/**
 * Agora com fallback de cor inline no botão (gradiente âmbar),
 * além das classes .btn .btn-primary do globals.css.
 */
export default function HeroSearch({ accent = "var(--agro-wheat)" }: Props) {
  const router = useRouter();

  const [tab, setTab] = useState<"comprar" | "vender">("comprar");

  // CIDADES
  const [allCities, setAllCities] = useState<City[] | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [query, setQuery] = useState("");
  const [openList, setOpenList] = useState(false);
  const [highlight, setHighlight] = useState(0);

  // CATEGORIAS
  const [cats, setCats] = useState<Category[]>([]);
  const [categoria, setCategoria] = useState("");

  const boxRef = useRef<HTMLDivElement>(null);

  // ---------- categorias do painel ----------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories");
        const data: Category[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCats(data);
        } else {
          setCats([
            { label: "Bezerro", value: "bezerro" },
            { label: "Novilha", value: "novilha" },
            { label: "Boi gordo", value: "boi" },
            { label: "Vaca", value: "vaca" },
          ]);
        }
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

  // ---------- cidades ----------
  async function fetchCitiesDirectFromIBGE(): Promise<City[]> {
    const r = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
      { cache: "force-cache" }
    );
    const data: any[] = await r.json();
    return data.map((c) => ({
      id: c.id,
      nome: c.nome,
      microrregiao: {
        mesorregiao: { UF: { sigla: c?.microrregiao?.mesorregiao?.UF?.sigla ?? "" } },
      },
    }));
  }

  // tenta a rota local; se falhar, usa IBGE direto no navegador
  async function ensureCitiesLoaded() {
    if (allCities || loadingCities) return;
    try {
      setLoadingCities(true);

      let ok = false;
      try {
        const res = await fetch("/api/ibge/municipios");
        if (res.ok) {
          const data: City[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAllCities(data);
            ok = true;
          }
        }
      } catch {
        // ignora, vamos cair no fallback
      }

      if (!ok) {
        const fallback = await fetchCitiesDirectFromIBGE();
        setAllCities(fallback);
      }
    } catch (e) {
      console.error("Falha ao obter cidades:", e);
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
    const starts = allCities.filter((c) => normalize(c.nome).startsWith(q));
    const contains = allCities.filter(
      (c) => !normalize(c.nome).startsWith(q) && normalize(c.nome).includes(q)
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
      setHighlight((h) => (h + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + matches.length) % matches.length);
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
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-amber-300"
            style={{ borderColor: "#D1D5DB" }}
            onFocus={ensureCitiesLoaded}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenList(true);
              setHighlight(0);
            }}
            onKeyDown={onKeyDown}
            value={query}
            autoComplete="off"
          />
          {openList && matches.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 max-h-72 overflow-auto rounded-xl border bg-white shadow-lg z-50">
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

        {/* categoria (dinâmica do painel) */}
        <select
          className="md:w-60 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-amber-300"
          style={{ borderColor: "#D1D5DB" }}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Categoria</option>
          {cats.map((c) => (
            <option key={c.id ?? c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* botão (padronizado + fallback inline para o gradiente) */}
        <button
          type="submit"
          className="btn btn-primary md:w-44 w-full"
          style={{ backgroundImage: "linear-gradient(to bottom, #eab308, #d4a106)" }}
        >
          Procurar
        </button>
      </div>

      {loadingCities && <div className="mt-2 text-xs text-gray-500">Carregando cidades do IBGE…</div>}
    </form>
  );
}
