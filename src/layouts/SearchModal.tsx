import { useEffect, useState, useRef } from "react";
import { X, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";
import type { SearchModalProps } from "../types/props/SearchModalProps";

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

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (results[selectedIndex]) {
                    onSelect(results[selectedIndex]);
                    onClose();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, selectedIndex, results]);

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

                <div className="max-h-96 overflow-y-auto">
                    {searchTerm ? (
                        results.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-6">No results found</p>
                        ) : (
                            <ul>
                                {results.map((item, i) => (
                                    <li
                                        key={item.id}
                                        onClick={() => {
                                            onSelect(item);
                                            onClose();
                                        }}
                                        className={`px-4 py-3 cursor-pointer ${selectedIndex === i ? "bg-blue-50" : ""
                                            }`}
                                    >
                                        <div
                                            className="text-sm font-medium text-gray-800"
                                            dangerouslySetInnerHTML={{
                                                __html: item.title.replace(
                                                    new RegExp(`(${searchTerm})`, "ig"),
                                                    '<mark class="bg-yellow-200">$1</mark>'
                                                ),
                                            }}
                                        />

                                        {/* Snippet only if user typed */}
                                        {(() => {
                                            const lower = searchTerm.toLowerCase();
                                            const match = item.content?.find((block) => {
                                                if (
                                                    ["description", "quote"].includes(block.type) ||
                                                    block.type?.startsWith("title")
                                                ) {
                                                    return block.content.toLowerCase().includes(lower);
                                                }
                                                if (block.type === "list") {
                                                    return block.listItems?.some((i) => i.toLowerCase().includes(lower));
                                                }
                                                if (block.type === "code") {
                                                    return block.content.toLowerCase().includes(lower);
                                                }
                                                return false;
                                            });

                                            const snippet =
                                                match?.type === "list"
                                                    ? match.listItems?.find((i) => i.toLowerCase().includes(lower))
                                                    : match?.content;

                                            return snippet ? (
                                                <p
                                                    className="text-xs text-gray-500 mt-1 line-clamp-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: snippet.replace(
                                                            new RegExp(`(${searchTerm})`, "ig"),
                                                            '<mark class="bg-yellow-200">$1</mark>'
                                                        ),
                                                    }}
                                                />
                                            ) : null;
                                        })()}

                                        <div className="text-[11px] text-gray-400 mt-0.5 italic">
                                            {item.category?.title || "General"}
                                            {item.subcategory?.title ? ` › ${item.subcategory.title}` : ""}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-6">Start typing to search...</p>
                    )}
                </div>

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
