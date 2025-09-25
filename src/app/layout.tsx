import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GadoCerto — Compra e venda de gado",
  description: "Catálogo de lotes com raça, idade, peso e localização.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased text-gray-900">
        <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">GadoCerto</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/lotes" className="hover:underline">Lotes</Link>
              <Link href="/etica" className="hover:underline">Canal de Ética</Link>
              <Link href="/termos" className="hover:underline">Termos</Link>
              <Link href="/contato" className="hover:underline">Contato</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-20 border-t">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600 grid gap-4 md:grid-cols-3">
            <div>
              <div className="font-semibold">GadoCerto</div>
              <p className="mt-2">Compra e venda de gado com transparência.</p>
            </div>
            <div>
              <div className="font-semibold">Institucional</div>
              <ul className="mt-2 space-y-1">
                <li><Link href="/termos" className="hover:underline">Termos de Uso</Link></li>
                <li><Link href="/etica" className="hover:underline">Canal de Ética</Link></li>
                <li><Link href="/contato" className="hover:underline">Contato</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Atendimento</div>
              <p className="mt-2">Seg–Sex, 08h–18h (BRT)</p>
              <a href="mailto:contato@gadocerto.com.br" className="hover:underline">contato@gadocerto.com.br</a>
            </div>
          </div>
        </footer>

        <a
          href="https://wa.me/5565999999999?text=Olá!%20Quero%20falar%20sobre%20lotes."
          target="_blank"
          className="fixed bottom-5 right-5 rounded-full shadow-xl px-5 py-3 bg-green-500 text-white font-medium hover:opacity-90"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}
