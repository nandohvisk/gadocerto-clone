// ./sanity/schemas/lote.ts
import {defineField, defineType} from 'sanity'

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

    // ✅ NOVO: referência para Category (dropdown no Studio)
    defineField({
      name: 'categoriaRef',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: r => r.required(),
      options: { disableNew: false }, // permite criar categoria pela UI, se quiser
    }),

    // ⚠️ LEGADO: mantém o campo de texto antigo (não aparece mais no Studio)
    defineField({
      name: 'categoria',
      title: 'Categoria (LEGADO — não usar)',
      type: 'string',
      hidden: true,
    }),

    defineField({ name: 'raca',         title: 'Raça',           type: 'string' }),
    defineField({ name: 'idadeMeses',   title: 'Idade (meses)',  type: 'number' }),
    defineField({ name: 'pesoMedioKg',  title: 'Peso médio (kg)',type: 'number' }),
    defineField({ name: 'cabecas',      title: 'Cabeças',        type: 'number' }),
    defineField({ name: 'municipio',    title: 'Município',      type: 'string' }),

    // Mantive como string (compatível). Se quiser, podemos trocar por dropdown depois.
    defineField({ name: 'uf',           title: 'UF',             type: 'string' }),

    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (somente dígitos, com DDI)',
      type: 'string',
      // validation: (Rule) => Rule.regex(/^\d*$/).warning('Somente números, sem + ou traços'),
    }),

    // Fotos do lote
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    // Vídeos do lote (upload direto)
    defineField({
      name: 'videosArquivo',
      title: 'Vídeos (upload)',
      type: 'array',
      of: [{ type: 'file', options: { accept: 'video/*' } }],
    }),

    // Alternativa: links externos (YouTube, etc.)
    defineField({
      name: 'videosUrl',
      title: 'Vídeos (links externos)',
      type: 'array',
      of: [{ type: 'url' }],
    }),
  ],

  preview: {
    select: {
      title: 'titulo',
      media: 'fotos.0',
      categoriaLabel: 'categoriaRef.label',
      categoriaTitle: 'categoriaRef.title',
      categoriaLegacy: 'categoria',
    },
    prepare({ title, media, categoriaLabel, categoriaTitle, categoriaLegacy }) {
      const subtitle = categoriaLabel || categoriaTitle || categoriaLegacy || 'Sem categoria'
      return { title: title || 'Lote', media, subtitle }
    },
  },
})
