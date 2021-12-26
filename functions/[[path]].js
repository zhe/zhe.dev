import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";

// @ts-ignore
import * as build from "../build";

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext(context) {
    return {
      SANITY_PROJECT_ID: context.env.SANITY_PROJECT_ID,
      SANITY_DATASET: context.env.SANITY_DATASET
    };
  }
});

export function onRequest(context) {
  return handleRequest(context);
}
