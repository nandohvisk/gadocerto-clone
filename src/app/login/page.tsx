// F:\gadocerto-clone\gadocerto-clone\src\app\login\page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type City = { nome: string; uf: string };

export default function LoginPage() {
  const [step, setStep] = useState<"form" | "code">("form");

  // form (controlado: não some ao enviar)
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [fazenda, setFazenda] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [citySelected, setCitySelected] = useState("");

  // autocomplete
  const [openSug, setOpenSug] = useState(false);
  const [loadingSug, setLoadingSug] = useState(false);
  const [sug, setSug] = useState<City[]>([]);
  const popRef = useRef<HTMLDivElement | null>(null);
  const inpRef = useRef<HTMLInputElement | null>(null);
  const debouncedQuery = useDebounce(cityQuery, 200);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSug([]);
        return;
      }
      try {
        setLoadingSug(true);
        const r = await fetch(
          `/api/ibge/municipios?q=${encodeURIComponent(debouncedQuery)}`
        );
        if (!r.ok) throw new Error("erro");
        const data: City[] = await r.json();
        if (!ignore) setSug(data.slice(0, 12));
      } catch {
        if (!ignore) setSug([]);
      } finally {
        if (!ignore) setLoadingSug(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!openSug) return;
      const t = e.target as Node;
      if (
        popRef.current &&
        !popRef.current.contains(t) &&
        inpRef.current &&
        !inpRef.current.contains(t)
      ) {
        setOpenSug(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openSug]);

  function onSubmitForm(e: React.FormEvent) {
    e.preventDefault(); // não recarrega nem limpa
    setStep("code"); // simula envio de código
  }

  function onValidate(e: React.FormEvent) {
    e.preventDefault();
    alert("✅ Código validado (simulação). Depois liberaremos os preços.");
  }

  const showCity = useMemo(
    () => citySelected || cityQuery,
    [cityQuery, citySelected]
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F4EE] px-4 py-20">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C4532] mb-2 text-center">
          Login do Produtor
        </h1>
        <p className="text-sm text-gray-700 text-center">
          Informe seus dados para receber um código de verificação no WhatsApp.
          Após validar, os <strong>preços dos lotes</strong> ficam liberados.
        </p>

        {step === "form" ? (
          <form onSubmit={onSubmitForm} className="mt-6 grid gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-800">
                Nome completo <span className="text-red-600">*</span>
              </label>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-200"
                placeholder="Ex.: João da Silva"
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm font-medium text-gray-800">
                Celular (WhatsApp) <span className="text-red-600">*</span>
              </label>
              <input
                required
                inputMode="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-200"
                placeholder="(65) 9 9999-9999"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-gray-800">
                  Nome da fazenda
                </span>
                <input
                  value={fazenda}
                  onChange={(e) => setFazenda(e.target.value)}
                  className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-200"
                  placeholder="Fazenda São José"
                />
              </label>

              <label className="grid gap-1 relative">
                <span className="text-sm font-medium text-gray-800">
                  Localização (cidade/UF)
                </span>
                <input
                  ref={inpRef}
                  value={showCity}
                  onChange={(e) => {
                    setCitySelected("");
                    setCityQuery(e.target.value);
                  }}
                  onFocus={() => setOpenSug(true)}
                  className="rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-emerald-200"
                  placeholder="Cuiabá/MT"
                />
                {openSug && (sug.length > 0 || loadingSug) && (
                  <div
                    ref={popRef}
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                  >
                    {loadingSug ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Carregando…
                      </div>
                    ) : (
                      sug.map((c, i) => {
                        const label = `${c.nome}/${c.uf}`;
                        return (
                          <button
                            type="button"
                            key={`${c.nome}-${c.uf}-${i}`}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => {
                              setCitySelected(label);
                              setCityQuery(label);
                              setOpenSug(false);
                            }}
                          >
                            {label}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold shadow-sm transition focus:outline-none focus-visible:ring-4"
                style={{ backgroundColor: "#C9A227", color: "#1C4532" }}
              >
                Receber código no WhatsApp
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={onValidate} className="mt-6 grid gap-4">
            <div className="grid gap-1">
              <span className="text-sm text-gray-700">
                Enviamos um código para <strong>{celular}</strong>.
              </span>
              <input
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="w-40 rounded-xl border border-gray-300 px-3 py-2 tracking-widest outline-none focus:ring-4 focus:ring-emerald-200"
                required
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-semibold text-gray-800 bg-white hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="rounded-xl px-5 py-2.5 font-semibold text-white"
                style={{ backgroundColor: "#1C4532" }}
              >
                Validar
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-sm text-center">
          <Link href="/" className="underline text-[#1C4532]">
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}

/* util: debounce */
function useDebounce<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}
