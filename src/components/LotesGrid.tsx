// ./src/components/LotesGrid.tsx
import { LoteCard, Lote } from "./LoteCard";

export default function LotesGrid({
  items,
  primary = "#16a34a",
  isLoggedIn = false,
}: {
  items: Lote[];
  primary?: string;
  isLoggedIn?: boolean;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
