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
