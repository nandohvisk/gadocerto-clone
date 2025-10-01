"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Gado Terra Grande
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/lotes" className="hover:underline">Lotes</Link>
          <Link href="/etica" className="hover:underline">Canal de Ética</Link>
          <Link href="/termos" className="hover:underline">Termos</Link>
          <Link href="/contato" className="hover:underline">Contato</Link>
        </nav>
      </div>
    </header>
  );
}
