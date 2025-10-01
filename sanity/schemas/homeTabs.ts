import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homeTabs',
  title: 'Abas da Home',
  type: 'document',
  fields: [
    defineField({ name: 'ativo', title: 'Ativar bloco de abas?', type: 'boolean', initialValue: true }),
    defineField({ name: 'tituloComprar', title: 'Rótulo da aba (comprar)', type: 'string', initialValue: 'Quero comprar' }),
    defineField({ name: 'tituloVender', title: 'Rótulo da aba (vender)', type: 'string', initialValue: 'Quero vender' }),
    defineField({ name: 'placeholderLocal', title: 'Placeholder do campo de localização', type: 'string', initialValue: 'Digite sua localização' }),
    defineField({ name: 'botaoProcurar', title: 'Texto do botão', type: 'string', initialValue: 'Procurar' }),
  ],
})
