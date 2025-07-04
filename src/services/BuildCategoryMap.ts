import type { Category } from "../types/entities/Category";
import type { DocItem } from "../types/entities/DocItem";
import type { Subcategory } from "../types/entities/Subcategory";

export default function BuildCategoryMap(
  items: DocItem[],
  categories: Record<string, Category>,
  subcategories: Record<string, Subcategory>,
  filter: string
) {
  const filterText = filter.toLowerCase();
  const categoryMap: Record<string, Record<string, DocItem[]>> = {};
  const standaloneItems: DocItem[] = [];

  for (const item of items) {
    if (!item.title.toLowerCase().includes(filterText)) continue;

    const catId = item.category?.id;
    const subId = item.subcategory?.id;

    if (!catId || !categories[catId]) {
      standaloneItems.push(item);
      continue;
    }

    if (!categoryMap[catId]) categoryMap[catId] = {};
    const key = subId && subcategories[subId] ? subId : "_no_sub";
    if (!categoryMap[catId][key]) categoryMap[catId][key] = [];
    categoryMap[catId][key].push(item);
  }

  return { categoryMap, standaloneItems };
}
