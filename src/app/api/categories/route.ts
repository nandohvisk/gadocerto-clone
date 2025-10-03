// ./src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

// evita cache do Next Data Cache e garante que sempre rode no servidor
export const dynamic = "force-dynamic";

type Row = {
  _id?: string;
  title?: string; name?: string; nome?: string; titulo?: string; label?: string;
  value?: string; valor?: string; slug?: { current?: string } | string;
};

function toLabelValue(d: Row) {
  const label =
    d.title ?? d.nome ?? d.name ?? d.titulo ?? d.label ?? "Categoria";
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

  return { id: d._id, label, value };
}

export async function GET() {
  try {
    // Se o nome do tipo no seu schema for diferente, troque "category" aqui
    const data: Row[] = await sanityClient.fetch(/* groq */ `
      *[_type == "category" && !(_id in path("drafts.**"))]{
        _id, title, name, nome, titulo, label, value, valor, slug
      } | order(title asc, nome asc, name asc)
    `);

    const items = Array.isArray(data) ? data.map(toLabelValue) : [];

    return new NextResponse(JSON.stringify(items), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        // cache no edge/CDN (não usa o Data Cache do Next)
        "cache-control": "public, s-maxage=21600, stale-while-revalidate=21600",
      },
    });
  } catch (e) {
    console.error("categories api error:", e);
    return NextResponse.json([], { status: 200 });
  }
}
