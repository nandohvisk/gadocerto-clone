// ./src/sanity/lib/live.ts
// Habilita o Live Content API da Sanity para o Next.js
import { defineLive } from "next-sanity/live";
import { sanityClient as client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
});
