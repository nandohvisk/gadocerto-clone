"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { generateCode, normalizePhone } from "@/lib/auth/otp";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function LoginOTPModal({ open, onClose }: Props) {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setDigits(["", "", "", "", "", ""]);
      setError(null);
    }
  }, [open]);

  const testCode = useMemo(() => generateCode(phone), [phone]);

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError("Informe um telefone válido.");
      return;
    }
    setStep("code");
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  }

  function setDigit(idx: number, v: string) {
    const only = v.replace(/\D/g, "").slice(0, 1);
    setDigits((d) => {
      const next = d.slice();
      next[idx] = only;
      return next;
    });
    if (only && idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Digite os 6 dígitos.");
      return;
    }

    try {
      const res = await fetch("/api/auth/otp/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          code,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Código inválido.");
        return;
      }

      onClose();
      window.location.reload();
    } catch {
      setError("Falha ao validar. Tente novamente.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Fazer login</h3>
          <button
            aria-label="Fechar"
            className="rounded p-1 hover:bg-gray-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {step === "phone" ? (
            <form onSubmit={handleNext} className="grid gap-4">
              <p className="text-sm text-gray-600">
                Informe seu telefone. Enviaremos um código de verificação.
              </p>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-800">
                  Telefone (WhatsApp)
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  placeholder="(65) 9 9999-9999"
                  className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-200"
                  required
                />
              </label>

              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#E46A1B] px-5 font-semibold text-white hover:opacity-95"
                >
                  Próximo
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl border px-5 font-semibold text-gray-800 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Voltar
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleValidate} className="grid gap-4">
              <p className="text-sm text-gray-600">
                Agora digite o código enviado ao <strong>WhatsApp</strong> do número informado.
              </p>

              <div className="flex gap-2">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el; // ✅ callback ref sem retorno
                    }}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    inputMode="numeric"
                    className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg outline-none focus:ring-4 focus:ring-emerald-200"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                type="button"
                className="self-start text-sm text-emerald-700 underline underline-offset-2"
                onClick={() => {
                  alert(`Código de teste: ${testCode}`);
                }}
              >
                Gerar código de teste
              </button>

              {error && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-1 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1C4532] px-5 font-semibold text-white hover:opacity-95"
                >
                  Validar
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl border px-5 font-semibold text-gray-800 hover:bg-gray-50"
                  onClick={() => setStep("phone")}
                >
                  Voltar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
