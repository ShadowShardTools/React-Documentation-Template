import { useEffect, useState } from "react";
import type { Category } from "../types/Category";
import type { DocItem } from "../types/DocItem";
import type { Subcategory } from "../types/Subcategory";
import type { Version } from "../types/Version";
import { DocumentationLoader } from "./DocumentationLoader";

export function UseDocumentationData() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [loading, setLoading] = useState({ versions: true, content: true });
  const [error, setError] = useState<{ versions?: string; content?: string }>({});
  const [items, setItems] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory>>({});

  useEffect(() => {
    const loadVersions = async () => {
      setLoading(prev => ({ ...prev, versions: true }));
      try {
        const versionsData = await DocumentationLoader.loadVersions();
        setVersions(versionsData);
        setCurrentVersion(versionsData[0]?.version || "");
      } catch {
        setError(prev => ({ ...prev, versions: "Failed to load versions." }));
      } finally {
        setLoading(prev => ({ ...prev, versions: false }));
      }
    };
    loadVersions();
  }, []);

  useEffect(() => {
    if (!currentVersion) return;

    const loadContent = async () => {
      setLoading(prev => ({ ...prev, content: true }));
      try {
        const data = await DocumentationLoader.loadVersionData(currentVersion);
        setItems(data.items);
        setCategories(data.categories);
        setSubcategories(data.subcategories);
      } catch {
        setError(prev => ({ ...prev, content: "Failed to load documentation content." }));
      } finally {
        setLoading(prev => ({ ...prev, content: false }));
      }
    };
    loadContent();
  }, [currentVersion]);

  return {
    versions, currentVersion, setCurrentVersion,
    items, categories, subcategories,
    loading, error
  };
}
