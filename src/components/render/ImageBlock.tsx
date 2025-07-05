import React from "react";

interface ImageBlockProps {
  imageSrc: string;
  imageAlt?: string;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ imageSrc, imageAlt }) => (
  <div className="mb-6">
    <img
      src={imageSrc}
      alt={imageAlt || "Image"}
      className="max-w-full h-auto rounded-lg border border-gray-200"
    />
    {imageAlt && (
      <p className="text-sm text-gray-500 mt-2 text-center italic">
        {imageAlt}
      </p>
    )}
  </div>
);

export default ImageBlock;
