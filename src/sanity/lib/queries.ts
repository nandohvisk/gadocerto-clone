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
  "categoria": coalesce(categoriaRef->label, categoriaRef->title, categoria),
  raca,
  idadeMeses,
  pesoMedioKg,
  cabecas,
  municipio,
  uf,
  "fotos": coalesce(fotos[].asset->url, []),
  "videoUrl": coalesce(
    videosArquivo[0].asset->url,
    videosUrl[0],
    videos[0].asset->url,
    video.asset->url
  ),
  precoLabel,
  whatsapp,
  badgeIcon,
  emoji
}
`;

// ========== HOME: LOTES EM DESTAQUE ==========
export const LOTES_DESTAQUE_QUERY = /* groq */ `
*[_type == "lote"]
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

// ========== RELACIONADOS: MESMA CIDADE ==========
export const LOTES_RELACIONADOS_QUERY = /* groq */ `
*[_type == "lote" && _id != $id && (
    lower(municipio) == lower($municipio) ||
    municipio match $municipioPrefix
  )]
| order(_createdAt desc)[0...6]
${LOTES_PROJECTION}
`;

// 🔹 textos do formulário de busca (Hero)
export const HOME_TABS_QUERY = `
  *[_type == "abasDaHome" && ativo == true][0]{
    ativo,
    tituloComprar,
    tituloVender,
    placeholderLocal,
    botaoProcurar
  }
`;
