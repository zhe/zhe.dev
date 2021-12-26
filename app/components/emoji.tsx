import React, { memo } from "react";
import twemoji from "twemoji";

const Emoji = ({
  emoji,
  className
}: {
  emoji: string | HTMLElement;
  className?: string;
}) => (
  <span
    className="inline-block mx-[.1em] h-[1.2em] w-[1.2em] align-[-0.2em]"
    dangerouslySetInnerHTML={{
      __html: twemoji.parse(emoji, {
        ext: ".svg",
        folder: "svg"
      }) as string
    }}
  />
);

export default memo(Emoji);
