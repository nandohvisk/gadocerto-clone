// F:\gadocerto-clone\gadocerto-clone\src\app\layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import HeaderWithLogin from "@/components/HeaderWithLogin";

export const metadata: Metadata = {
  title: "Gado Terra Grande",
  description: "Compra e venda de gado com clareza e segurança.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-white text-gray-900">
        {/* Header com botão que abre o modal OTP (sem sair da página) */}
        <HeaderWithLogin />

        {/* Conteúdo da página */}
        <main>{children}</main>
      </body>
    </html>
  );
}
