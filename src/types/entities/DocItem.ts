import type { Category } from "./Category";
import type { ContentBlock } from "./ContentBlock";
import type { Subcategory } from "./Subcategory";

export interface DocItem {
  id: string;
  title: string;
  category: Category | null;
  subcategory: Subcategory | null;
  content: ContentBlock[];
  tags?: string[];
}