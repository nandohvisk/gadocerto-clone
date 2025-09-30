// Config do site (ajuste os campos conforme seu schema)
export const SITE_CONFIG_QUERY = /* groq */ `
*[_type == "siteConfig"][0]{
  title,
  themeColor,
  heroVideo{asset->{url}},
  heroImage{asset->{url}}
}
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
