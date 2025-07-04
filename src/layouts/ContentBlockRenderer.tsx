import { useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import type { ContentBlockRendererProps } from '../types/props/ContentBlockRendererProps';

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block,
  index,
  TextBlock,
  MediaBlock,
  CodeBlock,
  MathBlock,
  GraphBlock,
  UnknownBlock,
}) => {
  const { pathname } = useLocation();

  /* ---- text-type blocks --------------------------------------- */
  if (
    [
      'title-h1',
      'title-h2',
      'title-h3',
      'description',
      'list',
      'quote',
      'table',
    ].includes(block.type)
  ) {
    return (
      <Suspense fallback={null}>
        <TextBlock index={index} block={block} currentPath={pathname} />
      </Suspense>
    );
  }

  /* ---- media-type blocks -------------------------------------- */
  if (
    [
      'image',
      'image-compare',
      'image-compare-slider',
      'image-carousel',
      'youtube',
      'audio',
    ].includes(block.type)
  ) {
    return (
      <Suspense fallback={null}>
        <MediaBlock index={index} block={block} />
      </Suspense>
    );
  }

  /* ---- the rest (already components) -------------------------- */
  switch (block.type) {
    case 'code':
      return (
        <CodeBlock
          index={index}
          content={block.content}
          language={block.language}
          scriptName={block.scriptName}
        />
      );

    case 'math':
      return <MathBlock index={index} content={block.content} />;

    case 'graph':
      return (
        <GraphBlock
          index={index}
          expressions={block.graphExpressions || []}
        />
      );

    default:
      return (
        <Suspense fallback={null}>
          <UnknownBlock index={index} type={block.type} />
        </Suspense>
      );
  }
};

export default ContentBlockRenderer;
