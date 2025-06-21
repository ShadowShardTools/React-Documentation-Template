import 'prismjs';
import 'prismjs/themes/prism-okaidia.css';

import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-json';

import Prism from 'prismjs';
import type { ContentBlock } from '../types/ContentBlock';
import CompareImage from 'react-compare-image';
import { Splide, SplideSlide } from '@splidejs/react-splide';

const ContentBlockRenderer: React.FC<{ block: ContentBlock; index: number }> = ({ block, index }) => {
  switch (block.type) {
    case 'title-h1':
      return (
        <h1 key={index} className="text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
          {block.content}
        </h1>
      );

    case 'title-h2':
      return (
        <h2 key={index} className="text-2xl font-semibold text-gray-800 mb-4 mt-8 first:mt-0">
          {block.content}
        </h2>
      );

    case 'title-h3':
      return (
        <h3 key={index} className="text-xl font-medium text-gray-700 mb-3 mt-6 first:mt-0">
          {block.content}
        </h3>
      );

    case 'description':
      return (
        <p key={index} className="text-gray-600 mb-4 leading-relaxed">
          {block.content}
        </p>
      );

    case 'code':
      return (
        <div key={index} className="mb-6 overflow-hidden">
          <pre className="language-${block.language || 'text'} bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code
              className={`language-${block.language || 'text'}`}
              ref={el => {
                if (el) {
                  el.innerHTML = Prism.highlight(block.content, Prism.languages[block.language || 'text'] || Prism.languages.plaintext, block.language || 'text');
                }
              }}
            />
          </pre>
          {block.language && (
            <div className="text-xs text-gray-400 mt-1 text-right">
              {block.language}
            </div>
          )}
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
                    <th key={headerIndex} className="px-4 py-2 text-left font-medium text-gray-700 border-b border-gray-300">
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
                    <td key={cellIndex} className="px-4 py-2 text-gray-600">
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
            {block.images?.map((img: { src: string; alt?: string }, idx: number) => (
              <SplideSlide key={idx}>
                <img src={img.src} alt={img.alt || `Image ${idx + 1}`} className="w-full rounded-lg border" />
              </SplideSlide>
            ))}
          </Splide>
        </div>
      );

    case 'youtube':
      return (
        <div key={index} className="mb-6 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${block.videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg border"
          ></iframe>
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
