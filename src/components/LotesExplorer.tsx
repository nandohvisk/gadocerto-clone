// F:\gadocerto-clone\gadocerto-clone\src\components\LotesExplorer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Category = { id?: string; label: string; value: string };

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
  placeholder?: string;
};

export default function LotesExplorer({
  value = "",
  onChange,
  className = "",
  placeholder = "Categoria",
}: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hadError, setHadError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setHadError(false);

        const res = await fetch("/api/categories", { cache: "no-store" });
        const data: any[] = await res.json();

        // normaliza + remove vazios
        const normalized: Category[] = Array.isArray(data)
          ? data
              .map((d) => ({
                id: d?.id ?? d?._id ?? undefined,
                label: String(d?.label ?? "").trim(),
                value: String(d?.value ?? "").trim(),
              }))
              .filter((d) => d.label && d.value)
          : [];

        // dedup por 'value' para evitar duplicados
        const byValue = new Map<string, Category>();
        for (const c of normalized) {
          if (!byValue.has(c.value)) byValue.set(c.value, c);
        }

        setCats(Array.from(byValue.values()));
      } catch (e) {
        console.error("categories api error:", e);
        setCats([]);
        setHadError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // chave estável: id se existir; senão, value
  const options = useMemo(
    () =>
      cats.map((c) => ({
        key: (c.id ?? c.value) as string,
        label: c.label,
        value: c.value,
      })),
    [cats]
  );

  return (
    <select
      aria-label="Filtro por categoria"
      className={`rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300 ${className}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={loading}
      style={{ borderColor: "#D1D5DB" }}
    >
      {/* placeholder */}
      <option value="">{loading ? "Carregando categorias…" : placeholder}</option>

      {/* erro: mostramos opção informativa sem bloquear o select */}
      {hadError && !loading && (
        <option value="" disabled>
          Não foi possível carregar as categorias
        </option>
      )}

      {/* categorias */}
      {!loading &&
        options.map((c) => (
          <option key={c.key} value={c.value}>
            {c.label}
          </option>
        ))}
    </select>
  );
}
