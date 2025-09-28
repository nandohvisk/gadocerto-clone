"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-gray-600 grid gap-4 md:grid-cols-3">
        <div>
          <div className="font-semibold">Gado Terra Grande</div>
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
          <a href="mailto:contato@gadocerto.com.br" className="hover:underline">
            contato@terragrande.com.br
          </a>
        </div>
      </div>
    </footer>
  );
}
