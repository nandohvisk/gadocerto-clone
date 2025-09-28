"use client";

type Props = {
  numero?: string;   // no formato 55DDXXXXXXXXX
  mensagem?: string; // texto pré-preenchido
};

export default function WhatsAppButton({
  numero = "5565981492500",
  mensagem = "Olá! Quero falar sobre lotes.",
}: Props) {
  const href = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  return (
    <a
      href={href}
      target="_blank"
      className="fixed bottom-5 right-5 rounded-full shadow-xl px-5 py-3 bg-green-500 text-white font-medium hover:opacity-90"
    >
      WhatsApp
    </a>
  );
}
