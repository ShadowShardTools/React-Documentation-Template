import React from "react";

interface YoutubeBlockProps {
  youtubeVideoId: string;
}

const YoutubeBlock: React.FC<YoutubeBlockProps> = ({ youtubeVideoId }) => (
  <div className="mb-6">
    <div className="aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg border"
      />
    </div>
  </div>
);

export default YoutubeBlock;
