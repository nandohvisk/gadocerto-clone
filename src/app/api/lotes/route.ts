// F:\gadocerto-clone\gadocerto-clone\src\app\api\lotes\route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qRaw = (searchParams.get("q") || "").trim();
    const categoriaRaw = (searchParams.get("categoria") || "").trim();
    const ufRaw = (searchParams.get("uf") || "").trim();

    // prefix search p/ GROQ 'match'
    const q = qRaw ? `${qRaw}*` : null;
    const categoria = categoriaRaw ? `${categoriaRaw}*` : null;
    const uf = ufRaw || null;

    const query = /* groq */ `
*[_type == "lote"
  && (!defined($uf) || uf == $uf)
  && (!defined($categoria) ||
      categoriaRef->label match $categoria ||
      categoriaRef->value match $categoria ||
      categoria match $categoria
  )
  && (!defined($q) || (
        titulo match $q ||
        municipio match $q ||
        raca match $q ||
        categoriaRef->label match $q ||
        categoriaRef->value match $q
  ))
] | order(_createdAt desc){
  _id,
  titulo,
  raca,
  idadeMeses,
  pesoMedioKg,
  cabecas,
  municipio,
  uf,
  "fotos": fotos[].asset->url,
  "categoriaValue": coalesce(categoriaRef->value, categoria),
  "categoriaLabel": coalesce(categoriaRef->label, categoriaRef->title, categoria)
}
`;

    // sempre envie as chaves (null quando vazio) para não quebrar o GROQ
    const rows = await sanityClient.fetch<any[]>(query, { q, categoria, uf });

    const data = (rows ?? []).map((r) => ({
      _id: r._id,
      titulo: r.titulo ?? "Lote",
      categoria: r.categoriaLabel || r.categoriaValue || "",
      raca: r.raca || "",
      idadeMeses: r.idadeMeses || 0,
      pesoMedioKg: r.pesoMedioKg || 0,
      cabecas: r.cabecas || 0,
      municipio: r.municipio || "",
      uf: r.uf || "",
      fotos: Array.isArray(r.fotos) ? r.fotos.filter(Boolean) : [],
    }));

    return NextResponse.json(data, {
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
