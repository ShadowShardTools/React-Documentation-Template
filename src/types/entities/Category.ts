import type { DocItem } from "./DocItem";

export interface Category {
  id: string;
  title: string;
  description?: string;
  docs?: DocItem[];
  children?: Category[];
}
