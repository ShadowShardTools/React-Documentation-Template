import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import type { ContentBlock } from "../../types/entities/ContentBlock";

// Register chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

interface Props {
  block: ContentBlock;
  index: number;
}

const ChartBlock: React.FC<Props> = ({ block }) => {
  if (!block.chartData) return null;

  const { title, labels, datasets } = block.chartData;

  return (
    <div className="my-8">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <Bar
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
        }}
      />
    </div>
  );
};

export default ChartBlock;
