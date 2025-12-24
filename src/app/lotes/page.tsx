// F:\gadocerto-clone\gadocerto-clone\src\app\lotes\page.tsx
import { Suspense } from "react";
import LotesClient from "./LotesClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-6 py-10 text-gray-600">
          Carregando lotes…
        </div>
      }
    >
      <LotesClient />
    </Suspense>
  );
}
