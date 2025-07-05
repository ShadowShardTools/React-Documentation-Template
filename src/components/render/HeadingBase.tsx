// src/components/render/headings/HeadingBase.tsx
import { LinkIcon } from "lucide-react";
import React from "react";

type Level = "h1" | "h2" | "h3";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const cls: Record<Level, string> = {
  h1: "text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0",
  h2: "text-2xl font-semibold text-gray-800 mb-4 mt-8 first:mt-0",
  h3: "text-xl font-medium text-gray-700 mb-3 mt-6 first:mt-0",
};

interface Props {
  level: Level;
  index: number;
  content: string;
  currentPath: string;
}

const HeadingBase: React.FC<Props> = ({
  level,
  index,
  content,
  currentPath,
}) => {
  const id = slugify(content);
  const Tag = level;

  return (
    <Tag
      key={index}
      id={id}
      className={`${cls[level]} scroll-mt-20 group relative`}
      data-anchor-id={id}
    >
      {content}
      <a
        href={`#${currentPath}#${id}`}
        className="ml-2 inline-block text-gray-400 hover:text-blue-500"
        aria-label="Anchor link"
        onClick={(e) => {
          e.preventDefault();
          window.history.replaceState(null, "", `#${currentPath}#${id}`);
          document
            .getElementById(id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        <LinkIcon className="w-4 h-4" />
      </a>
    </Tag>
  );
};

export default HeadingBase;
