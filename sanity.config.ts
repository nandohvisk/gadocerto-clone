// F:\gadocerto-clone\gadocerto-clone\sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'

// Schemas
import lote from './sanity/schemas/lote'
import siteConfig from './sanity/schemas/siteConfig'
import category from './sanity/schemas/category'
import homeTabs from './sanity/schemas/homeTabs'
import lead from './sanity/schemas/lead' // Cadastros (clientes/vendedores)
import beneficios from './sanity/schemas/beneficios' // ✅ Seção de Benefícios (título, subtítulo e 3 caixas)

export default defineConfig({
  name: 'default',
  title: 'Admin – Gado Terra Grande',
  projectId: 'c3gva15q',
  dataset: 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [
      lote,
      siteConfig,
      category,
      homeTabs,
      lead,
      beneficios, // ✅ registrado no Studio
    ],
  },
})
