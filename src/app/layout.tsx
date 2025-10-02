// F:\gadocerto-clone\gadocerto-clone\src\app\layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "Gado Terra Grande — Compra e venda de gado",
  description: "Catálogo de lotes com raça, idade, peso e localização.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased text-gray-900">
        <Topbar />
        {children}
      </body>
    </html>
  );
}
