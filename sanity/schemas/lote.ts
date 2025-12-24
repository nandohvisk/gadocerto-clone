// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\lote.ts
import {defineField, defineType} from 'sanity'
import CityAutocomplete from '../components/CityAutocomplete' // autocomplete IBGE

export default defineType({
  name: 'lote',
  title: 'Lote',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: r => r.required(),
    }),

    // Categoria (referência) + legado oculto
    defineField({
      name: 'categoriaRef',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      options: { disableNew: false },
      validation: r => r.required(),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria (LEGADO — não usar)',
      type: 'string',
      hidden: true,
    }),

    // Raça (referência) + legado oculto
    defineField({
      name: 'racaRef',
      title: 'Raça',
      type: 'reference',
      to: [{ type: 'breed' }],
      options: { disableNew: false },
      description: 'Selecione uma raça cadastrada em “Raça”.',
    }),
    defineField({
      name: 'raca',
      title: 'Raça (LEGADO — não usar)',
      type: 'string',
      hidden: true,
    }),

    defineField({ name: 'idadeMeses',  title: 'Idade (meses)',   type: 'number' }),
    defineField({ name: 'pesoMedioKg', title: 'Peso médio (kg)', type: 'number' }),
    defineField({ name: 'cabecas',     title: 'Cabeças',         type: 'number' }),

    // Município com AUTOCOMPLETE (salvo como "Cidade/uf", ex.: Cuiabá/mt)
    defineField({
      name: 'municipio',
      title: 'Município',
      type: 'string',
      components: { input: CityAutocomplete },
      description: 'Digite e selecione a cidade. Será salvo como "Cidade/uf" (ex.: Cuiabá/mt).',
      validation: r => r.required(),
    }),

    // UF passa a ser campo LEGADO/oculto — será derivado do município (Cuiabá/mt → mt)
    defineField({
      name: 'uf',
      title: 'UF (LEGADO — derivado de Município)',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),

    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (somente dígitos, com DDI)',
      type: 'string',
    }),

    // Fotos
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // Vídeos (upload)
    defineField({
      name: 'videosArquivo',
      title: 'Vídeos (upload)',
      type: 'array',
      of: [{ type: 'file', options: { accept: 'video/*' } }],
    }),

    // Vídeos (links externos)
    defineField({
      name: 'videosUrl',
      title: 'Vídeos (links externos)',
      type: 'array',
      of: [{ type: 'url' }],
    }),

    // Extras
    defineField({ name: 'precoLabel', title: 'Selo de preço', type: 'string' }),
    defineField({ name: 'badgeIcon',  title: 'Ícone/Badge (emoji opcional)', type: 'string' }),
    defineField({ name: 'emoji',      title: 'Emoji (ex.: 🐮)', type: 'string' }),
  ],

  preview: {
    select: {
      title: 'titulo',
      media: 'fotos.0',
      categoriaLabel: 'categoriaRef.label',
      categoriaTitle: 'categoriaRef.title',
      categoriaLegacy: 'categoria',
      racaNome: 'racaRef.nome',
      municipio: 'municipio',
    },
    prepare({ title, media, categoriaLabel, categoriaTitle, categoriaLegacy, racaNome, municipio }) {
      const parts: string[] = []
      const cat = categoriaLabel || categoriaTitle || categoriaLegacy
      if (cat) parts.push(cat)
      if (racaNome) parts.push(racaNome)
      if (municipio) parts.push(municipio)
      return {
        title: title || 'Lote',
        media,
        subtitle: parts.join(' • ') || 'Sem categoria',
      }
    },
  },
})
