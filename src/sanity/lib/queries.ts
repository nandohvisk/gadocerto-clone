// ./src/sanity/lib/queries.ts

// Config do site — já aplica defaults e mapeia possíveis nomes do seu schema
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
export const LOTES_QUERY = /* groq */ `
  *[_type == "lote"] | order(_createdAt desc){
    _id,
    id,
    titulo,
    municipio,
    uf,
    "foto": fotos[0].asset->url
  }
`;
