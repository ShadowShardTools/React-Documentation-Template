import React, { lazy, Suspense } from "react";

const CompareImage = lazy(() => import("react-compare-image"));

interface ImageCompareSliderBlockProps {
  imageBeforeSrc: string;
  imageAfterSrc: string;
}

const ImageCompareSliderBlock: React.FC<ImageCompareSliderBlockProps> = ({
  imageBeforeSrc,
  imageAfterSrc,
}) => (
  <div className="mb-6">
    <Suspense fallback={<div>Loading…</div>}>
      <CompareImage
        leftImage={imageBeforeSrc}
        rightImage={imageAfterSrc}
        sliderLineColor="#3b82f6"
      />
    </Suspense>
  </div>
);

export default ImageCompareSliderBlock;
