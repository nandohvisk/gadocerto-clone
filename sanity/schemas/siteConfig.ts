// ./sanity/schemas/siteConfig.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteConfig',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({ name: 'siteTitle', title: 'Título do Site', type: 'string', validation: r => r.required() }),

    // Tema/Cores
    defineField({
      name: 'tema',
      title: 'Tema',
      type: 'string',
      options: { list: ['claro', 'escuro'] },
      initialValue: 'claro',
    }),
    defineField({ name: 'corPrimaria', title: 'Cor Primária (hex)', type: 'string', initialValue: '#111111' }),
    defineField({ name: 'corFundo', title: 'Cor de Fundo (hex)', type: 'string', initialValue: '#ffffff' }),
    defineField({ name: 'corTexto', title: 'Cor de Texto (hex)', type: 'string', initialValue: '#111111' }),

    // Herói (vídeo OU imagem)
    defineField({
      name: 'usarVideoNoHero',
      title: 'Usar Vídeo no Herói?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'heroVideoArquivo',
      title: 'Vídeo do Herói (upload)',
      type: 'file',
      options: { accept: 'video/*' },
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Vídeo do Herói (URL externa)',
      type: 'url',
      description: 'Opcional. Use se quiser embutir de CDN/YouTube/etc.',
    }),
    defineField({
      name: 'heroImagem',
      title: 'Imagem do Herói',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroTitulo',
      title: 'Título do Herói',
      type: 'string',
      initialValue: 'Compra e venda de gado, do jeito simples.',
    }),
    defineField({
      name: 'heroDescricao',
      title: 'Descrição do Herói',
      type: 'text',
      rows: 3,
      initialValue: 'Encontre lotes com informações claras de idade, peso, raça e localização. Fale direto pelo WhatsApp.',
    }),

    // CTA / Navegação / Contatos
    defineField({ name: 'whatsappGeral', title: 'WhatsApp Geral', type: 'string' }),
    defineField({ name: 'emailContato', title: 'E-mail de Contato', type: 'string' }),
    defineField({
      name: 'menu',
      title: 'Menu (links)',
      type: 'array',
      of: [{ type: 'object', fields: [
        { name: 'label', title: 'Rótulo', type: 'string' },
        { name: 'href', title: 'URL', type: 'string' },
      ]}],
      initialValue: [
        { label: 'Lotes', href: '/lotes' },
        { label: 'Canal de Ética', href: '/etica' },
        { label: 'Termos', href: '/termos' },
        { label: 'Contato', href: '/contato' },
      ],
    }),
  ],
  // faça um único doc desse tipo (singleton)
  
})
