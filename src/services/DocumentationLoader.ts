import type { Version } from '../types/Version';
import type { Category } from '../types/Category';
import type { Subcategory } from '../types/Subcategory';
import type { DocItem } from '../types/DocItem';

interface IndexJson {
  categories: string[];
  subcategories: string[];
  items: string[];
}

export class DocumentationLoader {
  static async fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  }

  static async loadVersions(): Promise<Version[]> {
    return this.fetchJson<Version[]>('/data/versions.json');
  }

  static async loadVersionData(version: string): Promise<{
    items: DocItem[];
    categories: Record<string, Category>;
    subcategories: Record<string, Subcategory>;
  }> {
    const basePath = `/data/${version}`;
    const indexPath = `${basePath}/index.json`;

    let index: IndexJson;
    try {
      index = await this.fetchJson<IndexJson>(indexPath);
    } catch (error) {
      console.error("Failed to load index.json", error);
      throw error;
    }

    // Load subcategories
    const subcategories: Record<string, Subcategory> = {};
    for (const id of index.subcategories) {
      try {
        const subcategory = await this.fetchJson<Subcategory>(`${basePath}/subcategories/${id}.json`);
        subcategories[id] = subcategory;
      } catch (error) {
        console.warn(`Failed to load subcategory ${id}`, error);
      }
    }

    // Load categories
    const categories: Record<string, Category> = {};
    for (const id of index.categories) {
      try {
        const category = await this.fetchJson<Category>(`${basePath}/categories/${id}.json`);
        const subIds = category.subcategories as unknown as string[];
        category.subcategories = subIds
          .map(subId => subcategories[subId])
          .filter((s): s is Subcategory => !!s);

        categories[id] = category;

      } catch (error) {
        console.warn(`Failed to load category ${id}`, error);
      }
    }

    // Load items
    const docItems: DocItem[] = [];
    for (const id of index.items) {
      try {
        const rawItem = await this.fetchJson<any>(`${basePath}/items/${id}.json`);

        const category = rawItem.category && categories[rawItem.category];
        const subcategory = rawItem.subcategory && subcategories[rawItem.subcategory];

        const item: DocItem = {
          id: rawItem.id,
          title: rawItem.title,
          content: rawItem.content,
          tags: rawItem.tags,
          category: category ?? null,
          subcategory: subcategory ?? null,
        };

        docItems.push(item);
      } catch (error) {
        console.warn(`Failed to load item ${id}`, error);
      }
    }

    return {
      items: docItems,
      categories,
      subcategories,
    };
  }
}
