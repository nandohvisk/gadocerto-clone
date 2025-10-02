// F:\gadocerto-clone\gadocerto-clone\src\components\RegisterModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterModal({ open, onClose }: Props) {
  const [tipo, setTipo] = useState<"cliente" | "vendedor">("cliente");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeFazenda, setNomeFazenda] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);

  // fecha ao apertar ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // fecha ao clicar fora
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!open || !boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) onClose();
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, onClose]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setOkMsg(null);

    if (!nomeCompleto.trim()) {
      setErrMsg("Nome completo é obrigatório.");
      return;
    }
    if (!telefone.trim()) {
      setErrMsg("Celular é obrigatório.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          nomeCompleto: nomeCompleto.trim(),
          nomeFazenda: nomeFazenda.trim(),
          telefone: telefone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || "Falha ao enviar cadastro");
      }
      setOkMsg("Cadastro enviado com sucesso!");
      // limpa o formulário
      setNomeCompleto("");
      setNomeFazenda("");
      setTelefone("");
      setTipo("cliente");
    } catch (err: any) {
      setErrMsg(err?.message || "Erro ao enviar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* modal */}
      <div
        ref={boxRef}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-lg p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Entrar / Cadastro rápido</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          {/* tipo */}
          <div className="flex gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value="cliente"
                checked={tipo === "cliente"}
                onChange={() => setTipo("cliente")}
              />
              Sou cliente
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value="vendedor"
                checked={tipo === "vendedor"}
                onChange={() => setTipo("vendedor")}
              />
              Sou vendedor
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">Nome completo *</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nome da fazenda (opcional)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              value={nomeFazenda}
              onChange={(e) => setNomeFazenda(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Celular (WhatsApp) *</label>
            <input
              type="tel"
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder="(xx) xxxxx-xxxx"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>

          {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
          {okMsg && <p className="text-sm text-green-600">{okMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-white font-medium"
            style={{ background: "#1F2C3B" }}
          >
            {loading ? "Enviando..." : "Salvar cadastro"}
          </button>
        </form>
      </div>
    </div>
  );
}
