import React from "react";

const ListBlock: React.FC<{ index: number; items?: string[] }> = ({
  index,
  items,
}) => (
  <ul
    key={index}
    className="list-disc list-inside text-gray-600 mb-4 space-y-1"
  >
    {items?.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export default ListBlock;
