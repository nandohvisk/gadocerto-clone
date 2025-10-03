// ./src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* 1fr | auto | 1fr => a coluna central fica REALMENTE no centro da barra */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 md:h-16">
          {/* ESQUERDA — logo (placeholder textual por enquanto) */}
          <div className="justify-self-start">
            <Link href="/" className="inline-flex items-center gap-2">
              {/* troque por <img src="/sua-logo.svg" className="h-7 w-auto" /> quando escolhermos a logo */}
              <span className="text-[15px] md:text-base font-semibold tracking-wide text-gray-900">
                Gado Terra Grande 1
              </span>
            </Link>
          </div>

          {/* CENTRO — navegação (perfeitamente centralizada) */}
          <nav className="justify-self-center">
            <ul className="flex items-center gap-8 text-[15px] font-medium text-gray-800">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/lotes" className="hover:text-gray-900 transition-colors">
                  Lotes -s
                </Link>
              </li>
            </ul>
          </nav>

          {/* DIREITA — login (texto + ícone) */}
          <div className="justify-self-end">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-[15px] text-gray-800 hover:text-gray-900 transition-colors"
            >
              <span>Entrar na conta</span>
              {/* ícone user circular, parecido com o do print */}
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
  );
}
