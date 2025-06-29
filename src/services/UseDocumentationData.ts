import { useEffect, useState } from "react";
import type { Version } from "../types/Version";
import type { Category } from "../types/Category";
import type { Subcategory } from "../types/Subcategory";
import type { DocItem } from "../types/DocItem";
import { DocumentationLoader } from "./DocumentationLoader";

export function UseDocumentationData() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState("");
  const [items, setItems] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory>>({});
  const [loading, setLoading] = useState({ versions: true, content: true });
  const [error, setError] = useState<{ versions?: string; content?: string }>({});

  // Load available versions
  useEffect(() => {
    (async () => {
      try {
        const versionList = await DocumentationLoader.loadVersions();
        setVersions(versionList);
        setCurrentVersion(versionList[0]?.version || "");
      } catch {
        setError(err => ({ ...err, versions: "Failed to load versions." }));
      } finally {
        setLoading(prev => ({ ...prev, versions: false }));
      }
    })();
  }, []);

  // Load content for selected version
  useEffect(() => {
    if (!currentVersion) return;

    (async () => {
      setLoading(prev => ({ ...prev, content: true }));
      try {
        const data = await DocumentationLoader.loadVersionData(currentVersion);
        setItems(data.items);
        setCategories(data.categories);
        setSubcategories(data.subcategories);
      } catch {
        setError(err => ({ ...err, content: "Failed to load documentation content." }));
      } finally {
        setLoading(prev => ({ ...prev, content: false }));
      }
    })();
  }, [currentVersion]);

  return {
    versions,
    currentVersion,
    setCurrentVersion,
    items,
    categories,
    subcategories,
    loading,
    error
  };
}