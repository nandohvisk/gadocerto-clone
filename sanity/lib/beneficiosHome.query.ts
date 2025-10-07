// F:\gadocerto-clone\gadocerto-clone\sanity\lib\beneficiosHome.query.ts
import { groq } from "next-sanity";

export const BENEFICIOS_HOME_QUERY = groq`
  *[_type == "beneficiosHome"][0]{
    itens[]->{
      _id,
      titulo,
      descricao,
      cor
    }
  }
`;
