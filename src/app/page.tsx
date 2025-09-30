// ./src/app/page.tsx
import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_CONFIG_QUERY } from "@/sanity/lib/queries";

type SiteConfig = {
  siteTitle?: string;
  tema?: "claro" | "escuro" | string;
  corPrimaria?: string;
  corFundo?: string;
  corTexto?: string;
  usarVideoNoHero?: boolean;
  heroVideoResolved?: string | null; // url
  heroImageUrl?: string | null;      // url
  heroTitulo?: string;
  heroDescricao?: string;
  whatsappGeral?: string;
  menu?: { label: string; href: string }[];
};

const DEFAULTS: Required<Pick<
  SiteConfig,
  "siteTitle" | "tema" | "corPrimaria" | "corFundo" | "corTexto" | "usarVideoNoHero"
>> = {
  siteTitle: "Gado Terra Grande",
  tema: "claro",
  corPrimaria: "#16a34a",
  corFundo: "#ffffff",
  corTexto: "#111827",
  usarVideoNoHero: false,
};

export default async function Home() {
  const fetched = await sanityClient.fetch<SiteConfig | null>(SITE_CONFIG_QUERY);

  // Merge seguro: se vier null ou faltando campos, completa com DEFAULTS
  const config: SiteConfig = { ...DEFAULTS, ...(fetched ?? {}) };

  return (
    <main style={{ background: config.corFundo, color: config.corTexto }}>
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold leading-tight tracking-tight"
              style={{ color: config.corTexto }}
            >
              {config.heroTitulo ?? "Compra e venda de gado, do jeito simples."}
            </h1>
            <p className="mt-4 max-w-xl">
              {config.heroDescricao ?? "Encontre lotes com informações claras..."}
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/lotes"
                className="rounded-xl px-6 py-3 text-white"
                style={{ background: config.corPrimaria }}
              >
                Ver Lotes
              </Link>
              <Link
                href="/contato"
                className="rounded-xl px-6 py-3 border"
                style={{ borderColor: config.corPrimaria, color: config.corPrimaria }}
              >
                Falar com a equipe
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border">
            {config.usarVideoNoHero && config.heroVideoResolved ? (
              <video
                src={config.heroVideoResolved}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[360px] object-cover"
              />
            ) : (
              <img
                src={config.heroImageUrl ?? "/hero-gado.jpg"}
                alt="hero"
                className="w-full h-[360px] object-cover"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
