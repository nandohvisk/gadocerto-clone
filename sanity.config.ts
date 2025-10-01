// F:\gadocerto-clone\gadocerto-clone\sanity.config.ts
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'

// importe cada schema do diretório local
import lote from './sanity/schemas/lote'
import siteConfig from './sanity/schemas/siteConfig'
import category from './sanity/schemas/category'
import homeTabs from './sanity/schemas/homeTabs'

export default defineConfig({
  name: 'default',
  title: 'Admin – Gado Terra Grande',
  projectId: 'c3gva15q',
  dataset: 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: [lote, siteConfig, category, homeTabs],
  },
})
