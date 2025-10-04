// ./src/sanity/lib/queries.ts

// ========== SITE CONFIG ==========
export const SITE_CONFIG_QUERY = /* groq */ `
  coalesce(
    *[_type == "siteConfig"][0]{
      siteTitle,
      tema,
      "corPrimaria": coalesce(corPrimaria, "#16a34a"),
      "corFundo":    coalesce(corFundo, "#ffffff"),
      "corTexto":    coalesce(corTexto, "#111827"),
      usarVideoNoHero,
      "heroVideoResolved": heroVideo.asset->url,
      "heroImageUrl": heroImage.asset->url,
      heroTitulo,
      heroDescricao,
      whatsappGeral,
      menu[]{label, href}
    },
    {
      "siteTitle": "Gado Terra Grande",
      "tema": "claro",
      "corPrimaria": "#16a34a",
      "corFundo": "#ffffff",
      "corTexto": "#111827",
      "usarVideoNoHero": false
    }
  )
`;

// ========== PROJEÇÃO REUTILIZÁVEL DOS LOTES ==========
export const LOTES_PROJECTION = /* groq */ `
{
  _id,
  titulo,
  categoria,
  raca,
  idadeMeses,
  pesoMedioKg,
  cabecas,
  municipio,
  uf,

  // imagens (urls)
  "fotos": coalesce(fotos[].asset->url, []),

  // vídeo (url se existir)
  "videoUrl": video.asset->url,

  // extras usados nos cards
  precoLabel,
  whatsapp,
  badgeIcon
}
`;

// ========== HOME: LOTES EM DESTAQUE ==========
export const LOTES_DESTAQUE_QUERY = /* groq */ `
*[_type == "lote" && (publicarNaHome == true || destaque == true)]
| order(_createdAt desc)[0...6]
${LOTES_PROJECTION}
`;

// ========== PÁGINA /lotes (LISTA GERAL) ==========
export const LOTES_QUERY = /* groq */ `
*[_type == "lote"]
| order(_createdAt desc)[0...50]
${LOTES_PROJECTION}
`;

// ========== PÁGINA /lotes/[id] (POR ID OU SLUG) ==========
export const LOTE_BY_ID_QUERY = /* groq */ `
*[_type == "lote" && (_id == $id || slug.current == $id)][0]
${LOTES_PROJECTION}
`;
