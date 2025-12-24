"use client";
import React from "react";
import Link from "next/link";

export default function CtaLotesSection() {
  return (
    // -mt-6 aproxima do vídeo (tira o “vazio” entre as seções)
    <section aria-label="Chamada para ver lotes" className="-mt-6">
      {/* Barra full-bleed (100% largura) */}
      <div className="relative w-full bg-[#1f3a2d] text-white">
        {/* brilho sutil para não ficar chapado */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

        {/* conteúdo centralizado, mas a barra ocupa a página toda */}
        <div className="relative max-w-screen-xl mx-auto px-4 md:px-8">
          {/* aumenta a “altura” da faixa */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 py-10">
            <h3 className="text-center md:text-left text-2xl md:text-3xl font-extrabold tracking-tight">
              Pronto para encontrar o seu próximo lote?
            </h3>

            <div className="flex items-center gap-3">
              {/* Navegação interna via Link */}
              <Link
                href="/lotes"
                prefetch={true}
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold bg-gradient-to-b from-amber-400 to-amber-500 text-[#1c1c1c] transition-all duration-200 hover:brightness-105 active:translate-y-[1px] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
              >
                Ver Lotes Agora
              </Link>

              {/* Link externo (âncora dentro da página) */}
              <a
                href="#contato"
                className="inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold bg-white/95 text-[#1f3a2d] border border-white/40 backdrop-blur transition-all duration-200 hover:bg-white active:translate-y-[1px] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
