// ./sanity/schemas/lote.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'lote',
  title: 'Lote',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: r => r.required() }),
    defineField({ name: 'categoria', title: 'Categoria', type: 'string' }),
    defineField({ name: 'raca', title: 'Raça', type: 'string' }),
    defineField({ name: 'idadeMeses', title: 'Idade (meses)', type: 'number' }),
    defineField({ name: 'pesoMedioKg', title: 'Peso médio (kg)', type: 'number' }),
    defineField({ name: 'cabecas', title: 'Cabeças', type: 'number' }),
    defineField({ name: 'municipio', title: 'Município', type: 'string' }),
    defineField({ name: 'uf', title: 'UF', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (somente dígitos, com DDI)', type: 'string' }),

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
    select: { title: 'titulo', media: 'fotos.0' },
  },
})
