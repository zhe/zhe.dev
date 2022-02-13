import { Cloudinary, Transformation } from "@cloudinary/url-gen";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { minimumPad } from "@cloudinary/url-gen/actions/resize";
import { center, east, west } from "@cloudinary/url-gen/qualifiers/compass";
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
    `*[_type == "note" && slug.current == $slug][0]{title, body, publishedAt, _updatedAt, 'authorName': author->name, 'authorImage': author->image, mainImage}`,
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
    .image(builder.image(note.mainImage.asset).width(640).height(640).url())
    .setDeliveryType("fetch");

  ogImage
    .resize(minimumPad().width(1280).height(640).gravity(compass(east())))
    .overlay(
      source(
        image(
          "v1642323117/zhe.dev/zhe-dev-og-image-template_phybdz.png"
        ).transformation(new Transformation())
      ).position(
        new Position().gravity(compass(center())).offsetX(0).offsetY(0)
      )
    )
    .addTransformation(
      // see: https://github.com/cloudinary/js-url-gen/issues/430#issuecomment-913222894
      `w_510,c_fit,${source(
        text(
          note.title,
          new TextStyle("Roboto", 56).fontWeight("black")
        ).textColor("white")
      )
        .position(new Position().gravity(compass(west())).offsetX(105))
        .toString()}`
    )
    .format("png");

  return { note: note, ogImageUrl: ogImage.toURL() };
};

export const meta: MetaFunction = ({ data, params }) => {
  return {
    "og:title": data.note.title,
    "og:url": `https://zhe.dev/notes/${params.slug}`,
    "og:article:published_time": data.note.publishedAt,
    "og:article:modified_time": data.note._updatedAt,
    "og:article:author": "zhe",
    "og:image": data.ogImageUrl,
    "og:image:type": "image/jpeg",
    "og:image:width": "1280",
    "og:image:height": "640",
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
      <div className="prose-sm prose prose-p:text-neutral-500 prose-a:text-neutral-500 prose-neutral">
        <BlockContent blocks={note.mainImage.caption} />
      </div>
      <article className="prose prose-neutral dark:prose-invert">
        <BlockContent blocks={note.body} />
      </article>
    </div>
  );
}
