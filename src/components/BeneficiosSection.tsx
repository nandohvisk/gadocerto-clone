// F:\gadocerto-clone\gadocerto-clone\src\components\BeneficiosSection.tsx
import { fetchBeneficios } from "@/sanity/fetchBeneficios";

/**
 * Seção "Por que a Gado Terra Grande?"
 * - Busca conteúdo no Sanity (beneficios)
 * - Renderiza título superior, subtítulo e 3 caixas
 * - Caso não exista conteúdo no Studio, usa defaults amigáveis
 *
 * Server Component (Next.js App Router).
 */
export default async function BeneficiosSection() {
  const data = await fetchBeneficios();

  const tituloSuperior =
    data?.tituloSuperior?.trim() || "POR QUE A GADO TERRA GRANDE?";
  const subtitulo =
    data?.subtitulo?.trim() || "Negócio Feito com Confiança e Clareza.";

  // normaliza para 3 itens (preenche com defaults se faltar)
  const caixas = (data?.caixas ?? []).slice(0, 3);
  while (caixas.length < 3) {
    caixas.push({
      icone: "⭐",
      titulo: "Transparência total",
      descricao:
        "Informações claras para você comprar ou vender com segurança.",
    });
  }

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-20">
        {/* título superior */}
        <p className="text-xs md:text-sm font-semibold tracking-[0.18em] text-gray-700 uppercase">
          {tituloSuperior}
        </p>

        {/* subtítulo */}
        <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-gray-900">
          {subtitulo}
        </h2>

        {/* grid de 3 caixas */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {caixas.map((box, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* ícone (emoji simples) */}
              {box.icone ? (
                <div className="text-3xl leading-none mb-3">{box.icone}</div>
              ) : (
                <div className="text-3xl leading-none mb-3">⭐</div>
              )}

              <h3 className="text-lg font-bold text-gray-900">
                {box.titulo || "Título da caixa"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {box.descricao ||
                  "Descrição breve do benefício oferecido pela plataforma."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
