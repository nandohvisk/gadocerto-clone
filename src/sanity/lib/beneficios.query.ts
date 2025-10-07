// F:\gadocerto-clone\gadocerto-clone\src\sanity\lib\beneficios.query.ts
import { groq } from "next-sanity";

export const BENEFICIOS_QUERY = groq`*[_type == "beneficio"] 
| order(coalesce(order, 999) asc, _createdAt asc)[]{
  _id,
  // campos principais
  titulo,
  descricao,
  // cor: "campo" | "trigo" | "ceu"
  coalesce(cor, "campo") as cor
}`;
