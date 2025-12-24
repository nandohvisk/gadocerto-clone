"use client";

import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** callback opcional após login OK (ex.: atualizar header) */
  onSuccess?: (phone: string) => void;
};

export default function LoginOTPModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = React.useState<"phone" | "code">("phone");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");

  // refs
  const phoneRef = React.useRef<HTMLInputElement | null>(null);
  const codeRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setStep("phone");
      setLoading(false);
      setError(null);
      setCode("");
      // foca no input de telefone quando abrir
      setTimeout(() => phoneRef.current?.focus(), 50);
    }
  }, [open]);

  function normalizePhone(raw: string): string {
    return (raw || "").replace(/[^\d]/g, "");
  }

  async function handleGenerateCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const p = normalizePhone(phone);

    if (!p || p.length < 10) {
      setError("Informe um celular válido.");
      return;
    }

    try {
      setLoading(true);
      const r = await fetch("/api/otp/demo/router", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", phone: p }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) {
        throw new Error(data?.error || "Falha ao gerar código.");
      }
      setStep("code");
      // foca no input de código
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (err: any) {
      setError(err?.message || "Erro ao gerar código.");
    } finally {
      setLoading(false);
    }
  }

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const p = normalizePhone(phone);
    const c = (code || "").trim();

    if (!p || !c) {
      setError("Preencha telefone e código.");
      return;
    }

    try {
      setLoading(true);
      const r = await fetch("/api/auth/otp/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p, code: c }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) {
        throw new Error(data?.error || "Código inválido.");
      }

      // sucesso: dispara callback opcional e fecha o modal
      onSuccess?.(p);
      onClose();

      // dica: se quiser forçar atualização da UI que depende de cookie no server:
      // window.location.reload();
    } catch (err: any) {
      setError(err?.message || "Erro ao validar código.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[999] flex items-center justify-center"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !loading && onClose()}
      />

      {/* content */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Entrar na conta</h2>
          <button
            className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
            onClick={() => !loading && onClose()}
          >
            Fechar
          </button>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleGenerateCode} className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-800">
                Celular (WhatsApp)
              </span>
              <input
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(65) 9 9999-9999"
                className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-200"
              />
            </label>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#C9A227] px-4 py-2.5 font-semibold text-[#1C4532] transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Gerando..." : "Gerar código"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleValidate} className="grid gap-4">
            <div className="text-sm text-gray-700">
              Enviamos um código para <strong>{phone}</strong>.
            </div>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gray-800">Código</span>
              <input
                ref={codeRef}
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                className="w-40 rounded-xl border border-gray-300 px-3 py-2 tracking-widest outline-none focus:ring-4 focus:ring-emerald-200"
              />
            </label>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="mt-1 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setStep("phone")}
                className="rounded-xl border border-gray-300 px-4 py-2.5 font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#1C4532] px-4 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Validando..." : "Validar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
