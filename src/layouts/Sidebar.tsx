import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  FileText,
  Folder,
  Search,
} from "lucide-react";
import type { SidebarProps } from "../types/SidebarProps";
import type { DocItem } from "../types/DocItem";

const Sidebar: React.FC<SidebarProps> = ({
  items,
  categories,
  subcategories,
  onSelect,
  selectedItem,
  initiallyVisible = true,
}) => {
  const [visible, setVisible] = useState(initiallyVisible);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("");

  const toggleCategory = (id: string) =>
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSubcategory = (id: string) =>
    setExpandedSubcategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const isSelected = (item: DocItem) => selectedItem?.id === item.id;
  const filterText = filter.toLowerCase();

  // Organize items by category & subcategory
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setVisible(true);
      }
    };

    // Initial check
    handleResize(mediaQuery);

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <>
      {/* Sidebar */}
      {visible && (
        <aside className={`
          ${visible ? "fixed md:sticky" : "hidden md:block"}
          top-16 bottom-0 md:top-16 md:h-[calc(100vh-4rem)]
          w-64 shrink-0 border-r border-gray-200 p-4 overflow-y-auto custom-scrollbar bg-white z-40
        `}>
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Enter here to filter"
              className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <nav className="space-y-4">
            {/* Standalone Items */}
            {standaloneItems.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">General</h2>
                <ul className="space-y-1">
                  {standaloneItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${isSelected(item)
                        ? "bg-blue-100 text-blue-700 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                        }`}
                      onClick={() => onSelect(item)}
                    >
                      <FileText className="w-4 h-4" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categories */}
            {Object.values(categories).map((category) => {
              const subGroups = categoryMap[category.id];
              if (!subGroups) return null;

              return (
                <div key={category.id}>
                  <button
                    className="flex items-center justify-between w-full text-left text-gray-800 font-medium hover:text-blue-600"
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
                      {/* Items without subcategory */}
                      {subGroups["_no_sub"]?.length > 0 && (
                        <ul className="space-y-1">
                          {subGroups["_no_sub"].map((item) => (
                            <li
                              key={item.id}
                              className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${isSelected(item)
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                              onClick={() => onSelect(item)}
                            >
                              <FileText className="w-4 h-4" />
                              <span>{item.title}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Subcategories */}
                      {(category.subcategories || []).map((sub) => {
                        if (!sub || !subGroups[sub.id]) return null;

                        return (
                          <div key={sub.id}>
                            <button
                              className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600"
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
                                    className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${isSelected(item)
                                      ? "bg-blue-100 text-blue-700 font-semibold"
                                      : "text-gray-600 hover:text-blue-600"
                                      }`}
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
        </aside>
      )}

      {/* Toggle button pinned to right of sidebar */}
      <button
        className={`fixed z-10 w-6 bg-slate-300 hover:bg-white border-x border-gray-500 md:hidden
        ${visible
            ? "left-64 top-16 h-[calc(100vh-4rem)]"
            : "left-0 top-1/2 -translate-y-1/2 h-12 rounded-r-md shadow border"
          }`}
        onClick={() => setVisible(!visible)}
        aria-label="Toggle Sidebar"
      >
        {visible ? <ChevronLeft className="mx-auto" /> : <ChevronRight className="mx-auto" />}
      </button>
    </>
  );
};

export default Sidebar;
