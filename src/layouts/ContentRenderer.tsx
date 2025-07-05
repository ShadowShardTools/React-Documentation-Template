import { useEffect } from "react";
import type { ContentBlock } from "../types/entities/ContentBlock";
import ContentBlockRenderer from "./ContentBlockRenderer";

interface Props {
  content: ContentBlock[];
  title: string;
  category?: string;
  subcategory?: string;
}

const ContentRenderer: React.FC<Props> = ({
  content,
  title,
  category,
  subcategory,
}) => {
  /* scroll to hash on mount / content change */
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.split("#")[2] || "");
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [content]);

  /* currentPath = part before #anchor */
  const currentPath = location.hash.split("#")[1] || location.pathname.slice(1);

  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

      {(category || subcategory) && (
        <div className="text-sm text-gray-500 mb-6">
          {category}
          {subcategory && ` > ${subcategory}`}
        </div>
      )}

      <ContentBlockRenderer content={content} currentPath={currentPath} />
    </div>
  );
};

export default ContentRenderer;
