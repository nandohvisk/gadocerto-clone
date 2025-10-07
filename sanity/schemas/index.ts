// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\index.ts
import siteConfig from "./siteConfig";
import homeTabs from "./homeTabs";
import category from "./category";
import lote from "./lote";
import lead from "./lead";
import beneficio from "./beneficios";        // já existente (plural)
import beneficiosHome from "./beneficiosHome"; // novo container arrastável

export const schemaTypes = [
  siteConfig,
  homeTabs,
  category,
  lote,
  lead,
  beneficio,
  beneficiosHome,
];
