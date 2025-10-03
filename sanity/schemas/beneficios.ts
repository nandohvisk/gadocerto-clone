// F:\gadoterragrande\gadocerto-clone\sanity\schemas\beneficios.ts
import { defineField, defineType } from "sanity";

const caixaFields = [
  defineField({
    name: "icone",
    title: "Ícone",
    type: "string",
    description: "Escolha um ícone para a caixa.",
    options: {
      list: [
        { title: "⭐ Estrela", value: "⭐" },
        { title: "📄 Documento", value: "📄" },
        { title: "📞 Telefone", value: "📞" },
        { title: "🐮 Gado", value: "🐮" },
        { title: "💬 Suporte", value: "💬" },
        { title: "📈 Negócios", value: "📈" },
      ],
      layout: "dropdown",
    },
    initialValue: "⭐",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "titulo",
    title: "Título",
    type: "string",
    validation: (Rule) => Rule.required().min(3),
  }),
  defineField({
    name: "descricao",
    title: "Descrição",
    type: "text",
    rows: 3,
    validation: (Rule) => Rule.required().min(10),
  }),
];

export default defineType({
  name: "beneficios",
  title: "Seção de Benefícios",
  type: "document",
  fields: [
    defineField({
      name: "tituloSuperior",
      title: "Título superior",
      type: "string",
      initialValue: "POR QUE A GADO TERRA GRANDE?",
    }),
    defineField({
      name: "subtitulo",
      title: "Subtítulo",
      type: "string",
      initialValue: "Negócio Feito com Confiança e Clareza.",
    }),

    // Três caixas fixas, editáveis inline (sem modal)
    defineField({
      name: "caixa1",
      title: "Caixa 1",
      type: "object",
      fields: caixaFields,
      options: { collapsible: true, collapsed: false },
      initialValue: {
        icone: "⭐",
        titulo: "Documentação Clara",
        descricao:
          "Todos os lotes com histórico, saúde e métricas detalhadas. Sem surpresas ou letras miúdas.",
      },
    }),
    defineField({
      name: "caixa2",
      title: "Caixa 2",
      type: "object",
      fields: caixaFields,
      options: { collapsible: true, collapsed: false },
      initialValue: {
        icone: "📈",
        titulo: "Melhores Negócios",
        descricao:
          "Conectamos diretamente vendedores e compradores, otimizando o preço e a qualidade da transação.",
      },
    }),
    defineField({
      name: "caixa3",
      title: "Caixa 3",
      type: "object",
      fields: caixaFields,
      options: { collapsible: true, collapsed: false },
      initialValue: {
        icone: "📞",
        titulo: "Suporte Dedicado",
        descricao:
          "Nossa equipe acompanha cada etapa, da seleção dos lotes até a logística final.",
      },
    }),
  ],
  preview: {
    select: { title: "tituloSuperior", subtitle: "subtitulo" },
  },
});
