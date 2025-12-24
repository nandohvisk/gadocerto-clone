// OTP de demonstração (memória + expiração).
// POST /api/otp/demo  { action: "create", phone: "5565999999999", code?: "123456", ttlSec?: 600 }
// POST /api/otp/demo  { action: "verify", phone: "5565999999999", code: "123456" }

import { NextResponse } from "next/server";

type Action = "create" | "verify";

type Body =
  | { action: "create"; phone: string; code?: string; ttlSec?: number }
  | { action: "verify"; phone: string; code: string };

// Armazena em memória (reinicia a cada build/restart)
type Entry = { code: string; expiresAt: number };
const store = new Map<string, Entry>();

const DEFAULT_TTL_SEC = 10 * 60; // 10 minutos

function normalizePhone(raw?: string) {
  return (raw || "").replace(/[^\d]/g, "");
}

function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const action = (body as any)?.action as Action;
    const phone = normalizePhone((body as any)?.phone);

    if (!action || !phone) {
      return NextResponse.json(
        { ok: false, error: "Informe 'action' e 'phone'." },
        { status: 400 }
      );
    }

    if (action === "create") {
      const ttlSec =
        typeof (body as any)?.ttlSec === "number" && (body as any)?.ttlSec > 0
          ? (body as any).ttlSec
          : DEFAULT_TTL_SEC;

      const code = (body as any)?.code?.toString() || genCode();
      const expiresAt = Date.now() + ttlSec * 1000;

      store.set(phone, { code, expiresAt });

      return NextResponse.json({
        ok: true,
        phone,
        code, // devolvemos o código para facilitar a demo
        expiresInSec: ttlSec,
      });
    }

    if (action === "verify") {
      const code = (body as any)?.code?.toString();
      if (!code) {
        return NextResponse.json(
          { ok: false, error: "Informe 'code' para verificar." },
          { status: 400 }
        );
      }

      const entry = store.get(phone);
      if (!entry) {
        return NextResponse.json(
          { ok: false, error: "Telefone não encontrado ou código expirado." },
          { status: 404 }
        );
      }

      if (Date.now() > entry.expiresAt) {
        store.delete(phone);
        return NextResponse.json(
          { ok: false, error: "Código expirado. Gere outro." },
          { status: 410 }
        );
      }

      if (entry.code !== code) {
        return NextResponse.json(
          { ok: false, error: "Código inválido." },
          { status: 401 }
        );
      }

      // sucesso: limpa para não reutilizar
      store.delete(phone);
      return NextResponse.json({ ok: true, phone });
    }

    return NextResponse.json(
      { ok: false, error: "Ação inválida. Use 'create' ou 'verify'." },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Erro inesperado" },
      { status: 500 }
    );
  }
}
