// ./sanity/lib/queries.ts

// Config do site – já traz URL do vídeo/foto resolvida
export const SITE_CONFIG_QUERY = `
*[_type == "siteConfig"][0]{
  siteTitle,
  tema,
  corPrimaria, corFundo, corTexto,
  usarVideoNoHero,
  // pega vídeo do upload OU da URL (o que existir)
  "heroVideoResolved": coalesce(heroVideoArquivo.asset->url, heroVideoUrl),
  "heroImageUrl": heroImagem.asset->url,
  heroTitulo,
  heroDescricao,
  whatsappGeral,
  emailContato,
  menu
}
`

// Lista de lotes (com URLs de fotos/vídeos)
export const LOTES_QUERY = `
*[_type == "lote"] | order(_createdAt desc){
  _id,
  titulo, categoria, raca, idadeMeses, pesoMedioKg, cabecas, municipio, uf, whatsapp,
  "fotos": fotos[].asset->url,
  "videosArquivo": videosArquivo[].asset->url,
  videosUrl
}
`

// Lote por ID
export const LOTE_BY_ID_QUERY = `
*[_type=="lote" && _id==$id][0]{
  _id,
  titulo, categoria, raca, idadeMeses, pesoMedioKg, cabecas, municipio, uf, whatsapp,
  "fotos": fotos[].asset->url,
  "videosArquivo": videosArquivo[].asset->url,
  videosUrl
}
`
