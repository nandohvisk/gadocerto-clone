// F:\gadocerto-clone\src\app\page.tsx
import Link from "next/link";
import client from "../sanity/lib/client";
import { SITE_CONFIG_QUERY } from "../sanity/lib/queries";

type SiteConfig = {
  siteTitle?: string;
  tema?: string;
  corPrimaria?: string;
  corFundo?: string;
  corTexto?: string;
  usarVideoNoHero?: boolean;
  heroVideoResolved?: string | null;
  heroImageUrl?: string | null;
  heroTitulo?: string;
  heroDescricao?: string;
  whatsappGeral?: string;
};

export default async function Home() {
  const config = await client.fetch<SiteConfig>(SITE_CONFIG_QUERY);

  const bg = config?.corFundo || "#ffffff";
  const fg = config?.corTexto || "#111111";

  return (
    <main style={{ background: bg, color: fg }}>
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              {config?.heroTitulo ?? "Compra e venda de gado, do jeito simples."}
            </h1>
            <p className="mt-4 text-gray-600 max-w-xl">
              {config?.heroDescricao ?? "Encontre lotes com informações claras de idade, peso, raça e localização. Fale direto pelo WhatsApp."}
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/lotes" className="rounded-xl px-6 py-3 bg-black text-white hover:opacity-90">Ver Lotes</Link>
              <Link href="/contato" className="rounded-xl px-6 py-3 border hover:bg-gray-50">Falar com a equipe</Link>
            </div>
            <p className="mt-6 text-xs text-gray-500">*MVP — dados ilustrativos.</p>
          </div>

          <div className="rounded-2xl overflow-hidden border">
            {config?.usarVideoNoHero && config?.heroVideoResolved ? (
              <video src={config.heroVideoResolved!} className="w-full h-[360px] object-cover" autoPlay muted loop playsInline />
            ) : (
              <img src={config?.heroImageUrl || "/hero-gado.jpg"} alt="hero" className="w-full h-[360px] object-cover" />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
