import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Nome', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'tipo',
      title: 'Disponível em',
      type: 'string',
      options: { list: [
        {title: 'Quero comprar', value: 'comprar'},
        {title: 'Quero vender', value: 'vender'},
        {title: 'Ambos', value: 'ambos'},
      ]},
      initialValue: 'ambos',
    }),
    defineField({ name: 'slug', title: 'Slug (opcional)', type: 'slug', options: { source: 'title' } }),
  ],
})
