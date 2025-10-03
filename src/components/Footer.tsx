// ./src/components/Footer.tsx
import Link from "next/link";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_CONFIG_QUERY } from "@/sanity/lib/queries";

type SiteConfig = {
  siteTitle: string;
  corPrimaria: string;
  menu?: { label: string; href: string }[];
  whatsappGeral?: string;
};

function waLink(raw?: string) {
  if (!raw) return "/contato";
  const digits = raw.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export default async function Footer() {
  const config = await sanityClient.fetch<SiteConfig>(SITE_CONFIG_QUERY);
  const year = new Date().getFullYear();
  const primary = config?.corPrimaria || "#10b981";

  const menu = config?.menu?.length
    ? config.menu
    : [
        { label: "Início", href: "/" },
        { label: "Lotes", href: "/lotes" },
        { label: "Benefícios", href: "/beneficios" },
      ];

  return (
    <footer className="mt-20 bg-white/60 dark:bg-gray-900/50 backdrop-blur border-t border-gray-200/70 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3 items-start">
          {/* Marca */}
          <div className="space-y-3">
            <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              {config?.siteTitle || "Gado Terra Grande"}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Compra e venda de gado com informações claras, rápidas e confiáveis.
            </p>
          </div>

          {/* Navegação */}
          <nav className="grid grid-cols-2 gap-3 md:justify-self-center md:text-center">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Ação / Contato */}
          <div className="md:justify-self-end">
            <Link
              href={waLink(config?.whatsappGeral)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-white shadow-sm hover:shadow transition-transform hover:scale-105"
              style={{ backgroundImage: `linear-gradient(90deg, ${primary}, ${primary}CC)` }}
            >
              {/* Ícone WhatsApp minimalista */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 12.05c0 4.42-3.64 8-8.13 8a8.1 8.1 0 01-3.9-1l-4.33 1.14 1.16-4.22a8.01 8.01 0 01-1.15-4.02C3.65 7.53 7.29 4 11.8 4S20 7.53 20 12.05zm-8.2-6.05C8.25 6 6 8.2 6 11.05c0 1.27.4 2.45 1.08 3.42l-.7 2.52 2.58-.68a6.2 6.2 0 003.04.82c3.55 0 6.45-2.83 6.45-6.29C18.45 8.2 15.55 6 11.8 6zm3.15 7.68c-.05-.08-.2-.13-.42-.25-.22-.12-1.3-.64-1.5-.71-.2-.07-.34-.1-.48.1-.14.2-.55.7-.68.84-.12.13-.25.15-.47.05-.22-.1-.93-.34-1.77-1.04-.65-.53-1.09-1.18-1.22-1.38-.13-.2-.01-.31.1-.42.1-.1.22-.25.33-.38.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.4-.05-.12-.48-1.14-.66-1.56-.17-.42-.35-.36-.48-.36h-.41c-.14 0-.37.05-.57.28-.2.22-.76.74-.76 1.8 0 1.06.78 2.1.89 2.25.11.14 1.53 2.35 3.75 3.2.52.22.93.35 1.25.45.53.17 1.01.14 1.39.08.42-.06 1.3-.53 1.49-1.05.19-.52.19-.97.14-1.05z" />
              </svg>
              Falar no WhatsApp
            </Link>
          </div>
        </div>

        {/* Linha final */}
        <div className="mt-10 pt-6 border-t border-gray-200/70 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <span>© {year} {config?.siteTitle || "Gado Terra Grande"}. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
