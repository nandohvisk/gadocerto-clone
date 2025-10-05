// F:\gadoterragrande\gadocerto-clone\src\components\BeneficiosSection.tsx
import { fetchBeneficios } from "@/sanity/fetchBeneficios";

/**
 * Seção "Por que a Gado Terra Grande?"
 * - Busca conteúdo no Sanity (beneficios)
 * - Renderiza título superior, subtítulo e 3 caixas
 * - Ícones SVG fixos (sem emoji) para visual mais moderno
 *   → ignoramos "icone" do Studio para não aparecer emoji feio
 * Server Component.
 */
export default async function BeneficiosSection() {
  const data = await fetchBeneficios();

  const tituloSuperior =
    data?.tituloSuperior?.trim() || "POR QUE A GADO TERRA GRANDE?";
  const subtitulo =
    data?.subtitulo?.trim() || "Negócio Feito com Confiança e Clareza.";

  // Usa até 3 itens do Studio, preenchendo com defaults se faltar
  const caixas = (data as any)?.caixas ?? [];
  const items = [
    caixas[0] ?? {
      titulo: "Documentação Clara",
      descricao:
        "Todos os lotes com histórico, saúde e métricas detalhadas. Sem surpresas.",
    },
    caixas[1] ?? {
      titulo: "Melhores Negócios",
      descricao:
        "Conectamos diretamente vendedores e compradores para otimizar preço e qualidade.",
    },
    caixas[2] ?? {
      titulo: "Suporte Dedicado",
      descricao:
        "Acompanhamos cada etapa, da seleção dos lotes até a logística final.",
    },
  ].slice(0, 3);

  // Ícones SVG inline (nada de emoji)
  const Icones = [
    function DocIcon() {
      return (
        <svg
          aria-hidden="true"
          className="h-8 w-8 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h6M8 9h3" />
        </svg>
      );
    },
    function ChartIcon() {
      return (
        <svg
          aria-hidden="true"
          className="h-8 w-8 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M7 15l4-4 3 3 5-6" />
          <circle cx="7" cy="15" r="1.5" />
          <circle cx="11" cy="11" r="1.5" />
          <circle cx="14" cy="14" r="1.5" />
          <circle cx="19" cy="8" r="1.5" />
        </svg>
      );
    },
    function SupportIcon() {
      return (
        <svg
          aria-hidden="true"
          className="h-8 w-8 text-emerald-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 0-18 0" />
          <rect x="3" y="10" width="4" height="7" rx="1" />
          <rect x="17" y="10" width="4" height="7" rx="1" />
          <path d="M7 19a5 2 0 0 0 10 0" />
        </svg>
      );
    },
  ];

  return (
    <section className="w-full bg-white/70 dark:bg-white/5">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-20">
        {/* título superior */}
        <p className="text-xs md:text-sm font-semibold tracking-[0.18em] text-gray-700/90 dark:text-gray-300/90 uppercase">
          {tituloSuperior}
        </p>

        {/* subtítulo */}
        <h2 className="mt-2 text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          {subtitulo}
        </h2>

        {/* grid de 3 caixas */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((box, idx) => {
            const Icon = Icones[idx] || Icones[0];
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                {/* Ícone SVG (fixo, sem depender do Studio) */}
                <div className="mb-3">
                  <Icon />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {box?.titulo || "Título da caixa"}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300/90">
                  {box?.descricao ||
                    "Descrição breve do benefício oferecido pela plataforma."}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
