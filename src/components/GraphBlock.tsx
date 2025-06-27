// @ts-ignore
import Desmos from 'desmos';
import { useEffect, useRef } from 'react';

const GraphBlock: React.FC<{ expressions: string[] }> = ({ expressions }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculator = Desmos.GraphingCalculator(containerRef.current, {
      expressions: true,
      keypad: true,
    });

    calculatorRef.current = calculator;

    expressions.forEach((expr, index) => {
      calculator.setExpression({
        id: `expr-${index}`,
        latex: expr
      });
    });

    return () => calculator.destroy();
  }, [expressions]);

  return <div ref={containerRef} className="w-full h-96 rounded border" />;
};

export default GraphBlock;