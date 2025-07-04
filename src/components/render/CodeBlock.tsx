import { useEffect, useRef, useState } from "react";
import { Copy } from "lucide-react";

const CodeBlock: React.FC<{ index: number, content: string, language?: string, scriptName?: string }> = ({ index, content, language = "text", scriptName }) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const highlight = async () => {
      const Prism = await import("prismjs");
      await import("prismjs/themes/prism-okaidia.css");
      await import("../../generated/prism-languages.generated");

      const grammar = Prism.languages[language] || Prism.languages.plaintext;
      if (isMounted && codeRef.current) {
        codeRef.current.innerHTML = Prism.highlight(content, grammar, language);
      }
    };

    highlight();
    return () => {
      isMounted = false;
    };
  }, [language, content]);

  return (
    <div key={index} className="relative mb-6 overflow-hidden rounded-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 text-white text-xs font-mono border-b">
        <span className="text-gray-300">{scriptName}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
        >
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className={`language-${language} !m-0 !rounded-none !p-4 overflow-x-auto text-sm w-full`}>
        <code
          ref={codeRef}
          className={`language-${language} break-words whitespace-pre`}
        />
      </pre>
      {language && (
        <div className="text-xs text-gray-400 mt-1 text-right">
          {language}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
