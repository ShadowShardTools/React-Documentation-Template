import React from "react";
import type { Category } from "../types/entities/Category";
import type { DocItem } from "../types/entities/DocItem";
import Navigation from "./Navigation";

export interface SidebarProps {
  tree: Category[];
  standaloneDocs?: DocItem[];
  onSelect: (doc: DocItem) => void;
  selectedItem?: DocItem | null;
  isSearchOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  tree,
  standaloneDocs = [],
  onSelect,
  selectedItem,
  isSearchOpen = false,
}) => (
  <aside className="hidden md:block fixed md:sticky top-16 bottom-0 md:top-16 md:h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-gray-200 p-4 overflow-y-auto custom-scrollbar bg-white z-40">
    <Navigation
      tree={tree}
      standaloneDocs={standaloneDocs}
      onSelect={onSelect}
      selectedItem={selectedItem}
      isSearchOpen={isSearchOpen}
    />
  </aside>
);

export default Sidebar;
