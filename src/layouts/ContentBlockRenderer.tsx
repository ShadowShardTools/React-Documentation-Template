import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import '../generated/prism-languages.generated';
import { Link as LinkIcon, Copy } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { ContentBlockRendererProps } from '../types/props/ContentBlockRendererProps';
import DynamicKatex from '../components/DynamicKatex';

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

const renderHeading = (
  index: number,
  level: 'h1' | 'h2' | 'h3',
  content: string,
  className: string,
  currentPath: string
) => {
  const id = slugify(content);
  const Tag = level;

  return (
    <Tag
      key={index}
      id={id}
      className={`${className} scroll-mt-20 group relative`}
      data-anchor-id={id}
    >
      {content}
      <a
        href={`#${currentPath}#${id}`}
        className="ml-2 inline-block text-gray-400 hover:text-blue-500"
        aria-label="Anchor link"
        onClick={(e) => {
          e.preventDefault();
          window.history.replaceState(null, '', `#${currentPath}#${id}`);
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        <LinkIcon className="w-4 h-4" />
      </a>
    </Tag>
  );
};

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  block, index, GraphBlock, CompareImage, Splide, SplideSlide
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // PrismJS syntax highlighting (static language imports only)
  useEffect(() => {
    if (block.type !== 'code' || !codeRef.current) return;
    const lang = block.language || 'text';
    const grammar = Prism.languages[lang] || Prism.languages.plaintext;
    codeRef.current.innerHTML = Prism.highlight(block.content, grammar, lang);
  }, [block]);

  switch (block.type) {
    case 'title-h1':
      return renderHeading(index, 'h1', block.content, 'text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0', currentPath);

    case 'title-h2':
      return renderHeading(index, 'h2', block.content, 'text-2xl font-semibold text-gray-800 mb-4 mt-8 first:mt-0', currentPath);

    case 'title-h3':
      return renderHeading(index, 'h3', block.content, 'text-xl font-medium text-gray-700 mb-3 mt-6 first:mt-0', currentPath);

    case 'description':
      return (
        <p key={index} className="text-gray-600 mb-4 leading-relaxed">
          {block.content}
        </p>
      );

    case 'code':
      return (
        <div key={index} className="relative mb-6 overflow-hidden rounded-md">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 text-white text-xs font-mono border-b">
            <span className="text-gray-300">{block.scriptName}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(block.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={`language-${block.language || 'text'} !m-0 !rounded-none !p-4 overflow-x-auto text-sm w-full`}>
            <code
              ref={codeRef}
              className={`language-${block.language || 'text'} break-words whitespace-pre`}
            />
          </pre>
          {block.language && (
            <div className="text-xs text-gray-400 mt-1 text-right">
              {block.language}
            </div>
          )}
        </div>
      );

    case 'math':
  return (
    <div key={index} className="mb-6 text-center">
      <DynamicKatex content={block.content} />
    </div>
  );

    case 'graph':
      return (
        <div key={index} className="mb-6">
          <GraphBlock expressions={block.graphExpressions || []} />
        </div>
      );

    case 'list':
      return (
        <ul key={index} className="list-disc list-inside text-gray-600 mb-4 space-y-1">
          {block.items?.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      );

    case 'table':
      return (
        <div key={index} className="mb-6 overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            {block.headers && (
              <thead className="bg-gray-50">
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th key={headerIndex} className="px-4 py-2 text-left font-medium text-gray-700 border-b border-gray-300 border-r last:border-r-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows?.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 text-gray-600 border-r border-gray-300 last:border-r-0">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'image':
      return (
        <div key={index} className="mb-6">
          <img
            src={block.src}
            alt={block.alt || 'Image'}
            className="max-w-full h-auto rounded-lg border border-gray-200"
          />
          {block.alt && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {block.alt}
            </p>
          )}
        </div>
      );

    case 'image-compare':
      return (
        <div key={index} className="mb-6">
          <div className="flex gap-4">
            <div className="w-1/2">
              <img src={block.before} alt="Before" className="w-full rounded border" />
              <p className="text-center text-sm text-gray-500 mt-1">Before</p>
            </div>
            <div className="w-1/2">
              <img src={block.after} alt="After" className="w-full rounded border" />
              <p className="text-center text-sm text-gray-500 mt-1">After</p>
            </div>
          </div>
        </div>
      );

    case 'image-compare-slider':
      return (
        <div key={index} className="mb-6">
          <CompareImage
            leftImage={block.before || ''}
            rightImage={block.after || ''}
            sliderLineColor="#3b82f6"
          />
        </div>
      );

    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 rounded-r-lg">
          <p className="text-gray-700 italic">{block.content}</p>
        </blockquote>
      );

    case 'carousel':
      return (
        <div key={index} className="mb-6">
          <Splide options={{ type: 'loop', gap: '1rem', arrows: true, pagination: true }}>
            {block.images?.map((img, idx) => (
              <SplideSlide key={idx}>
                <img src={img.src} alt={img.alt || `Image ${idx + 1}`} className="w-full rounded-lg border" />
              </SplideSlide>
            ))}
          </Splide>
        </div>
      );

    case 'youtube':
      return (
        <div key={index} className="mb-6">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${block.videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg border"
            />
          </div>
        </div>
      );

    case 'sound':
      return (
        <div key={index} className="mb-6">
          <audio controls className="w-full">
            <source src={block.src} type={block.mimeType || 'audio/mpeg'} />
            Your browser does not support the audio element.
          </audio>
          {block.caption && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {block.caption}
            </p>
          )}
        </div>
      );

    default:
      return (
        <div key={index} className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">Unknown content type: {block.type}</p>
        </div>
      );
  }
};

export default ContentBlockRenderer;
