// ./src/app/api/ibge/municipios/route.ts
import { NextResponse } from "next/server";

// evita o Data Cache do Next (que estourava por ser >2MB)
export const dynamic = "force-dynamic";

type IbgeCity = {
  id: number;
  nome: string;
  microrregiao: { mesorregiao: { UF: { sigla: string } } };
};

export async function GET() {
  try {
    // ❗ cache: 'no-store' para NÃO usar o Data Cache do Next
    const res = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "IBGE fetch failed" }, { status: 502 });
    }

    const data: IbgeCity[] = await res.json();

    // Mantém o MESMO formato esperado pelo componente (nome + UF aninhado)
    const payload = data.map((c) => ({
      id: c.id,
      nome: c.nome,
      microrregiao: {
        mesorregiao: { UF: { sigla: c.microrregiao?.mesorregiao?.UF?.sigla ?? "" } },
      },
    }));

    // Pode cachear em CDN/edge (não no Data Cache do Next)
    return new NextResponse(JSON.stringify(payload), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (err) {
    console.error("IBGE api error:", err);
    // devolve vazio para o front não quebrar
    return NextResponse.json([], { status: 200 });
  }
}
