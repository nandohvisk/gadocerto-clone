// F:\gadocerto-clone\gadocerto-clone\src\sanity\lib\queries.ts
import { groq } from 'next-sanity';

/** Configurações do site */
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

/** Lista de categorias */
export const CATEGORIES_QUERY = groq/* groq */ `
*[_type == "category"]|order(title asc){
  _id,
  title,
  tipo,
  "slug": coalesce(slug.current, "")
}
`;
