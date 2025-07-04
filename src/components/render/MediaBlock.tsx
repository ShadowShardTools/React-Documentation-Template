import React, { lazy } from 'react';

const CompareImage = lazy(() => import('react-compare-image'));

const Splide = lazy(() =>
  import('@splidejs/react-splide').then(m => ({ default: m.Splide }))
);
const SplideSlide = lazy(() =>
  import('@splidejs/react-splide').then(m => ({ default: m.SplideSlide }))
);

interface BaseProps {
  index: number;
  block: any;
}

const MediaBlock: React.FC<BaseProps> = ({ block, index }) => {
  switch (block.type) {
    case 'image':
      return (
        <div key={index} className="mb-6">
          <img
            src={block.imageSrc}
            alt={block.imageAlt || 'Image'}
            className="max-w-full h-auto rounded-lg border border-gray-200"
          />
          {block.imageAlt && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {block.imageAlt}
            </p>
          )}
        </div>
      );

    case 'image-compare':
      return (
        <div key={index} className="mb-6">
          <div className="flex gap-4">
            <div className="w-1/2">
              <img
                src={block.imageBeforeSrc}
                alt={block.imageBeforeAlt || 'Before'}
                className="w-full rounded border"
              />
              {block.imageBeforeAlt && (
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  {block.imageBeforeAlt}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <img
                src={block.imageAfterSrc}
                alt={block.imageAfterAlt || 'After'}
                className="w-full rounded border"
              />
              {block.imageAfterAlt && (
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  {block.imageAfterAlt}
                </p>
              )}
            </div>
          </div>
        </div>
      );

    case 'image-compare-slider':
      return (
        <div key={index} className="mb-6">
          <CompareImage
            leftImage={block.imageBeforeSrc || ''}
            rightImage={block.imageAfterSrc || ''}
            sliderLineColor="#3b82f6"
          />
        </div>
      );

    case 'image-carousel':
      return (
        <div key={index} className="mb-6">
          <Splide
            options={{ type: 'loop', gap: '1rem', arrows: true, pagination: true }}
          >
            {block.carouselImages?.map((img: any, i: number) => (
              <SplideSlide key={i}>
                <img
                  src={img.src}
                  alt={img.alt || `Image ${i + 1}`}
                  className="w-full rounded-lg border"
                />
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
              src={`https://www.youtube.com/embed/${block.youtubeVideoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg border"
            />
          </div>
        </div>
      );

    case 'audio':
      return (
        <div key={index} className="mb-6">
          <audio controls className="w-full">
            <source
              src={block.audioSrc}
              type={block.audioMimeType || 'audio/mpeg'}
            />
            Your browser does not support the audio element.
          </audio>
          {block.audioCaption && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {block.audioCaption}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
};

export default MediaBlock;
