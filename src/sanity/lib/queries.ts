<<<<<<< HEAD
// F:\gadocerto-clone\src\sanity\lib\queries.ts
export const SITE_CONFIG_QUERY = `
*[_type == "siteConfig"][0]{
  siteTitle,
  tema,
  corPrimaria,
  corFundo,
  corTexto,
  usarVideoNoHero,
  "heroVideoResolved": heroVideo.asset->url,
  "heroImageUrl": heroImage.asset->url,
  heroTitulo,
  heroDescricao,
  whatsappGeral
}
`;

export const LOTES_QUERY = `
*[_type == "lote"] | order(_createdAt desc){
  _id,
  titulo,
  categoria,
  raca,
  idadeMeses,
  pesoMedioKg,
  cabecas,
  municipio,
  uf,
  "fotos": fotos[].asset->url
}
`;

export const LOTE_BY_ID_QUERY = `
*[_type=="lote" && _id==$id][0]{
  _id,
  titulo,
  categoria,
  raca,
  idadeMeses,
  pesoMedioKg,
  cabecas,
  municipio,
  uf,
  whatsapp,
  "fotos": fotos[].asset->url,
  "videosArquivo": videosArquivo[].asset->url,
  videosUrl
}
`;
=======
// ./src/sanity/lib/queries.ts

// Config do site — mapeia para os nomes usados na Home e aplica defaults
export const SITE_CONFIG_QUERY = /* groq */ `
  coalesce(
    *[_type == "siteConfig"][0]{
      "siteTitle":   coalesce(siteTitle, title, "Gado Terra Grande"),
      "tema":        coalesce(tema, "claro"),
      "corPrimaria": coalesce(corPrimaria, themeColor, "#16a34a"),
      "corFundo":    coalesce(corFundo, "#ffffff"),
      "corTexto":    coalesce(corTexto, "#111827"),
      "usarVideoNoHero": coalesce(usarVideoNoHero, false),
      "heroVideoResolved": heroVideo.asset->url,
      "heroImageUrl":      heroImage.asset->url,
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

// Um lote pelo ID (id amigável, não o _id do Sanity)
export const LOTE_BY_ID_QUERY = /* groq */ `
  *[_type == "lote" && id == $id][0]{
    _id,
    id,
    titulo,
    categoria,
    raca,
    idadeMeses,
    pesoMedioKg,
    cabecas,
    municipio,
    uf,
    whatsapp,
    "fotos": fotos[].asset->url,
    "videosArquivo": videosArquivo[].asset->url,
    videosUrl
  }
`;

// Lista para /lotes (thumbnail e dados básicos)
export const LOTES_LIST_QUERY = /* groq */ `
  *[_type == "lote"] | order(_createdAt desc){
    _id,
    id,
    titulo,
    municipio,
    uf,
    "foto": fotos[0].asset->url
  }
`;

// Compat: algumas páginas importam "LOTES_QUERY"
export { LOTES_LIST_QUERY as LOTES_QUERY };

>>>>>>> origin/main
