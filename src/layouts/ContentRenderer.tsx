import { useEffect } from "react";
import type { ContentBlock } from "../types/ContentBlock";
import ContentBlockRenderer from "./ContentBlockRenderer";

const ContentRenderer: React.FC<{
  content: ContentBlock[];
  title: string;
  category?: string;
  subcategory?: string;
}> = ({ content, title, category, subcategory }) => {
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.split('#')[2] || '');
    if (!hash) return;

    const el = document.getElementById(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [content]);

  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>

      {(category || subcategory) && (
        <div className="text-sm text-gray-500 mb-6">
          {category}
          {subcategory && ` > ${subcategory}`}
        </div>
      )}

      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} index={index} />
      ))}
    </div>
  );
};

export default ContentRenderer;