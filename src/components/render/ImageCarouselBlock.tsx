import React, { lazy, Suspense } from "react";

const Splide = lazy(() =>
  import("@splidejs/react-splide").then((m) => ({ default: m.Splide })),
);
const SplideSlide = lazy(() =>
  import("@splidejs/react-splide").then((m) => ({ default: m.SplideSlide })),
);

interface CarouselImage {
  src: string;
  alt?: string;
}

interface ImageCarouselBlockProps {
  carouselImages: CarouselImage[];
}

const ImageCarouselBlock: React.FC<ImageCarouselBlockProps> = ({
  carouselImages,
}) => (
  <div className="mb-6">
    <Suspense fallback={<div>Loading…</div>}>
      <Splide
        options={{ type: "loop", gap: "1rem", arrows: true, pagination: true }}
      >
        {carouselImages.map((img, i) => (
          <SplideSlide key={i}>
            <img
              src={img.src}
              alt={img.alt || `Image ${i + 1}`}
              className="w-full rounded-lg border"
            />
          </SplideSlide>
        ))}
      </Splide>
    </Suspense>
  </div>
);

export default ImageCarouselBlock;
