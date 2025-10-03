// ./src/sanity/lib/queries.ts

// Configurações do site (igual você já usava)
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

// >>> NOVO <<<
// Últimos 6 lotes publicados para mostrar na home
// Ajuste o nome do tipo/campos caso seu schema use outros nomes.
export const LOTES_DESTAQUE_QUERY = /* groq */ `
*[_type == "lote" && !(_id in path("drafts.**"))] | order(_createdAt desc)[0...6]{
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
  // Traz URLs de mídia do campo "fotos" (image ou file); se no seu schema
  // o campo tiver outro nome, troque somente essa linha.
  "fotos": fotos[]{
    "url": coalesce(asset->url, url)
  }
}
`;
