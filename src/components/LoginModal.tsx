"use client";

import { useEffect, useRef, useState } from "react";
import { sanityClient } from "@/sanity/lib/client";
import { SITE_CONFIG_QUERY } from "@/sanity/lib/queries";

type Step = "phone" | "name" | "code";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  const GREEN = "#1C4532";          // verde institucional
  const DEFAULT_YELLOW = "#F6C34A"; // amarelo fixo do projeto
  const [accent, setAccent] = useState(DEFAULT_YELLOW);

  // Busca corPrimaria do Sanity apenas como backup (mas sempre usamos o amarelo fixo)
  useEffect(() => {
    (async () => {
      try {
        const cfg = await sanityClient.fetch<{ corPrimaria?: string }>(SITE_CONFIG_QUERY);
        const c = (cfg?.corPrimaria || "").trim();
        if (isValidHex(c)) setAccent(c);
        else setAccent(DEFAULT_YELLOW);
      } catch {
        setAccent(DEFAULT_YELLOW);
      }
    })();
  }, []);

  // Reset quando o modal fecha
  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setName("");
      setCode(Array(6).fill(""));
    }
  }, [open]);

  useEffect(() => {
    if (step === "code") codeRefs.current[0]?.focus();
  }, [step]);

  if (!open) return null;

  function submitPhone(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setStep("name");
  }

  function submitName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStep("code");
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    const joined = code.join("");
    if (joined.length < 6) return;
    alert("✅ Código validado (simulação).");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* fundo escurecido */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* container central */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-2xl border border-black/10 overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between px-6 py-4">
            <h1
              className="text-xl md:text-2xl font-extrabold"
              style={{ color: GREEN }}
            >
              Fazer login
            </h1>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-full p-2 hover:bg-black/5"
            >
              ✕
            </button>
          </div>

          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, #00000014, transparent)",
            }}
          />

          <div className="px-6 pb-7 pt-6">
            <p className="text-sm text-black/70 mb-5">
              Digite seus dados e aproveite os benefícios exclusivos da conta gratuita.
            </p>

            {/* STEP 1 — telefone */}
            {step === "phone" && (
              <form onSubmit={submitPhone} className="grid gap-4">
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-black/80">
                    Digite seu telefone
                  </span>
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
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#1C4532] transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 0 0 4px ${toRgba(accent, 0.18)}`,
                      filter: "brightness(1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.filter = "brightness(1.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.filter = "brightness(1)")
                    }
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "translateY(1px)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    Próximo
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold border border-black/10 bg-white hover:bg-black/5"
                  >
                    Voltar
                  </button>
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
                  <span className="text-sm font-medium text-black/80">
                    Nome completo
                  </span>
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
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-[#1C4532] transition-all duration-200 focus:outline-none"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 0 0 4px ${toRgba(accent, 0.18)}`,
                      filter: "brightness(1)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.filter = "brightness(1.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.filter = "brightness(1)")
                    }
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "translateY(1px)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
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
                        codeRefs.current[i] = el;
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
                    <b>Telefone:</b> (65) 3021-9499 —{" "}
                    <b>E-mail:</b> contato@gadocerto.com.br
                  </div>

                  <div className="mt-3 text-xs text-black/60 underline underline-offset-4">
                    Termos de Uso e Políticas de Privacidade
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* utils */
function isValidHex(hex: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());
}
function toRgba(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
