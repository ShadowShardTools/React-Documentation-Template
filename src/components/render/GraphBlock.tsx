import Desmos from "desmos";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Desmos: typeof Desmos;
  }
}

const GraphBlock: React.FC<{ index: number; graphExpressions: string[] }> = ({
  index,
  graphExpressions,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<Desmos.Calculator | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculator = Desmos.GraphingCalculator(container, {
      graphExpressions: true,
      keypad: true,
    });

    calculatorRef.current = calculator;

    graphExpressions.forEach((expr, index) => {
      calculator.setExpression({
        id: `expr-${index}`,
        latex: expr,
      });
    });

    return () => {
      calculatorRef.current?.destroy?.();
      calculatorRef.current = null;
    };
  }, [graphExpressions]);

  return (
    <div key={index} className="mb-6">
      <div
        ref={containerRef}
        role="img"
        aria-label="Interactive graph"
        className="w-full h-96 rounded border bg-white shadow-sm"
      />
    </div>
  );
};

export default GraphBlock;
