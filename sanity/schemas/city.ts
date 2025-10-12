// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\city.ts
import {defineField, defineType} from 'sanity'

/**
 * Documento: Cidade
 * - name: 'city' (usado nas referências)
 * - title: 'Cidade' (rótulo no Studio)
 * - type: 'document' para aparecer no menu
 * Campos:
 *   - nome (ex.: "Cuiabá")
 *   - uf (ex.: "MT")
 *   - lat/lng (opcionais; úteis para mapa)
 */
export default defineType({
  name: 'city',
  title: 'Cidade',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome da cidade',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'uf',
      title: 'UF',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      description: 'Opcional — usado para exibir mapa na página do lote',
    }),
    defineField({
      name: 'lng',
      title: 'Longitude',
      type: 'number',
      description: 'Opcional — usado para exibir mapa na página do lote',
    }),
  ],
  preview: {
    select: {title: 'nome', subtitle: 'uf'},
    prepare({title, subtitle}) {
      return {title, subtitle}
    },
  },
})
