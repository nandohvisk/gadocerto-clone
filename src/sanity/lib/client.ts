<<<<<<< HEAD
// F:\gadocerto-clone\src\sanity\lib\client.ts
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export default client;
export { client };            // compatibilidade
export const sanityClient = client; // compatibilidade
=======
import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // c3gva15q (vem do .env)
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-10-01",
  useCdn: true,
});
>>>>>>> origin/main
