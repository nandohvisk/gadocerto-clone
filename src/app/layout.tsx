// ./src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css"; // se der erro de caminho, troque para "../globals.css"

export const metadata: Metadata = {
  title: "Gado Terra Grande",
  description: "Compra e venda de gado com clareza e segurança.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-white text-gray-900">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {/* 1fr | auto | 1fr -> menu realmente centralizado */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 md:h-16">
              {/* ESQUERDA — logo/wordmark */}
              <div className="justify-self-start">
                <Link href="/" className="inline-flex items-center gap-2">
                  <span className="text-[15px] md:text-base font-semibold tracking-wide text-gray-900">
                    Gado Terra Grande
                  </span>
                </Link>
              </div>

              {/* CENTRO — navegação */}
              <nav className="justify-self-center">
                <ul className="flex items-center gap-8 text-[15px] font-medium text-gray-800">
                  <li>
                    <Link href="/" className="hover:text-gray-900 transition-colors">
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link href="/lotes" className="hover:text-gray-900 transition-colors">
                      Lotes
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* DIREITA — login */}
              <div className="justify-self-end">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-[15px] text-gray-800 hover:text-gray-900 transition-colors"
                >
                  <span>Entrar na conta</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-500/70">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-700"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* CONTEÚDO */}
        <main>{children}</main>
      </body>
    </html>
  );
}
