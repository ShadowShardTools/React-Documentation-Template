import { useEffect, lazy, Suspense } from "react";
import type { ContentBlock } from "../types/entities/ContentBlock";
import ContentBlockRenderer from "./ContentBlockRenderer";

const TextBlock = lazy(() => import('../components/render/TextBlock'));
const MediaBlock = lazy(() => import('../components/render/MediaBlock'));
const CodeBlock = lazy(() => import("../components/render/CodeBlock"));
const MathBlock = lazy(() => import("../components/render/MathBlock"));
const GraphBlock = lazy(() => import("../components/render/GraphBlock"));
const UnknownBlock = lazy(() => import('../components/render/UnknownBlock'));

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
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
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
      <Suspense fallback={<p className="text-gray-400">Loading block...</p>}>
        {content.map((block, index) => (
          <ContentBlockRenderer
            key={index}
            block={block}
            index={index}
            TextBlock={TextBlock}
            MediaBlock={MediaBlock}
            CodeBlock={CodeBlock}
            MathBlock={MathBlock}
            GraphBlock={GraphBlock}
            UnknownBlock={UnknownBlock}
          />
        ))}
      </Suspense>
    </div>
  );
};

export default ContentRenderer;
