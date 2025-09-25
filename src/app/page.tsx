import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          {/* texto */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Compra e venda de <span className="text-gray-800">gado</span>, do jeito simples.
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              Encontre lotes com informações claras de idade, peso, raça e localização. Fale direto pelo WhatsApp.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/lotes"
                className="rounded-xl px-6 py-3 bg-black text-white hover:opacity-90"
              >
                Ver Lotes
              </Link>
              <Link
                href="/contato"
                className="rounded-xl px-6 py-3 border hover:bg-gray-50"
              >
                Falar com a equipe
              </Link>
            </div>

            <p className="mt-6 text-xs text-gray-500">
              *MVP — dados ilustrativos.
            </p>
          </div>

          {/* imagem */}
          <div className="rounded-2xl overflow-hidden border">
            <img
              src="/hero-gado.jpg"
              alt="gado em pasto"
              className="w-full h-[360px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* SEÇÃO DE APOIO (opcional) */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <div className="font-semibold">Catálogo claro</div>
            <p className="text-sm text-gray-600 mt-1">Raça, idade, peso e localização nos cards.</p>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-semibold">Contato direto</div>
            <p className="text-sm text-gray-600 mt-1">Botão de WhatsApp em cada lote.</p>
          </div>
          <div className="rounded-xl border p-4">
            <div className="font-semibold">Transparência</div>
            <p className="text-sm text-gray-600 mt-1">Páginas de Termos e Canal de Ética.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
