// ./sanity/lib/client.ts
import {createClient} from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'c3gva15q',
  dataset: 'production',
  apiVersion: '2025-01-01', // data “fixa”
  useCdn: true,
})
