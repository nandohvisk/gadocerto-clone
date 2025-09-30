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
