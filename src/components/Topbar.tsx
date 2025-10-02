// F:\gadocerto-clone\gadocerto-clone\src\components\Topbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import RegisterModal from "./RegisterModal";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white">
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between border-b">
        {/* lado esquerdo: logo/nome e navegação */}
        <div className="flex items-center gap-8">
          {/* Nome do site */}
          <Link href="/" className="text-lg font-bold text-gray-900">
            Gado Terra Grande
          </Link>

          {/* nav */}
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-gray-800 hover:text-gray-900">
              Início
            </Link>
            <Link href="/lotes" className="text-sm font-bold text-gray-800 hover:text-gray-900">
              Lotes
            </Link>
          </nav>
        </div>

        {/* lado direito: entrar na conta */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-gray-800 hover:opacity-90"
        >
          <span>Entrar na conta</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M4 20c2.5-3 5.5-4.5 8-4.5S17.5 17 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* modal de cadastro */}
      <RegisterModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
