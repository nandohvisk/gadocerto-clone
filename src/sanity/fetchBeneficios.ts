// F:\gadocerto-clone\gadocerto-clone\src\sanity\fetchBeneficios.ts
import { sanityClient } from "@/sanity/lib/client";

export type BeneficioBox = {
  icone?: string | null;
  titulo?: string | null;
  descricao?: string | null;
};

export type BeneficiosDoc = {
  tituloSuperior?: string | null;
  subtitulo?: string | null;
  caixas?: BeneficioBox[] | null;
};

/**
 * Busca o primeiro documento do tipo "beneficios"
 * Retorna null se não existir ainda no Studio.
 */
export async function fetchBeneficios(): Promise<BeneficiosDoc | null> {
  const query = `
    *[_type == "beneficios"][0]{
      tituloSuperior,
      subtitulo,
      caixas[]{
        icone,
        titulo,
        descricao
      }
    }
  `;
  try {
    const data = await sanityClient.fetch<BeneficiosDoc | null>(query);
    return data ?? null;
  } catch (e) {
    console.error("Erro ao buscar beneficios:", e);
    return null;
  }
}
