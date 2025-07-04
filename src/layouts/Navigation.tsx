import { useEffect, useState, useRef } from "react";
import {
    ChevronRight,
    ChevronDown,
    FileText,
    Folder,
    Search,
} from "lucide-react";
import type { NavigationProps } from "../types/props/NavigationProps";
import type { DocItem } from "../types/entities/DocItem";
import SidebarNavigationHints from "../components/dialog/SidebarNavigationHints";

const Navigation: React.FC<NavigationProps> = ({
    items,
    categories,
    subcategories,
    onSelect,
    selectedItem,
    visible,
    onMobileClose,
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});
    const [filter, setFilter] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    const flatFocusableListRef = useRef<
        { ref: HTMLElement | null; entry: { type: string; id?: string; item?: DocItem } }[]
    >([]);
    const filterInputRef = useRef<HTMLInputElement>(null);

    const toggleCategory = (id: string) =>
        setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));

    const toggleSubcategory = (id: string) =>
        setExpandedSubcategories((prev) => ({ ...prev, [id]: !prev[id] }));

    const isSelected = (item: DocItem) => selectedItem?.id === item.id;
    const filterText = filter.toLowerCase();

    const categoryMap: Record<string, Record<string, DocItem[]>> = {};
    const standaloneItems: DocItem[] = [];

    for (const item of items) {
        if (!item.title.toLowerCase().includes(filterText)) continue;

        const catId = item.category?.id;
        const subId = item.subcategory?.id;

        if (!catId || !categories[catId]) {
            standaloneItems.push(item);
        } else {
            if (!categoryMap[catId]) categoryMap[catId] = {};
            const groupKey = subId && subcategories[subId] ? subId : "_no_sub";
            if (!categoryMap[catId][groupKey]) categoryMap[catId][groupKey] = [];
            categoryMap[catId][groupKey].push(item);
        }
    }

    // Reset and collect focusable items each render
    flatFocusableListRef.current = [];

    useEffect(() => {
        const list = flatFocusableListRef.current;
        if (selectedIndex >= list.length) {
            setSelectedIndex(Math.max(0, list.length - 1));
        }
    }, [filter, expandedCategories, expandedSubcategories]);

    useEffect(() => {
        const handleGlobalKey = (e: KeyboardEvent) => {
            const active = document.activeElement;
            const isInput = active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";
            const list = flatFocusableListRef.current;

            if (e.code === "KeyF" && !isInput) {
                e.preventDefault();
                filterInputRef.current?.focus();
                return;
            }

            if (e.key === "Escape" && active === filterInputRef.current) {
                e.preventDefault();
                filterInputRef.current?.blur();
                return;
            }

            if (!visible || isInput) return;

            const maxIndex = list.length - 1;
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const next = Math.min(prev + 1, maxIndex);
                    list[next]?.ref?.focus();
                    return next;
                });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => {
                    const next = Math.max(prev - 1, 0);
                    list[next]?.ref?.focus();
                    return next;
                });
            } else if (e.key === "Enter") {
                e.preventDefault();
                const target = list[selectedIndex]?.entry;
                if (!target) return;
                if (target.type === 'doc' && target.item) {
                    onSelect(target.item);
                } else if (target.type === 'category' && target.id) {
                    toggleCategory(target.id);
                } else if (target.type === 'subcategory' && target.id) {
                    toggleSubcategory(target.id);
                }
            }
        };

        window.addEventListener("keydown", handleGlobalKey);
        return () => window.removeEventListener("keydown", handleGlobalKey);
    }, [selectedIndex, visible, onSelect, onMobileClose]);

    return (
        <>
            <div className="mb-2 relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                    ref={filterInputRef}
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Enter here to filter..."
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded bg-white pointer-events-none">F</kbd>
            </div>
            <SidebarNavigationHints className="mb-4" />

            <nav className="space-y-4">
                {standaloneItems.length > 0 && (
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">General</h2>
                        <ul className="space-y-1">
                            {standaloneItems.map((item) => (
                                <li
                                    key={item.id}
                                    tabIndex={0}
                                    ref={(el) => {
                                        if (el) {
                                            flatFocusableListRef.current.push({ ref: el, entry: { type: 'doc', item } });
                                        }
                                    }}
                                    className={`flex items-center gap-2 cursor-pointer px-2 py-1 ${isSelected(item)
                                        ? "bg-blue-100 text-blue-700 font-semibold border-l-2 border-blue-500"
                                        : "text-gray-700 hover:text-blue-600"}`}
                                    onClick={() => onSelect(item)}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {Object.values(categories).map((category) => {
                    const subGroups = categoryMap[category.id];
                    if (!subGroups) return null;

                    return (
                        <div key={category.id}>
                            <button
                                tabIndex={0}
                                ref={(el) => {
                                    if (el) {
                                        flatFocusableListRef.current.push({ ref: el, entry: { type: 'category', id: category.id } });
                                    }
                                }}
                                className="flex items-center justify-between w-full text-left text-gray-800 font-medium hover:text-blue-600 px-2 py-1"
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4" />
                                    <span>{category.title}</span>
                                </div>
                                {expandedCategories[category.id] ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>

                            {expandedCategories[category.id] && (
                                <div className="ml-5 mt-2 space-y-2">
                                    {subGroups["_no_sub"]?.map((item) => (
                                        <li
                                            key={item.id}
                                            tabIndex={0}
                                            ref={(el) => {
                                                if (el) {
                                                    flatFocusableListRef.current.push({ ref: el, entry: { type: 'doc', item } });
                                                }
                                            }}
                                            className={`flex items-center gap-2 cursor-pointer px-2 py-1 ${isSelected(item)
                                                ? "bg-blue-100 text-blue-700 font-semibold border-l-2 border-blue-500"
                                                : "text-gray-600 hover:text-blue-600"}`}
                                            onClick={() => onSelect(item)}
                                        >
                                            <FileText className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </li>
                                    ))}

                                    {(category.subcategories || []).map((sub) => {
                                        if (!sub || !subGroups[sub.id]) return null;
                                        return (
                                            <div key={sub.id}>
                                                <button
                                                    tabIndex={0}
                                                    ref={(el) => {
                                                        if (el) {
                                                            flatFocusableListRef.current.push({ ref: el, entry: { type: 'subcategory', id: sub.id } });
                                                        }
                                                    }}
                                                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600 px-2 py-1"
                                                    onClick={() => toggleSubcategory(sub.id)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Folder className="w-4 h-4" />
                                                        <span>{sub.title}</span>
                                                    </div>
                                                    {expandedSubcategories[sub.id] ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </button>

                                                {expandedSubcategories[sub.id] && (
                                                    <ul className="ml-4 mt-1 space-y-1">
                                                        {subGroups[sub.id].map((item) => (
                                                            <li
                                                                key={item.id}
                                                                tabIndex={0}
                                                                ref={(el) => {
                                                                    if (el) {
                                                                        flatFocusableListRef.current.push({ ref: el, entry: { type: 'doc', item } });
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-2 cursor-pointer px-2 py-1 ${isSelected(item)
                                                                    ? "bg-blue-100 text-blue-700 font-semibold border-l-2 border-blue-500"
                                                                    : "text-gray-600 hover:text-blue-600"}`}
                                                                onClick={() => onSelect(item)}
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                                <span>{item.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </>
    );
};

export default Navigation;