'use client';

import config from '../../../../sanity.config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ENABLED = process.env.NEXT_PUBLIC_ENABLE_STUDIO === 'true';

export default function StudioGate() {
  // Se não estiver habilitado (produção, por exemplo), mostra mensagem simples
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

  // 🔒 Importa dynamic e o Studio SÓ agora (no cliente)
  const NextDynamic = require('next/dynamic').default as typeof import('next/dynamic').default;
  const Studio = NextDynamic(
    () => import('next-sanity/studio').then((m) => m.NextStudio),
    { ssr: false }
  );

  return <Studio config={config} />;
}
