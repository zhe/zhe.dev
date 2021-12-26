import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import Emoji from "~/components/emoji";
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
      <div className="text-4xl font-extrabold mb-4">
        <p className="mb-2">Web Developer.</p>
        <hr className="border-t-2 border-neutral-100 rounded w-10 my-4" />
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
          <h2 className="font-bold mb-1">
            <Link to="notes">Notes</Link>
          </h2>
          <ul className="list-['>'] list-inside marker:text-sky-400">
            {notes.map((note) => (
              <li key={note._id}>
                <Link
                  to={`notes/${note.slug.current}`}
                  className="text-sky-800 hover:text-sky-700 mx-4 hover:underline active:translate-y-px"
                >
                  {note.title}
                </Link>
                <span className="text-neutral-200 text-sm">
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
