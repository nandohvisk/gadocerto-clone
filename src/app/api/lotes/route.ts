// ./src/app/api/lotes/route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { LOTES_PROJECTION } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // parâmetros de filtro vindos da URL
    const qRaw = (searchParams.get("q") || "").trim();
    const categoriaRaw = (searchParams.get("categoria") || "").trim();
    const ufRaw = (searchParams.get("uf") || "").trim();

    // para usar com `match` no GROQ
    const q = qRaw ? `${qRaw}*` : null;
    const categoria = categoriaRaw ? `${categoriaRaw}*` : null;
    const uf = ufRaw || null;

    // consulta com os mesmos filtros que já usávamos,
    // mas agora aplicando a projeção que inclui fotos e videoUrl
    const query = /* groq */ `
*[_type == "lote"
  && (!defined($uf) || uf == $uf)
  && (!defined($categoria) || (
        categoriaRef->label match $categoria ||
        categoriaRef->value match $categoria ||
        categoria match $categoria
  ))
  && (!defined($q) || (
        titulo match $q ||
        municipio match $q ||
        raca match $q ||
        categoriaRef->label match $q ||
        categoriaRef->value match $q
  ))
]
| order(_createdAt desc)[0...50]
${LOTES_PROJECTION}
`;

    // sempre envie as chaves (null quando vazio) para não quebrar o GROQ
    const rows = await sanityClient.fetch<any[]>(query, { q, categoria, uf });

    // rows já vêm com: _id, titulo, categoria, raca, idadeMeses, pesoMedioKg,
    // cabecas, municipio, uf, fotos (urls[]), videoUrl (string), precoLabel, whatsapp, emoji...
    // devolvemos direto
    return NextResponse.json(rows ?? [], {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    console.error("API /lotes error:", e);
    return NextResponse.json([], { status: 200 });
  }
}
