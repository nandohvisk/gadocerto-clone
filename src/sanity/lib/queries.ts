// F:\gadocerto-clone\gadocerto-clone\src\sanity\lib\queries.ts
import { groq } from 'next-sanity';

/** Configurações do site (hero, cores, etc.) */
export const SITE_CONFIG_QUERY = groq/* groq */ `
*[_type == "siteConfig"][0]{
  siteTitle,
  tema,
  corPrimaria,
  corFundo,
  corTexto,
  usarVideoNoHero,
  // nomes alinhados ao seu schema
  "heroVideoResolved": coalesce(heroVideoArquivo.asset->url, heroVideoUrl),
  "heroImageUrl": heroImagem.asset->url,
  heroTitulo,
  heroDescricao,
  whatsappGeral,
  menu
}
`;

/** Configuração das abas da Home */
export const HOME_TABS_QUERY = groq/* groq */ `
*[_type == "homeTabs"][0]{
  ativo,
  tituloComprar,
  tituloVender,
  placeholderLocal,
  botaoProcurar
}
`;

/** Lista de categorias para filtros */
export const CATEGORIES_QUERY = groq/* groq */ `
*[_type == "category"]|order(title asc){
  _id,
  title,
  tipo,
  "slug": coalesce(slug.current, "")
}
`;

/** 🔹 Lista de lotes (usado em /lotes) */
export const LOTES_QUERY = groq/* groq */ `
*[_type == "lote"]|order(_createdAt desc){
  ...,
  // urls comodas
  "coverUrl": coalesce(capa.asset->url, imagemCapa.asset->url, imagens[0].asset->url),
  "categoriaSlug": coalesce(categoria->slug.current, categoria.slug.current),
}
`;

/** 🔹 Lote por ID (usado em /lotes/[id]) */
export const LOTE_BY_ID_QUERY = groq/* groq */ `
*[_type == "lote" && _id == $id][0]{
  ...,
  "coverUrl": coalesce(capa.asset->url, imagemCapa.asset->url, imagens[0].asset->url),
  "categoriaSlug": coalesce(categoria->slug.current, categoria.slug.current),
  // se houver relação com categoria/autor, já expando nomes básicos
  categoria->{ _id, title, "slug": slug.current },
  autor->{ _id, nome, "fotoUrl": foto.asset->url }
}
`;
