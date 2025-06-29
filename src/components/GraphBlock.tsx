import Desmos from 'desmos';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Desmos: typeof Desmos;
  }
}

const GraphBlock: React.FC<{ expressions: string[] }> = ({ expressions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<Desmos.Calculator | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculator = Desmos.GraphingCalculator(container, {
      expressions: true,
      keypad: true,
    });

    calculatorRef.current = calculator;

    expressions.forEach((expr, index) => {
      calculator.setExpression({
        id: `expr-${index}`,
        latex: expr,
      });
    });

    return () => {
      calculatorRef.current?.destroy?.();
      calculatorRef.current = null;
    };
  }, [expressions]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive graph"
      className="w-full h-96 rounded border bg-white shadow-sm"
    />
  );
};

export default GraphBlock;
