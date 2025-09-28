import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton"; // 👈 novo import

export const metadata: Metadata = {
  title: "Gado Terra Grande — Compra e venda de gado",
  description: "Catálogo de lotes com raça, idade, peso e localização.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased text-gray-900">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton /> {/* 👈 agora usamos o componente */}
      </body>
    </html>
  );
}
