// F:\gadocerto-clone\gadocerto-clone\src\app\page.tsx
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_CONFIG_QUERY, LOTES_DESTAQUE_QUERY } from "@/sanity/lib/queries";
import LoteCard, { Lote } from "@/components/LoteCard";
import HeroSearch from "@/components/HeroSearch";
import BeneficiosSection from "@/components/BeneficiosSection";
import CtaLotesSection from "@/components/CtaLotesSection"; // CTA (agora no penúltimo bloco)

type SiteConfig = {
  siteTitle: string;
  tema: "claro" | "escuro";
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
  usarVideoNoHero: boolean;
  heroVideoResolved?: string | null;
  heroImageUrl?: string | null;
  heroTitulo?: string;
  heroDescricao?: string;
  whatsappGeral?: string;
  menu?: { label: string; href: string }[];
};

export default async function Home() {
  const [config, lotsRaw] = await Promise.all([
    sanityClient.fetch<SiteConfig>(SITE_CONFIG_QUERY),
    sanityClient.fetch<any[]>(LOTES_DESTAQUE_QUERY),
  ]);

  const lots: Lote[] = (lotsRaw ?? []).map((r: any) => ({
    id: r._id,
    titulo: r.titulo ?? "Lote",
    categoria: r.categoria ?? "",
    raca: r.raca ?? "",
    idadeMeses: r.idadeMeses ?? 0,
    pesoMedioKg: r.pesoMedioKg ?? 0,
    cabecas: r.cabecas ?? 0,
    municipio: r.municipio ?? "",
    uf: r.uf ?? "",
    fotos: Array.isArray(r.fotos) ? r.fotos.map((f: any) => f?.url ?? f).filter(Boolean) : [],
    whatsapp: r.whatsapp || config?.whatsappGeral || "",
    precoLabel: r.precoLabel,
    videoUrl: r.videoUrl ?? r.video?.url ?? r.video?.asset?.url ?? null,
  }));

  const primary = config.corPrimaria || "#10b981";
  const gradient = `linear-gradient(90deg, ${primary} 0%, ${primary}cc 100%)`;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <main style={{ background: config.corFundo, color: config.corTexto }}>
      {/* HERO */}
      <section className="relative w-full h-[72vh] md:h-[82vh]">
        <div className="absolute inset-0 overflow-hidden">
          {config.heroVideoResolved ? (
            <video
              key={config.heroVideoResolved}
              src={config.heroVideoResolved}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={config.heroImageUrl ?? undefined}
              crossOrigin="anonymous"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <img
              src={config.heroImageUrl ?? "/hero-gado.jpg"}
              alt="hero"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {isDev && (
          <div className="absolute z-40 top-2 left-2 text-xs rounded bg-black/60 text-white px-2 py-1">
            video: {config.heroVideoResolved ? "OK" : "—"} | img: {config.heroImageUrl ? "OK" : "—"}
          </div>
        )}

        <div className="relative z-30 max-w-7xl mx-auto h-full px-6 flex flex-col items-center text-center">
          <div className="flex-1" />
          <div className="max-w-4xl">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {config.heroTitulo ?? "Compra e venda de gado, do jeito simples."}
            </h1>
            <p className="mt-4 text-white/90 text-base md:text-lg">
              {config.heroDescricao ??
                "Encontre lotes com informações claras de idade, peso, raça e localização. Fale direto pelo WhatsApp."}
            </p>
          </div>

          <div className="w-full mt-8 mb-8">
            <HeroSearch accent={primary} />
          </div>
        </div>
      </section>

      {/* LOTES EM DESTAQUE */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-emerald-600">Lotes</p>
            {/* padronizado: h-section + p-muted */}
            <h2 className="h-section text-gray-900 dark:text-white">
              Explore os lotes disponíveis
            </h2>
            <p className="mt-1 p-muted">
              Confira animais de diversas regiões, pesos e categorias e encontre o lote que você deseja!
            </p>
          </div>

          {/* PADRONIZADO: botão âmbar (primário) */}
          <Link href="/lotes" className="hidden sm:inline-flex btn btn-primary">
            Ver todos
          </Link>
        </div>

        {lots.length === 0 ? (
          // estado vazio (cartão consistente)
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white shadow-sm p-10 text-center">
            <h3 className="text-base font-semibold text-gray-900">Nenhum lote publicado ainda</h3>
            <p className="mt-1 text-sm p-muted">
              Assim que você publicar seus primeiros lotes no painel, eles aparecerão aqui.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link href="/lotes" className="btn btn-primary">Ver listagem</Link>
              <Link href="/" className="btn btn-secondary">Voltar ao início</Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((lote) => (
              <LoteCard key={lote.id} lote={lote} primary={primary} isLoggedIn={false} />
            ))}
          </div>
        )}
      </section>

      {/* Benefícios (3 caixas) */}
      <BeneficiosSection />

      {/* CTA movida para o penúltimo bloco.
          O último bloco será o de Endereço/Telefone/WhatsApp (virá do Sanity). */}
      <CtaLotesSection />
    </main>
  );
}
