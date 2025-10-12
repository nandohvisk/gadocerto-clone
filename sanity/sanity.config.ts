// ./sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { schema } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Gado Terra Grande',
  projectId: 'c3gva15q', // o mesmo ID usado no Vision
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema,
})
