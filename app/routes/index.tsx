import type { LoaderFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import Emoji from "~/components/emoji";

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

export default function HomePage() {
  let { notes } = useLoaderData<{ notes: Note[] }>();

  return (
    <div>
      <div className="mb-4 text-4xl font-extrabold">
        <p className="mb-2">Web Developer.</p>
        <hr className="w-10 my-4 border-t-2 rounded border-neutral-100" />
        <p>
          I love to help
          <br /> people and business
          <br /> create opportunities
          <br /> and solve problems
          <br /> with ideas <Emoji emoji="💡" />,<br />
          pixels <Emoji emoji="💎" />,<br />
          codes <Emoji emoji="👨‍💻" /> and
          <br />
          technologies <Emoji emoji="🚀" />.
        </p>
      </div>
      {notes?.length > 0 && (
        <>
          <h2 className="mb-1 font-bold">
            <Link to="notes">Notes</Link>
          </h2>
          <ul className="list-['>'] list-inside marker:text-sky-400">
            {notes.map((note) => (
              <li key={note._id}>
                <Link
                  to={`notes/${note.slug.current}`}
                  className="mx-4 text-sky-800 hover:text-sky-700 hover:underline active:translate-y-px"
                >
                  {note.title}
                </Link>
                <span className="text-sm text-neutral-200">
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
