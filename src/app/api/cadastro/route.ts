// F:\gadocerto-clone\gadocerto-clone\src\app\api\cadastro\route.ts
import {NextResponse} from "next/server";
import { sanityClient } from "@/sanity/lib/client";

// Tipagem básica do payload
type Payload = {
  tipo?: "cliente" | "vendedor";
  nomeCompleto?: string;
  nomeFazenda?: string;
  telefone?: string;
};

function normalizePhone(raw?: string) {
  if (!raw) return "";
  return raw.replace(/[^\d]/g, "");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;

    const tipo = body.tipo === "vendedor" ? "vendedor" : "cliente";
    const nomeCompleto = (body.nomeCompleto || "").trim();
    const nomeFazenda = (body.nomeFazenda || "").trim();
    const telefone = normalizePhone(body.telefone);

    // validações mínimas
    if (!nomeCompleto || nomeCompleto.length < 3) {
      return NextResponse.json(
        { ok: false, error: "Nome completo é obrigatório." },
        { status: 400 }
      );
    }
    if (!telefone) {
      return NextResponse.json(
        { ok: false, error: "Celular é obrigatório." },
        { status: 400 }
      );
    }

    // cria documento no Sanity
    const doc = {
      _type: "lead",
      tipo,
      nomeCompleto,
      nomeFazenda: nomeFazenda || undefined,
      telefone,
      createdAt: new Date().toISOString(),
    };

    // Observação: este código presume que seu `sanityClient`
    // no ambiente de servidor tem token de escrita configurado.
    const created = await sanityClient.create(doc);

    return NextResponse.json({ ok: true, id: created._id }, { status: 201 });
  } catch (err) {
    console.error("Erro ao salvar cadastro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro interno ao salvar cadastro." },
      { status: 500 }
    );
  }
}
