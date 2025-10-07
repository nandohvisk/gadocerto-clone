// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\beneficio.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "beneficio",
  title: "Benefício",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "cor",
      title: "Tema de cor",
      type: "string",
      options: {
        list: [
          { title: "Campo (Verde)", value: "campo" },
          { title: "Trigo (Âmbar)", value: "trigo" },
          { title: "Céu (Azul/Ciano)", value: "ceu" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "campo",
    }),
    defineField({
      name: "order",
      title: "Ordem de exibição",
      type: "number",
      description: "Define a sequência em que os cartões aparecem.",
    }),
  ],
});
