import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { sanity } from "~/lib/sanity";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => ({
    ...context.env,
    sanity: sanity(context.env.SANITY_PROJECT_ID, context.env.SANITY_DATASET)
  })
});

export function onRequest(context) {
  return handleRequest(context);
}
