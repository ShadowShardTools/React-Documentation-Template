import React from "react";

interface ImageCompareBlockProps {
  imageBeforeSrc: string;
  imageBeforeAlt?: string;
  imageAfterSrc: string;
  imageAfterAlt?: string;
}

const ImageCompareBlock: React.FC<ImageCompareBlockProps> = ({
  imageBeforeSrc,
  imageBeforeAlt,
  imageAfterSrc,
  imageAfterAlt,
}) => (
  <div className="mb-6 flex gap-4">
    <div className="w-1/2">
      <img
        src={imageBeforeSrc}
        alt={imageBeforeAlt || "Before"}
        className="w-full rounded border"
      />
      {imageBeforeAlt && (
        <p className="text-sm text-gray-500 mt-2 text-center italic">
          {imageBeforeAlt}
        </p>
      )}
    </div>
    <div className="w-1/2">
      <img
        src={imageAfterSrc}
        alt={imageAfterAlt || "After"}
        className="w-full rounded border"
      />
      {imageAfterAlt && (
        <p className="text-sm text-gray-500 mt-2 text-center italic">
          {imageAfterAlt}
        </p>
      )}
    </div>
  </div>
);

export default ImageCompareBlock;
