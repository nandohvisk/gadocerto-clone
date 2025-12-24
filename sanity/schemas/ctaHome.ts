// sanity/schemas/ctaHome.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'ctaHome',
  title: 'CTA da Home',
  type: 'document',
  fields: [
    defineField({
      name: 'ativo',
      title: 'Ativo?',
      type: 'boolean',
      initialValue: true,
      description: 'Se desmarcado, o bloco CTA será ignorado (quando integrado).',
    }),
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (r) => r.required().min(3),
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'labelBotao',
      title: 'Texto do botão',
      type: 'string',
      initialValue: 'Ver Lotes Agora',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'linkBotao',
      title: 'Link do botão',
      type: 'string',
      initialValue: '/lotes',
      description: 'Pode ser /lotes, /contato ou uma URL completa.',
      validation: (r) => r.required(),
    }),
    // Campos opcionais de estilo (para o futuro)
    defineField({
      name: 'corFundo',
      title: 'Cor de fundo (hex)',
      type: 'string',
      placeholder: '#1f3a2d',
    }),
    defineField({
      name: 'corTexto',
      title: 'Cor do texto (hex)',
      type: 'string',
      placeholder: '#ffffff',
    }),
  ],
  preview: {
    select: {title: 'titulo', ativo: 'ativo'},
    prepare({title, ativo}) {
      return {
        title: title || 'CTA da Home',
        subtitle: ativo ? 'Ativo' : 'Inativo',
      }
    },
  },
})
