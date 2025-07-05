import React from "react";

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

export default QuoteBlock;
