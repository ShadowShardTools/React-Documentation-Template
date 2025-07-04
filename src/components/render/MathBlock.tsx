import { useEffect, useState } from "react";

const MathBlock: React.FC<{ index: number, content: string }> = ({ index, content }) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    import("katex").then(katex => {
      if (isMounted) {
        try {
          const rendered = katex.renderToString(content, { throwOnError: false });
          setHtml(rendered);
        } catch (e) {
          setHtml(`<span class="text-red-500">Invalid LaTeX</span>`);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [content]);

  return (
    <div key={index} className="mb-6 text-center">
      <div
        className="text-gray-800 text-lg"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default MathBlock;
