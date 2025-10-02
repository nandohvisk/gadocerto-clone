// F:\gadoterragrande\gadocerto-clone\sanity\schemas\lead.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'lead',
  title: 'Cadastros',
  type: 'document',
  fields: [
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          {title: 'Cliente', value: 'cliente'},
          {title: 'Vendedor', value: 'vendedor'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'cliente',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nomeCompleto',
      title: 'Nome completo',
      type: 'string',
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: 'nomeFazenda',
      title: 'Nome da fazenda',
      type: 'string',
    }),
    defineField({
      name: 'telefone',
      title: 'Celular (WhatsApp)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Criado em',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'nomeCompleto',
      subtitle: 'telefone',
      tipo: 'tipo',
    },
    prepare({title, subtitle, tipo}) {
      return {
        title: title || 'Sem nome',
        subtitle: `${tipo ?? '—'} · ${subtitle ?? ''}`,
      }
    },
  },
})
