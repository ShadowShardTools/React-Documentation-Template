import type { DocItem } from "./DocItem";

export type NavigationState = Record<
  string, // categoryId
  Record<string, DocItem[]> // subcategoryId → DocItem[]
>;