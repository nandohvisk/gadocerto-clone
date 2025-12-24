// F:\gadocerto-clone\gadocerto-clone\src\app\api\categories\route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

// força execução no servidor a cada chamada (sem cache do Next)
export const dynamic = "force-dynamic";

type Row = {
  _id?: string;
  title?: string; name?: string; nome?: string; titulo?: string; label?: string;
  value?: string; valor?: string; slug?: { current?: string } | string;
};

function toLabelValue(d: Row) {
  const label =
    d.title ?? d.nome ?? d.name ?? d.titulo ?? d.label ?? "";

  const raw =
    d.value ??
    d.valor ??
    (typeof d.slug === "string" ? d.slug : d.slug?.current) ??
    label;

  const value = String(raw)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return { id: d._id, label: String(label).trim(), value: String(value).trim() };
}

export async function GET(req: Request) {
  try {
    // Busca SOMENTE documentos publicados do tipo "category"
    const rows: Row[] = await sanityClient.fetch(/* groq */ `
      *[
        _type == "category" &&
        !(_id in path("drafts.**"))
      ]{
        _id, title, name, nome, titulo, label, value, valor, slug
      } | order(coalesce(title, nome, name, titulo, label) asc)
    `);

    const items = (Array.isArray(rows) ? rows : [])
      .map(toLabelValue)
      .filter((x) => x.label && x.value);

    return new NextResponse(JSON.stringify(items), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    console.error("API /categories error:", e);
    // Em caso de erro, retorna lista vazia para não quebrar a UI
    return NextResponse.json([], { status: 200 });
  }
}
