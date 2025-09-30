'use client';

import NextDynamic from 'next/dynamic';
import config from '../../../../sanity.config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ENABLED = process.env.NEXT_PUBLIC_ENABLE_STUDIO === 'true';

// carrega o Studio apenas no cliente (evita erro no build)
const Studio = NextDynamic(
  () => import('next-sanity/studio').then((m) => m.NextStudio),
  { ssr: false }
);

export default function StudioGate() {
  if (!ENABLED) {
    return (
      <main className="mx-auto max-w-2xl p-10">
        <h1 className="text-2xl font-bold">Área administrativa</h1>
        <p className="mt-2 text-gray-600">O Sanity Studio está desabilitado neste deploy.</p>
        <p className="mt-4">
          Para editar conteúdo localmente, rode <code>npm run dev</code> e acesse <b>/studio</b>.
        </p>
      </main>
    );
  }
  return <Studio config={config} />;
}
