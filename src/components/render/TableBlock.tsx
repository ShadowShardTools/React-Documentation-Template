import React from "react";

const TableBlock: React.FC<{
  index: number;
  tableHeaders?: string[];
  tableRows?: string[][];
}> = ({ index, tableHeaders, tableRows }) => (
  <div key={index} className="mb-6 overflow-x-auto">
    <table className="min-w-full border border-gray-300 rounded-lg">
      {tableHeaders && (
        <thead className="bg-gray-50">
          <tr>
            {tableHeaders.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left font-medium text-gray-700 border-b border-gray-300 border-r last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {tableRows?.map((row, r) => (
          <tr key={r} className="border-b border-gray-200 last:border-b-0">
            {row.map((cell, c) => (
              <td
                key={c}
                className="px-4 py-2 text-gray-600 border-r border-gray-300 last:border-r-0"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableBlock;
