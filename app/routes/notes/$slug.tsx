import { Cloudinary, Transformation } from "@cloudinary/url-gen";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { minimumPad } from "@cloudinary/url-gen/actions/resize";
import { center, southEast } from "@cloudinary/url-gen/qualifiers/compass";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { image, text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import BlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import type { LoaderFunction, MetaFunction } from "remix";
import { useLoaderData } from "remix";
import { sanity } from "~/lib/sanity";

export const loader: LoaderFunction = async ({ params, context }) => {
  const note = await sanity(
    context.SANITY_PROJECT_ID,
    context.SANITY_DATASET
  ).fetch(
    `*[_type == "note" && slug.current == $slug][0]{title, body, 'authorName': author->name, 'authorImage': author->image, mainImage}`,
    {
      slug: params.slug
    }
  );

  const builder = imageUrlBuilder(
    sanity(context.SANITY_PROJECT_ID, context.SANITY_DATASET)
  );

  note.mainImage.url = builder
    .image(note.mainImage.asset)
    .width(1024)
    .height(630)
    .url();

  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: "dtmm06f5p"
    }
  });

  // cloudinary.image returns a CloudinaryImage with the configuration set.
  const ogImage = cloudinary
    .image(builder.image(note.mainImage.asset).width(400).height(400).url())
    .setDeliveryType("fetch");

  ogImage
    .resize(minimumPad().width(1200).height(630).gravity(compass(southEast())))
    .overlay(
      source(
        image(
          "v1642323117/zhe.dev/zhe-dev-og-image-template_kv4nhj.png"
        ).transformation(new Transformation())
      ).position(
        new Position().gravity(compass(center())).offsetX(0).offsetY(0)
      )
    )
    .overlay(
      source(
        text(
          note.title,
          new TextStyle("Roboto", 56).fontWeight("black")
        ).textColor("white")
      ).position(new Position().gravity(compass(center())))
    )
    .format("png");

  return { note: note, ogImageUrl: ogImage.toURL() };
};

export const meta: MetaFunction = ({ data }) => {
  return {
    "twitter:image": data.ogImageUrl,
    "twitter:card": "summary_large_image",
    "twitter:creator": "@zhzhng",
    "twitter:site": "@zhzhng",
    "twitter:title": data.note.title
  };
};

export default function Movie() {
  let { note } = useLoaderData();

  return (
    <div>
      <h1 className="mb-4 text-4xl font-extrabold">{note.title}</h1>
      <hr className="w-10 my-4 border-t-2 rounded border-neutral-100" />
      <img
        src={note.mainImage.url}
        alt="Note's Main Image"
        className="mb-4 rounded-lg"
      />
      <article className="prose prose-neutral dark:prose-invert">
        <BlockContent blocks={note.body} />
      </article>
    </div>
  );
}
