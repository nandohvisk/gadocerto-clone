// F:\gadocerto-clone\gadocerto-clone\src\components\BeneficiosSection.tsx
export const revalidate = 0; // força atualização sempre que algo muda no painel

import React from "react";
// ⬇️ IMPORTS RELATIVOS para garantir resolução
import { sanityClient } from "../../sanity/lib/client";
import { BENEFICIOS_HOME_QUERY } from "../../sanity/lib/beneficiosHome.query";

type Beneficio = {
  _id: string;
  titulo: string;
  descricao: string;
  cor: "campo" | "trigo" | "ceu";
};

const FALLBACK: Beneficio[] = [
  { _id: "f1", titulo: "Documentação Clara", descricao: "Todos os lotes com histórico, saúde e métricas detalhadas. Sem surpresas ou letras miúdas.", cor: "campo" },
  { _id: "f2", titulo: "Melhores Negócios", descricao: "Conectamos vendedores e compradores, otimizando preço, qualidade e logística.", cor: "trigo" },
  { _id: "f3", titulo: "Suporte Dedicado", descricao: "Acompanhamos cada etapa: seleção do lote, negociação, transporte e pós-venda.", cor: "ceu" },
];

// paleta agro suave
function theme(accent: Beneficio["cor"]) {
  if (accent === "campo") {
    return {
      card: "bg-gradient-to-b from-emerald-600/5 via-emerald-500/5 to-teal-500/5 border-emerald-900/10",
      badgeWrap: "bg-emerald-950",
      badgeIcon: "text-emerald-300",
      ring: "group-hover:ring-emerald-300/50",
      button: "from-emerald-600/15 via-teal-600/15 to-emerald-600/15 hover:from-emerald-500/25 hover:to-teal-500/25",
    };
  }
  if (accent === "trigo") {
    return {
      card: "bg-gradient-to-b from-amber-600/5 via-amber-500/5 to-orange-500/5 border-amber-900/10",
      badgeWrap: "bg-amber-950",
      badgeIcon: "text-amber-300",
      ring: "group-hover:ring-amber-300/50",
      button: "from-amber-600/15 via-orange-600/15 to-amber-600/15 hover:from-amber-500/25 hover:to-orange-500/25",
    };
  }
  return {
    card: "bg-gradient-to-b from-sky-600/5 via-cyan-500/5 to-sky-500/5 border-sky-900/10",
    badgeWrap: "bg-sky-950",
    badgeIcon: "text-sky-300",
    ring: "group-hover:ring-sky-300/50",
    button: "from-sky-600/15 via-cyan-600/15 to-sky-600/15 hover:from-sky-500/25 hover:to-cyan-500/25",
  };
}

const icons = [
  <svg key="doc" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 13h6M9 17h6M9 9h2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>,
  <svg key="trend" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.8" />
    <path d="M21 10V3h-7" stroke="currentColor" strokeWidth="1.8" />
  </svg>,
  <svg key="phone" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M22 16.92v2a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 4.18 2 2 0 0 1 5.06 2h2a2 2 0 0 1 2 1.72c.12.9.31 1.77.57 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.09a2 2 0 0 1 2.11-.45c.84.26 1.71.45 2.61.57A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" />
  </svg>,
];

async function getData(): Promise<Beneficio[]> {
  try {
    const data = await sanityClient.fetch<{ itens: Beneficio[] }>(BENEFICIOS_HOME_QUERY);
    return data?.itens || FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export default async function BeneficiosSection() {
  const data = await getData();

  return (
    <section className="py-20 md:py-28 text-center">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          Por que a Gado Terra Grande?
        </p>
        <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950">
          Negócio Feito com Confiança e Clareza.
        </h2>
      </div>

      <div className="max-w-screen-xl xl:max-w-[90rem] mx-auto px-4 md:px-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-16 justify-items-stretch">
        {data.map((item, i) => {
          const t = theme(item.cor);
          return (
            <article
              key={item._id || `${item.titulo}-${i}`}
              className={[
                "group relative overflow-hidden rounded-2xl border",
                t.card,
                "shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                "w-full h-full",
              ].join(" ")}
            >
              <div className={`absolute inset-0 rounded-2xl ring-0 ${t.ring} transition-all duration-300 group-hover:ring-4 pointer-events-none`} />
              <div className="p-8 flex flex-col items-center text-center h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${t.badgeWrap} mb-6 shadow-md`}>
                  <span className={t.badgeIcon}>{icons[i % icons.length]}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-950 tracking-tight">{item.titulo}</h3>
                <p className="mt-3 text-zinc-700/90 leading-relaxed">{item.descricao}</p>

                <a
                  href="#contato"
                  className={[
                    "mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold",
                    "border border-zinc-900/10 bg-white/60 backdrop-blur",
                    "bg-gradient-to-b",
                    t.button,
                    "transition-all duration-300 hover:shadow-md",
                  ].join(" ")}
                >
                  <span>Saiba mais</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
