// src/components/DynamicKatex.tsx
import { useEffect, useState } from "react";

const DynamicKatex: React.FC<{ content: string }> = ({ content }) => {
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
    <div
      className="text-gray-800 text-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default DynamicKatex;
