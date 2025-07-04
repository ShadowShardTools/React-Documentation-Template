import React from 'react';
import { LinkIcon } from 'lucide-react';

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

type HeadingLevel = 'h1' | 'h2' | 'h3';

interface BaseProps {
  index: number;
  block: any;
  currentPath: string;
}

const Heading: React.FC<{
  level: HeadingLevel;
  index: number;
  content: string;
  currentPath: string;
}> = ({ level, index, content, currentPath }) => {
  const id = slugify(content);
  const Tag = level;
  const cls: Record<HeadingLevel, string> = {
    h1: 'text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0',
    h2: 'text-2xl font-semibold text-gray-800 mb-4 mt-8 first:mt-0',
    h3: 'text-xl font-medium text-gray-700 mb-3 mt-6 first:mt-0',
  };

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
        onClick={e => {
          e.preventDefault();
          window.history.replaceState(null, '', `#${currentPath}#${id}`);
          document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }}
      >
        <LinkIcon className="w-4 h-4" />
      </a>
    </Tag>
  );
};

const Description: React.FC<{ index: number; content: string }> = ({
  index,
  content,
}) => (
  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
    {content}
  </p>
);

const ListBlock: React.FC<{ index: number; items?: string[] }> = ({
  index,
  items,
}) => (
  <ul
    key={index}
    className="list-disc list-inside text-gray-600 mb-4 space-y-1"
  >
    {items?.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const QuoteBlock: React.FC<{ index: number; content: string }> = ({
  index,
  content,
}) => (
  <blockquote
    key={index}
    className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 rounded-r-lg"
  >
    <p className="text-gray-700 italic">{content}</p>
  </blockquote>
);

const TableBlock: React.FC<{
  index: number;
  headers?: string[];
  rows?: string[][];
}> = ({ index, headers, rows }) => (
  <div key={index} className="mb-6 overflow-x-auto">
    <table className="min-w-full border border-gray-300 rounded-lg">
      {headers && (
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left font-medium text-gray-700 border-b border-gray-300 border-r last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows?.map((row, r) => (
          <tr key={r} className="border-b border-gray-200 last:border-b-0">
            {row.map((cell, c) => (
              <td
                key={c}
                className="px-4 py-2 text-gray-600 border-r border-gray-300 last:border-r-0"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ---------- Default lazy-loaded wrapper ---------- */

const TextBlock: React.FC<BaseProps> = ({ block, index, currentPath }) => {
  switch (block.type) {
    case 'title-h1':
    case 'title-h2':
    case 'title-h3':
      return (
        <Heading
          level={block.type.replace('title-', '') as HeadingLevel}
          index={index}
          content={block.content}
          currentPath={currentPath}
        />
      );

    case 'description':
      return <Description index={index} content={block.content} />;

    case 'list':
      return <ListBlock index={index} items={block.listItems} />;

    case 'quote':
      return <QuoteBlock index={index} content={block.content} />;

    case 'table':
      return (
        <TableBlock
          index={index}
          headers={block.tableHeaders}
          rows={block.tableRows}
        />
      );

    default:
      return null;
  }
};

export default TextBlock;