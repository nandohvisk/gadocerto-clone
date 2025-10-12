// Envia uma mensagem simples via WhatsApp Cloud API (Meta) para validar envio.
// POST /api/whatsapp/test  { "phone": "556598475566" , "text": "Mensagem de teste" }

import { NextResponse } from "next/server";

const WA_TOKEN = process.env.WHATSAPP_TOKEN; // Bearer token (Meta)
const WA_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID; // ID do número no WhatsApp Cloud

export async function POST(req: Request) {
  try {
    if (!WA_TOKEN || !WA_PHONE_ID) {
      return NextResponse.json(
        { error: "Faltam variáveis WHATSAPP_TOKEN ou WHATSAPP_PHONE_NUMBER_ID" },
        { status: 500 }
      );
    }

    const { phone, text } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Informe 'phone' em E.164. Ex: 556598475566" }, { status: 400 });
    }

    const body = {
      messaging_product: "whatsapp",
      to: String(phone),
      type: "text",
      text: { body: text || "Teste de envio via WhatsApp Cloud API" },
    };

    const url = `https://graph.facebook.com/v19.0/${WA_PHONE_ID}/messages`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Next 15: evita caching de rota
      cache: "no-store",
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: "Falha no envio", details: data }, { status: r.status });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Erro inesperado" }, { status: 500 });
  }
}
