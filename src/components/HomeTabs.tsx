// F:\gadocerto-clone\gadocerto-clone\src\components\HomeTabs.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  title: string;
  tipo: "comprar" | "vender" | "ambos";
  slug: string;
};

type Props = {
  ativo: boolean;
  tituloComprar: string;
  tituloVender: string;
  placeholderLocal: string;
  botaoProcurar: string;
  categorias: Category[];
  corPrimaria?: string;
};

export default function HomeTabs({
  ativo,
  tituloComprar,
  tituloVender,
  placeholderLocal,
  botaoProcurar,
  categorias,
  corPrimaria = "#21a179",
}: Props) {
  const router = useRouter();
  const [aba, setAba] = useState<"comprar" | "vender">("comprar");
  const [local, setLocal] = useState("");
  const [cat, setCat] = useState("");

  const categoriasFiltradas = useMemo(
    () => categorias.filter((c) => c.tipo === "ambos" || c.tipo === aba),
    [categorias, aba]
  );

  if (!ativo) return null;

  function procurar() {
    const params = new URLSearchParams();
    if (local) params.set("local", local);
    if (cat) params.set("categoria", cat);
    params.set("tipo", aba);
    router.push(`/lotes?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl bg-white/95 shadow-lg p-4 md:p-5">
      {/* Abas */}
      <div className="flex gap-2 border-b">
        {(["comprar", "vender"] as const).map((key) => {
          const ativoTab = aba === key;
          const label = key === "comprar" ? tituloComprar : tituloVender;
          return (
            <button
              key={key}
              onClick={() => setAba(key)}
              className={`px-4 py-2 -mb-px border-b-2 text-sm md:text-base ${
                ativoTab ? "font-semibold" : "text-neutral-500"
              }`}
              style={{ borderColor: ativoTab ? corPrimaria : "transparent" }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Linha de filtros */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr,220px,140px] gap-3 items-center">
        <input
          placeholder={placeholderLocal}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className="h-11 rounded-xl border px-3 outline-none focus:ring"
        />

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="h-11 rounded-xl border px-3 outline-none"
        >
          <option value="">Categoria</option>
          {categoriasFiltradas.map((c) => (
            <option key={c._id} value={c.slug || c.title}>
              {c.title}
            </option>
          ))}
        </select>

        <button
          onClick={procurar}
          className="h-11 rounded-xl text-white"
          style={{ background: corPrimaria }}
        >
          {botaoProcurar}
        </button>
      </div>
    </div>
  );
}
