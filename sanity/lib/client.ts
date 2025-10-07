// F:\gadocerto-clone\gadocerto-clone\sanity\lib\client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Token de LEITURA (apenas servidor). NÃO use NEXT_PUBLIC aqui.
const token = process.env.SANITY_READ_TOKEN;

// Regras:
// - Se houver token (dataset privado), desliga CDN para respostas autenticadas.
// - Se NÃO houver token (dataset público), usa CDN para respostas mais rápidas.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !token,
  token,                    // só é lido no servidor
  perspective: "published", // apenas documentos publicados
  stega: false,             // sem marcações de visual editing no HTML
});
