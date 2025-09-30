// ./src/app/studio/[[...tool]]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StudioDisabled() {
  return (
    <main className="mx-auto max-w-2xl p-10">
      <h1 className="text-2xl font-bold">Área administrativa</h1>
      <p className="mt-2 text-gray-600">
        O Sanity Studio está desabilitado neste deploy de produção.
      </p>
      <p className="mt-4">
        Para editar conteúdo, rode localmente: <code>npm run dev</code> e acesse <b>/studio</b>.
      </p>
    </main>
  );
}

