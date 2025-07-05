import { useEffect, useState, useRef } from "react";
import { X, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";
import type { DocItem } from "../types/entities/DocItem";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  results: DocItem[];
  onSelect: (item: DocItem) => void;
}

const highlight = (text: string, term: string) =>
  text.replace(
    new RegExp(`(${term})`, "ig"),
    '<mark class="bg-yellow-200">$1</mark>',
  );

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  results,
  onSelect,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* --------------------------- focus management -------------------------- */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  /* ------------------------ keyboard navigation -------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect(results[selectedIndex]);
            onClose();
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, selectedIndex, results, onClose, onSelect]);

  /* Ensure selected index never exceeds results length */
  useEffect(() => {
    setSelectedIndex((idx) => Math.min(idx, Math.max(0, results.length - 1)));
  }, [results.length]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* search input */}
        <div className="flex items-center border-b px-4 py-2">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search documentation..."
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* results */}
        <div className="max-h-96 overflow-y-auto">
          {searchTerm ? (
            results.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">
                No results found
              </p>
            ) : (
              <ul>
                {results.map((item, i) => {
                  const lower = searchTerm.toLowerCase();
                  const matchBlock = item.content.find((block) => {
                    if (
                      ["description", "quote"].includes(block.type) ||
                      block.type.startsWith("title")
                    )
                      return block.content.toLowerCase().includes(lower);
                    if (block.type === "list")
                      return block.listItems?.some((li) =>
                        li.toLowerCase().includes(lower),
                      );
                    if (block.type === "code")
                      return block.content.toLowerCase().includes(lower);
                    return false;
                  });

                  const snippet =
                    matchBlock?.type === "list"
                      ? matchBlock.listItems?.find((li) =>
                          li.toLowerCase().includes(lower),
                        )
                      : matchBlock?.content;

                  return (
                    <li
                      key={item.id}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className={`px-4 py-3 cursor-pointer ${selectedIndex === i ? "bg-blue-50" : ""}`}
                    >
                      {/* title */}
                      <div
                        className="text-sm font-medium text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: highlight(item.title, searchTerm),
                        }}
                      />
                      {/* snippet */}
                      {snippet && (
                        <p
                          className="text-xs text-gray-500 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: highlight(snippet, searchTerm),
                          }}
                        />
                      )}
                      {/* tags */}
                      {item.tags?.length && (
                        <div className="text-[11px] text-gray-400 mt-0.5 italic truncate">
                          {item.tags.join(", ")}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">
              Start typing to search...
            </p>
          )}
        </div>

        {/* footer */}
        <div className="border-t px-4 py-2 text-xs text-gray-400 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-4 h-4" />
              <ArrowDown className="w-4 h-4" />
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-4 h-4" />
              to select
            </span>
          </div>
          <span>esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
