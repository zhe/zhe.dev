import type { LoaderFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";

type Note = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
};

export const loader: LoaderFunction = async ({ context }) => {
  const notes = await context.sanity.fetch(
    `*[_type == "note"]{ _id, title, slug, publishedAt } | order(publishedAt desc)`
  );

  return { notes };
};

export default function NotesPage() {
  let { notes } = useLoaderData<{ notes: Note[] }>();

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold">Notes</h1>
      <hr className="w-10 my-4 border-t-2 rounded border-neutral-100" />
      {notes?.length > 0 && (
        <>
          <ul className="list-['>'] list-inside marker:text-sky-400">
            {notes.map((note) => (
              <li key={note._id}>
                <Link
                  to={`${note.slug.current}`}
                  className="mx-4 text-sky-800 hover:text-sky-700 hover:underline active:translate-y-px"
                >
                  {note.title}
                </Link>
                <span className="text-sm text-neutral-300">
                  {format(parseISO(note.publishedAt), "yyyy-MM-dd")}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
