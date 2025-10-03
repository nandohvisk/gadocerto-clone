// ./src/sanity/lib/queries.ts

// Config do site (com URLs resolvidas para vídeo e imagem do Hero)
export const SITE_CONFIG_QUERY = /* groq */ `
  coalesce(
    *[_type == "siteConfig"][0]{
      siteTitle,
      tema,
      "corPrimaria": coalesce(corPrimaria, "#16a34a"),
      "corFundo":    coalesce(corFundo, "#ffffff"),
      "corTexto":    coalesce(corTexto, "#111827"),

      // >>> mídias do Hero (sempre resolvidas para URL)
      "heroVideoResolved": heroVideo.asset->url,
      "heroImageUrl": heroImage.asset->url,

      usarVideoNoHero,
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

// Últimos 9 lotes publicados (home)
export const LOTES_DESTAQUE_QUERY = /* groq */ `
*[_type == "lote" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...9]{
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
  precoLabel,
  "fotos": fotos[]{ "url": coalesce(asset->url, url) }
}
`;
