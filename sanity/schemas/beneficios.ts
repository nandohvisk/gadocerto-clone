import { defineField, defineType } from "sanity";

export default defineType({
  name: "beneficios",
  title: "Seção de Benefícios",
  type: "document",
  fields: [
    defineField({
      name: "tituloSuperior",
      title: "Título Superior",
      type: "string",
      initialValue: "POR QUE A GADO TERRA GRANDE?",
    }),
    defineField({
      name: "subtitulo",
      title: "Subtítulo",
      type: "string",
      initialValue: "Negócio Feito com Confiança e Clareza.",
    }),
    defineField({
      name: "caixas",
      title: "Caixas de Benefícios",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icone", title: "Ícone (emoji ou nome)", type: "string" },
            { name: "titulo", title: "Título", type: "string" },
            { name: "descricao", title: "Descrição", type: "text" },
          ],
        },
      ],
    }),
  ],
});
