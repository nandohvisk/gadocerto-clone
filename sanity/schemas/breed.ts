// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\breed.ts
import {defineField, defineType} from 'sanity'

/**
 * Documento: Raça
 * - name: 'breed'  (usado no código/queries)
 * - title: 'Raça'  (rótulo que aparece no Studio)
 * - type: 'document'  (precisa ser DOCUMENT para aparecer no menu)
 */
export default defineType({
  name: 'breed',
  title: 'Raça',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome da raça',
      type: 'string',
      validation: r => r.required(),
    }),
  ],
  preview: {
    select: {title: 'nome'},
  },
})
