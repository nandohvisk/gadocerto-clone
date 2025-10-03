// F:\gadoterragrande\gadocerto-clone\src\app\studio\[[...tool]]\page.tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// Em produção mostramos aviso; em desenvolvimento abrimos o Studio.
export default function StudioPage() {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Área administrativa</h1>
        <p>O Sanity Studio está desabilitado neste deploy.</p>
        <p className="mt-2">
          Para editar conteúdo localmente, rode <code>npm run dev</code> e acesse{" "}
          <code>/studio</code>.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
