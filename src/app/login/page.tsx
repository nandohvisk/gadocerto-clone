// F:\gadocerto-clone\gadocerto-clone\src\app\login\page.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// 🔹 lê a cor do Sanity (dataset público)
import { sanityClient } from "@/sanity/lib/client";
import { SITE_CONFIG_QUERY } from "@/sanity/lib/queries";

type Step = "phone" | "name" | "code";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("phone");

  // dados do usuário
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  // código (6 dígitos)
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  // paleta (⚠️ agora dinâmica via Sanity)
  const [accent, setAccent] = useState("#E46A1B"); // corPrimaria
  const GREEN = "#1C4532"; // verde institucional

  // busca a cor primária do Sanity quando a página abre
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const cfg = await sanityClient.fetch<{ corPrimaria?: string }>(SITE_CONFIG_QUERY);
        if (!ignore && cfg?.corPrimaria) setAccent(cfg.corPrimaria);
      } catch {
        // fallback permanece
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (step === "code") {
      codeRefs.current[0]?.focus();
    }
  }, [step]);

  function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    // aqui você chamaria sua API para enviar o código / criar o cadastro
    setStep("name");
  }

  function submitName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    // poderia atualizar o cadastro com o nome aqui
    setStep("code");
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length < 6) return;
    // validar código na API e autenticar usuário
    alert("✅ Código validado (simulação).");
    // redirecionar conforme sua regra
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#F7F4EE" }}
    >
      <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-black/10 overflow-hidden">
        {/* header minimalista */}
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl md:text-2xl font-extrabold" style={{ color: GREEN }}>
            Fazer login
          </h1>
          <Link href="/" aria-label="Fechar" className="rounded-full p-2 hover:bg-black/5">
            ✕
          </Link>
        </div>

        {/* linha suave */}
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, #00000014, transparent)" }}
        />

        <div className="px-6 pb-7 pt-6">
          <p className="text-sm text-black/70 mb-5">
            Digite seus dados e aproveite os benefícios exclusivos da conta gratuita.
          </p>

          {/* STEP 1 — telefone */}
          {step === "phone" && (
            <form onSubmit={submitPhone} className="grid gap-4">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-black/80">Digite seu telefone</span>
                <input
                  inputMode="tel"
                  placeholder="(65) 9 8477-5566"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-black/15 px-3 py-3 outline-none focus:ring-4"
                  style={{ boxShadow: `0 0 0 4px ${toRgba(accent, 0.25)}` }}
                />
              </label>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#1c1c1c] transition-all duration-200 hover:brightness-105 active:translate-y-[1px] focus:outline-none focus-visible:ring-4"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${accent}, ${shade(accent, -10)})`,
                    boxShadow: `0 0 0 4px ${toRgba(accent, 0.25)}`,
                  }}
                >
                  Próximo
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-black/10 bg-white hover:bg-black/5"
                >
                  Voltar
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2 — nome */}
          {step === "name" && (
            <form onSubmit={submitName} className="grid gap-4">
              <div>
                <span className="text-xs text-black/60">Telefone</span>
                <input
                  disabled
                  value={phone}
                  className="w-full mt-1 rounded-xl border border-black/10 bg-black/5 px-3 py-3"
                />
              </div>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-black/80">Nome completo</span>
                <input
                  placeholder="seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-black/15 px-3 py-3 outline-none focus:ring-4"
                  style={{ boxShadow: `0 0 0 4px ${toRgba(accent, 0.25)}` }}
                />
              </label>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#1c1c1c] transition-all duration-200 hover:brightness-105 active:translate-y-[1px] focus:outline-none focus-visible:ring-4"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${accent}, ${shade(accent, -10)})`,
                    boxShadow: `0 0 0 4px ${toRgba(accent, 0.25)}`,
                  }}
                >
                  Próximo
                </button>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-black/10 bg-white hover:bg-black/5"
                >
                  Voltar
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 — código */}
          {step === "code" && (
            <form onSubmit={submitCode} className="grid gap-4">
              <p className="text-sm text-black/70">
                Agora digite o código enviado ao <b>WhatsApp</b> do número informado.
              </p>

              <div className="flex items-center justify-between gap-2">
                {code.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      codeRefs.current[i] = el; // ✅ callback ref sem retorno
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                      const next = [...code];
                      next[i] = val;
                      setCode(next);
                      if (val && i < 5) codeRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !code[i] && i > 0) {
                        codeRefs.current[i - 1]?.focus();
                      }
                    }}
                    className="h-12 w-12 text-center text-lg rounded-xl border border-black/15 focus:outline-none focus:ring-4"
                    style={{ boxShadow: `0 0 0 4px ${toRgba(accent, 0.25)}` }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white"
                  style={{ backgroundColor: GREEN }}
                >
                  Próximo
                </button>
                <button
                  type="button"
                  onClick={() => setStep("name")}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-black/10 bg-white hover:bg-black/5"
                >
                  Voltar
                </button>
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  className="text-sm underline underline-offset-4 hover:opacity-80"
                >
                  Enviar novamente
                </button>
              </div>

              <div className="mt-4 border-t pt-4">
                <button
                  type="button"
                  className="w-full rounded-xl border px-5 py-2.5 font-medium hover:bg-black/5"
                >
                  Enviar pelo Telegram
                </button>

                <div className="mt-4 text-xs text-black/60">
                  Dúvidas ou problemas? Entre em contato com a nossa equipe:
                  <br />
                  <b>Telefone:</b> (65) 3021-9499 — <b>E-mail:</b> contato@gadocerto.com.br
                </div>

                <div className="mt-3 text-xs text-black/60 underline underline-offset-4">
                  Termos de Uso e Políticas de Privacidade
                </div>
              </div>
            </form>
          )}

          {/* link inferior */}
          <div className="mt-6 text-sm text-center">
            <Link href="/" className="underline" style={{ color: GREEN }}>
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* utils de cor para foco/gradiente */
function toRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function shade(hex: string, amount = -10) {
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = clamp(((bigint >> 16) & 255) + (amount * 255) / 100);
  const g = clamp(((bigint >> 8) & 255) + (amount * 255) / 100);
  const b = clamp((bigint & 255) + (amount * 255) / 100);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
