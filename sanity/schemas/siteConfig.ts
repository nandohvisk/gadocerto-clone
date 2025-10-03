// sanity/schemas/siteConfig.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteConfig",
  title: "Configurações do Site",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", title: "Título do site", type: "string" }),

    defineField({
      name: "tema",
      title: "Tema padrão",
      type: "string",
      options: { list: ["claro", "escuro"] },
    }),

    defineField({ name: "corPrimaria", title: "Cor primária (hex)", type: "string" }),
    defineField({ name: "corFundo", title: "Cor de fundo (hex)", type: "string" }),
    defineField({ name: "corTexto", title: "Cor do texto (hex)", type: "string" }),

    // ---- HERO ----
    defineField({ name: "heroTitulo", title: "Título do Hero", type: "string" }),
    defineField({ name: "heroDescricao", title: "Descrição do Hero", type: "text" }),

    defineField({
      name: "heroVideo",
      title: "Vídeo do Hero",
      type: "file",
      options: { accept: "video/*" }, // mp4/webm/ogg
      description: "Vídeo exibido no fundo do Hero.",
    }),

    defineField({
      name: "heroImage",
      title: "Imagem do Hero (poster/fallback)",
      type: "image",
      options: { hotspot: true },
      description: "Imagem usada como poster do vídeo e fallback.",
    }),

    defineField({
      name: "usarVideoNoHero",
      title: "Usar vídeo no Hero?",
      type: "boolean",
      initialValue: true,
    }),
    // ---------------

    defineField({
      name: "whatsappGeral",
      title: "WhatsApp (DDI + DDD + número)",
      type: "string",
      description: "Ex.: +5565998765432",
    }),

    defineField({
      name: "menu",
      title: "Menu",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Rótulo", type: "string" },
            { name: "href", title: "Link", type: "string" },
          ],
        },
      ],
    }),
  ],
});
