// ./src/app/page.tsx
import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_CONFIG_QUERY, LOTES_DESTAQUE_QUERY } from "@/sanity/lib/queries";
import LoteCard, { Lote } from "@/components/LoteCard";
import HeroSearch from "@/components/HeroSearch";

type SiteConfig = {
  siteTitle: string;
  tema: "claro" | "escuro";
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
  usarVideoNoHero: boolean;
  heroVideoResolved?: string | null; // url
  heroImageUrl?: string | null; // url
  heroTitulo?: string;
  heroDescricao?: string;
  whatsappGeral?: string;
  menu?: { label: string; href: string }[];
};

export default async function Home() {
  // Busca configuração e lotes do painel (Sanity)
  const [config, lotsRaw] = await Promise.all([
    sanityClient.fetch<SiteConfig>(SITE_CONFIG_QUERY),
    sanityClient.fetch<any[]>(LOTES_DESTAQUE_QUERY),
  ]);

  // Mapeia o retorno do Sanity para o tipo Lote usado no componente
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
    fotos: Array.isArray(r.fotos)
      ? r.fotos.map((f: any) => f?.url ?? f).filter(Boolean)
      : [],
    whatsapp: r.whatsapp || config?.whatsappGeral || "",
    precoLabel: r.precoLabel,
    // vídeo vindo da query (ou campos comuns como fallback)
    videoUrl: r.videoUrl ?? r.video?.url ?? r.video?.asset?.url ?? null,
  }));

  const primary = config.corPrimaria || "#10b981";
  const gradient = `linear-gradient(90deg, ${primary} 0%, ${primary}cc 100%)`;
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <main style={{ background: config.corFundo, color: config.corTexto }}>
      {/* HERO full-bleed SEM overflow-hidden (para não cortar o autocomplete) */}
      <section className="relative w-full h-[72vh] md:h-[82vh]">
        {/* Fundo (vídeo ou imagem) */}
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

        {/* Dev debug opcional */}
        {isDev && (
          <div className="absolute z-40 top-2 left-2 text-xs rounded bg-black/60 text-white px-2 py-1">
            video: {config.heroVideoResolved ? "OK" : "—"} | img:{" "}
            {config.heroImageUrl ? "OK" : "—"}
          </div>
        )}

        {/* Conteúdo acima do fundo */}
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

          {/* caixa de busca próxima ao fim do vídeo */}
          <div className="w-full mt-8 mb-8">
            <HeroSearch accent={primary} />
          </div>
        </div>
      </section>

      {/* LOTES EM DESTAQUE — logo abaixo do Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-emerald-600">Lotes</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Explore os lotes disponíveis
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Confira animais de diversas regiões, pesos e categorias e
              encontre o lote que você deseja!
            </p>
          </div>

          <Link
            href="/lotes"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-white"
            style={{ backgroundImage: gradient }}
          >
            Ver todos
          </Link>
        </div>

        {lots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-600 dark:text-gray-300">
            Nenhum lote publicado ainda. Publique no painel para aparecer aqui.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((lote) => (
              <LoteCard
                key={lote.id}
                lote={lote}
                primary={primary}
                isLoggedIn={false} // trocar quando integrar login
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
