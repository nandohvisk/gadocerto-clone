// F:\gadocerto-clone\gadocerto-clone\src\app\page.tsx
export const revalidate = 60;

import { sanityClient } from "@/sanity/lib/client";
import {
  SITE_CONFIG_QUERY,
  HOME_TABS_QUERY,
  CATEGORIES_QUERY,
} from "@/sanity/lib/queries";
import HomeTabs from "@/components/HomeTabs";

type SiteConfig = {
  corPrimaria?: string;
  usarVideoNoHero?: boolean;
  heroVideoResolved?: string | null;
  heroImageUrl?: string | null;
  heroTitulo?: string | null;
  heroDescricao?: string | null;
};

type HomeTabsDoc = {
  ativo?: boolean;
  tituloComprar?: string;
  tituloVender?: string;
  placeholderLocal?: string;
  botaoProcurar?: string;
};

type Category = {
  _id: string;
  title: string;
  tipo: "comprar" | "vender" | "ambos";
  slug: string;
};

export default async function Home() {
  const [config, tabs, categorias] = await Promise.all([
    sanityClient.fetch<SiteConfig>(SITE_CONFIG_QUERY),
    sanityClient.fetch<HomeTabsDoc>(HOME_TABS_QUERY),
    sanityClient.fetch<Category[]>(CATEGORIES_QUERY),
  ]);

  const usarVideo =
    Boolean(config?.usarVideoNoHero) && Boolean(config?.heroVideoResolved);
  const temImagem = Boolean(config?.heroImageUrl);
  const corPrimaria = config?.corPrimaria ?? "#E46A1B";

  return (
    <main className="relative">
      {/* BACKGROUND (vídeo ou imagem dinâmico) */}
      <div className="absolute inset-0 -z-10">
        {usarVideo ? (
          <video
            key={config!.heroVideoResolved!}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            poster={temImagem ? config!.heroImageUrl! : undefined}
            className="w-full h-full object-cover"
          >
            <source src={config!.heroVideoResolved!} type="video/mp4" />
          </video>
        ) : temImagem ? (
          <img
            src={config!.heroImageUrl!}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* CONTEÚDO CENTRALIZADO */}
      <section className="mx-auto max-w-5xl px-4 py-24 md:py-32 text-center">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight">
          {config?.heroTitulo ??
            "Encontre o melhor negócio para sua fazenda, com praticidade e segurança"}
        </h1>

        <p className="text-white/90 mt-4 max-w-3xl mx-auto">
          {config?.heroDescricao ??
            "Com a Gado Terra Grande, você tem acesso a um processo de compra e venda simplificado, seguro e com apoio profissional."}
        </p>

        {/* Abas e filtros */}
        <div className="mt-10 max-w-4xl mx-auto">
          <HomeTabs
            ativo={tabs?.ativo ?? true}
            tituloComprar={tabs?.tituloComprar ?? "Quero comprar"}
            tituloVender={tabs?.tituloVender ?? "Quero vender"}
            placeholderLocal={tabs?.placeholderLocal ?? "Digite sua localização"}
            botaoProcurar={tabs?.botaoProcurar ?? "Procurar"}
            categorias={categorias ?? []}
            corPrimaria={corPrimaria}
          />
        </div>
      </section>
    </main>
  );
}
