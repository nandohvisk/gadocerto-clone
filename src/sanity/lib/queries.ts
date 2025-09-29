// src/sanity/lib/queries.ts
import {groq} from "next-sanity"

// Query para buscar todos os lotes
export const LOTES_QUERY = groq`*[_type == "lote"]{
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
  fotos,
  videosArquivo,
  videosUrl
}`

// Query para buscar 1 lote pelo id
export const LOTE_BY_ID_QUERY = groq`*[_type == "lote" && _id == $id][0]{
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
  fotos,
  videosArquivo,
  videosUrl
}`
