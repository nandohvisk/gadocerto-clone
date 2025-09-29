// ./sanity.config.ts
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import lote from './sanity/schemas/lote'
import siteConfig from './sanity/schemas/siteConfig'

export default defineConfig({
  name: 'default',
  title: 'Admin – Gado Terra Grande',
  projectId: 'c3gva15q',            // <— seu Project ID
  dataset: 'production',            // pode manter "production"
  basePath: '/admin',               // painel em /admin
  plugins: [deskTool(), visionTool()],
  schema: { types: [lote, siteConfig] },
})
