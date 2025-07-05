import React from "react";

interface AudioBlockProps {
  audioSrc?: string;
  audioCaption?: string;
  audioMimeType?: string;
}

const AudioBlock: React.FC<AudioBlockProps> = ({
  audioSrc,
  audioCaption,
  audioMimeType,
}) => (
  <div className="mb-6">
    <audio controls className="w-full">
      <source src={audioSrc} type={audioMimeType || "audio/mpeg"} />
      Your browser does not support the audio element.
    </audio>
    {audioCaption && (
      <p className="text-sm text-gray-500 mt-2 text-center italic">
        {audioCaption}
      </p>
    )}
  </div>
);

export default AudioBlock;
