import type { DocItem } from "./DocItem";
import type { Category } from "./Category";
import type { Subcategory } from "./Subcategory";

export interface SidebarProps {
  items: DocItem[];
  categories: Record<string, Category>;
  subcategories: Record<string, Subcategory>;
  onSelect: (item: DocItem) => void;
  selectedItem?: DocItem | null;
}