// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\index.ts
import { type SchemaTypeDefinition } from 'sanity'

import siteConfig from './siteConfig'
import homeTabs from './homeTabs'
import category from './category'
import lote from './lote'
import lead from './lead'
import beneficio from './beneficios'
import beneficiosHome from './beneficiosHome'

// ✅ novo tipo: Raça
import breed from './breed'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    siteConfig,
    homeTabs,
    category,
    breed,            // ← registra Raça no Studio
    lote,
    lead,
    beneficio,
    beneficiosHome,
  ],
}

// ✅ export default para funcionar com `import { schema }` ou `import schema`
export default schema
