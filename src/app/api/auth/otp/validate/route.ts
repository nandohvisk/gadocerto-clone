// ./src/app/api/auth/otp/validate/route.ts
import { NextResponse } from "next/server";
import { generateCode, normalizePhone } from "@/lib/auth/otp";

export async function POST(req: Request) {
  try {
    const { phone, code } = (await req.json()) as { phone?: string; code?: string };

    if (!phone || !code) {
      return NextResponse.json({ ok: false, error: "Telefone e código são obrigatórios." }, { status: 400 });
    }

    // ✅ sempre normaliza o telefone antes de comparar
    const expected = generateCode(phone);

    if (code !== expected) {
      return NextResponse.json({ ok: false, error: "Código inválido." }, { status: 401 });
    }

    // ✅ seta cookie de login por 7 dias
    const res = NextResponse.json({ ok: true });
    res.cookies.set("gc_logged_in", "1", {
      path: "/",
      sameSite: "lax",
      httpOnly: false, // pode ser true se você só ler do servidor
      maxAge: 60 * 60 * 24 * 7,
    });
    res.cookies.set("otp_phone", normalizePhone(phone), {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Erro interno." }, { status: 500 });
  }
}
