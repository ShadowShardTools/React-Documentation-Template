import type { Category } from "../entities/Category";
import type { DocItem } from "../entities/DocItem";
import type { Subcategory } from "../entities/Subcategory";

export interface NavigationProps {
  items: DocItem[];
  categories: Record<string, Category>;
  subcategories: Record<string, Subcategory>;
  onSelect: (item: DocItem) => void;
  selectedItem?: DocItem | null;
  visible?: boolean;
  onMobileClose?: () => void;
}