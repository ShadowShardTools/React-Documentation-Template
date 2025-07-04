import type { Version } from '../types/entities/Version';
import type { Category } from '../types/entities/Category';
import type { Subcategory } from '../types/entities/Subcategory';
import type { DocItem } from '../types/entities/DocItem';

interface IndexJson {
  categories: string[];
  subcategories: string[];
  items: string[];
}

interface RawCategory extends Omit<Category, 'subcategories'> {
  subcategories: string[];
}

export class DocumentationLoader {
  private static baseUrl: string | null = null;

  private static getBaseUrl(): string {
    if (!this.baseUrl) {
      this.baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    }
    return this.baseUrl;
  }

  static async fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  static async loadVersions(): Promise<Version[]> {
    return this.fetchJson<Version[]>(`${this.getBaseUrl()}/data/versions.json`);
  }

  static async loadVersionData(version: string): Promise<{
    items: DocItem[];
    categories: Record<string, Category>;
    subcategories: Record<string, Subcategory>;
  }> {
    const basePath = `${this.getBaseUrl()}/data/${version}`;
    
    // Load index first
    const index = await this.fetchJson<IndexJson>(`${basePath}/index.json`);

    // Load all data in parallel with better error handling
    const [subcategoriesResult, categoriesResult, itemsResult] = await Promise.allSettled([
      this.loadSubcategories(basePath, index.subcategories),
      this.loadCategories(basePath, index.categories),
      this.loadItems(basePath, index.items)
    ]);

    const subcategories = subcategoriesResult.status === 'fulfilled' 
      ? subcategoriesResult.value 
      : {};
    
    const rawCategories = categoriesResult.status === 'fulfilled' 
      ? categoriesResult.value 
      : {};

    const items = itemsResult.status === 'fulfilled' 
      ? itemsResult.value 
      : [];

    // Build final categories with subcategory references
    const categories = this.buildCategories(rawCategories, subcategories);

    // Enhance items with category/subcategory references
    const enhancedItems = this.enhanceItems(items, categories, subcategories);

    return {
      items: enhancedItems,
      categories,
      subcategories,
    };
  }

  private static async loadSubcategories(
    basePath: string, 
    subcategoryIds: string[]
  ): Promise<Record<string, Subcategory>> {
    const results = await Promise.allSettled(
      subcategoryIds.map(id => 
        this.fetchJson<Subcategory>(`${basePath}/subcategories/${id}.json`)
          .then(data => ({ id, data }))
      )
    );

    const subcategories: Record<string, Subcategory> = {};
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        subcategories[result.value.id] = result.value.data;
      } else {
        console.warn(`Failed to load subcategory ${subcategoryIds[index]}:`, result.reason);
      }
    });

    return subcategories;
  }

  private static async loadCategories(
    basePath: string, 
    categoryIds: string[]
  ): Promise<Record<string, RawCategory>> {
    const results = await Promise.allSettled(
      categoryIds.map(id => 
        this.fetchJson<RawCategory>(`${basePath}/categories/${id}.json`)
          .then(data => ({ id, data }))
      )
    );

    const categories: Record<string, RawCategory> = {};
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        categories[result.value.id] = result.value.data;
      } else {
        console.warn(`Failed to load category ${categoryIds[index]}:`, result.reason);
      }
    });

    return categories;
  }

  private static async loadItems(
    basePath: string, 
    itemIds: string[]
  ): Promise<any[]> {
    const results = await Promise.allSettled(
      itemIds.map(id => 
        this.fetchJson<any>(`${basePath}/items/${id}.json`)
      )
    );

    const items: any[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        items.push(result.value);
      } else {
        console.warn(`Failed to load item ${itemIds[index]}:`, result.reason);
      }
    });

    return items;
  }

  private static buildCategories(
    rawCategories: Record<string, RawCategory>,
    subcategories: Record<string, Subcategory>
  ): Record<string, Category> {
    const categories: Record<string, Category> = {};

    Object.entries(rawCategories).forEach(([id, rawCategory]) => {
      categories[id] = {
        ...rawCategory,
        subcategories: rawCategory.subcategories
          .map(subId => subcategories[subId])
          .filter(Boolean)
      };
    });

    return categories;
  }

  private static enhanceItems(
    rawItems: any[],
    categories: Record<string, Category>,
    subcategories: Record<string, Subcategory>
  ): DocItem[] {
    return rawItems.map(rawItem => ({
      id: rawItem.id,
      title: rawItem.title,
      content: rawItem.content,
      tags: rawItem.tags || [],
      category: rawItem.category ? categories[rawItem.category] ?? null : null,
      subcategory: rawItem.subcategory ? subcategories[rawItem.subcategory] ?? null : null,
    }));
  }
}