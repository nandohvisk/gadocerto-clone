// ./src/components/LotesGrid.tsx
import LoteCard, { Lote } from "./LoteCard";

type Props = {
  items: Lote[];
  primary?: string;
  isLoggedIn?: boolean;
  className?: string;
};

export default function LotesGrid({
  items,
  primary = "#111827",
  isLoggedIn = false,
  className = "",
}: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-600 dark:text-gray-300">
        Nenhum lote publicado ainda. Publique no painel para aparecer aqui.
      </div>
    );
  }

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((lote) => (
        <LoteCard
          key={lote.id}
          lote={lote}
          primary={primary}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
}
