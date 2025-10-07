// F:\gadocerto-clone\gadocerto-clone\sanity\schemas\beneficiosHome.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "beneficiosHome",
  title: "Benefícios da Home",
  type: "document",
  fields: [
    defineField({
      name: "itens",
      title: "Benefícios exibidos (arraste para ordenar)",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "beneficio" }], // referencia documentos do tipo Benefício
          options: { disableNew: true },
        },
      ],
      options: {
        sortable: true, // permite arrastar e soltar
      },
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(6)
          .error("Selecione entre 1 e 6 benefícios."),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Benefícios da Home",
        subtitle: "Arraste para definir a ordem",
      };
    },
  },
});
