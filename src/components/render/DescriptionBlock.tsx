import React from "react";

const DescriptionBlock: React.FC<{ index: number; content: string }> = ({
  index,
  content,
}) => (
  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
    {content}
  </p>
);

export default DescriptionBlock;
