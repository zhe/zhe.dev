import BlockContent from "@sanity/block-content-to-react";
import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { sanity } from "~/lib/sanity";

export const loader: LoaderFunction = async ({ params, context }) => {
  // Query for _all_ documents with this slug
  // There could be two: Draft and Published!
  const note = await sanity(
    context.SANITY_PROJECT_ID,
    context.SANITY_DATASET
  ).fetch(
    `*[_type == "note" && slug.current == $slug][0]{title, body, 'authorName': author->name, 'authorImage': author->image}`,
    {
      slug: params.slug
    }
  );

  return { note };
};

export default function Movie() {
  let { note } = useLoaderData();

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">{note.title}</h1>
      <hr className="border-t-2 border-neutral-100 rounded w-10 my-4" />
      <article className="prose prose-neutral dark:prose-invert">
        <BlockContent blocks={note.body} />
      </article>
    </div>
  );
}
