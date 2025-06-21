import type { Subcategory } from "./Subcategory";

export interface Category {
  id: string;
  title: string;
  description?: string;
  subcategories: Subcategory[] | null;
}