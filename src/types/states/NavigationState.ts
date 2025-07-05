import type { DocItem } from "../entities/DocItem";

export type NavigationState = Record<
  string, // categoryId
  Record<string, DocItem[]> // subcategoryId → DocItem[]
>;
