import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { sanity } from "~/lib/sanity";

type Note = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
};

export const loader: LoaderFunction = async ({ context }) => {
  const notes = await sanity(
    context.SANITY_PROJECT_ID,
    context.SANITY_DATASET
  ).fetch(
    `*[_type == "note"]{ _id, title, slug, publishedAt } | order(publishedAt desc)`
  );

  return { notes };
};

export default function HomePage() {
  let { notes } = useLoaderData<{ notes: Note[] }>();

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-4">Notes</h1>
      <hr className="border-t-2 border-neutral-100 rounded w-10 my-4" />
      {notes?.length > 0 && (
        <>
          <ul className="list-['>'] list-inside marker:text-sky-400">
            {notes.map((note) => (
              <li key={note._id}>
                <Link
                  to={`${note.slug.current}`}
                  className="text-sky-800 hover:text-sky-700 mx-4 hover:underline active:translate-y-px"
                >
                  {note.title}
                </Link>
                <span className="text-neutral-300 text-sm">
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
