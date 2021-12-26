import sanityClient from "@sanity/client";
import type { LoaderFunction } from "remix";

// Standard client for fetching data

// // Authenticated client for fetching draft documents
// export const previewClient = new PicoSanity({
// 	...config,
// 	useCdn: false,
// 	token: process.env.SANITY_API_TOKEN ?? ``,
// });

// Helper function to choose the correct client
export const sanity = (
  projectId: string,
  dataset: string,
  usePreview = false
) => {
  let config = {
    projectId,
    dataset,
    apiVersion: "2021-03-25", // use current UTC date - see "specifying API version"!
    token: "", // or leave blank for unauthenticated usage
    useCdn: false // `false` if you want to ensure fresh data
  };

  return sanityClient(config);
};

// (usePreview ? sanityClient({ ...config, projectId, dataset }) : client);
