import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { DocumentationLoader } from "../services/DocumentationLoader";
import ContentRenderer from "../components/ContentRenderer";
import type { DocItem } from "../types/DocItem";
import type { Category } from "../types/Category";
import type { Subcategory } from "../types/Subcategory";

const PrintPage: React.FC = () => {
  const [items, setItems] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory>>({});
  const { version: routeVersion } = useParams();

  useEffect(() => {
  const load = async () => {
    const versions = await DocumentationLoader.loadVersions();
    const selectedVersion = routeVersion || versions[0]?.version;
    const foundVersion = versions.find(v => v.version === selectedVersion);

    if (!foundVersion) {
      console.error("Version not found:", selectedVersion);
      return;
    }

    const data = await DocumentationLoader.loadVersionData(foundVersion.version);
    setItems(data.items);
    setCategories(data.categories);
    setSubcategories(data.subcategories);
  };
  load();
}, [routeVersion]);


  useEffect(() => {
    if (items.length > 0) {
      setTimeout(() => window.print(), 500);
    }
  }, [items]);

  const categoryMap: Record<string, Record<string, DocItem[]>> = {};
  const standaloneItems: DocItem[] = [];

  for (const item of items) {
    const catId = item.category?.id;
    const subId = item.subcategory?.id;

    if (!catId || !categories[catId]) {
      standaloneItems.push(item);
    } else {
      if (!categoryMap[catId]) categoryMap[catId] = {};
      const groupKey = subId && subcategories[subId] ? subId : "_no_sub";
      if (!categoryMap[catId][groupKey]) categoryMap[catId][groupKey] = [];
      categoryMap[catId][groupKey].push(item);
    }
  }

  return (
    <div className="p-6 space-y-12 print-all">
      {/* Standalone items first (General section) */}
      {standaloneItems.map((item) => (
        <div key={item.id} className="break-after-page">
          <ContentRenderer
            title={item.title}
            content={item.content}
            category={item.category?.title}
            subcategory={item.subcategory?.title}
          />
        </div>
      ))}

      {/* Grouped by category and subcategory */}
      {Object.values(categories).map((cat) => {
        const subGroups = categoryMap[cat.id];
        if (!subGroups) return null;

        return (
          <div key={cat.id}>
            {/* Items without subcategory */}
            {subGroups["_no_sub"]?.map((item) => (
              <div key={item.id} className="break-after-page">
                <ContentRenderer
                  title={item.title}
                  content={item.content}
                  category={cat.title}
                />
              </div>
            ))}

            {/* Subcategories */}
            {(cat.subcategories || []).map((sub) => {
              if (!subGroups[sub.id]) return null;

              return subGroups[sub.id].map((item) => (
                <div key={item.id} className="break-after-page">
                  <ContentRenderer
                    title={item.title}
                    content={item.content}
                    category={cat.title}
                    subcategory={sub.title}
                  />
                </div>
              ));
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PrintPage;
