import { useEffect, useState } from "react";
import { DocumentationLoader } from "../services/DocumentationLoader";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../layouts/Header/Header";
import ContentRenderer from "../components/ContentRenderer";
import Sidebar from "../components/Sidebar";
import type { DocItem } from "../types/DocItem";
import type { Version } from "../types/Version";
import type { Category } from "../types/Category";
import type { Subcategory } from "../types/Subcategory";

const MainPage: React.FC = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [loading, setLoading] = useState({ versions: true, content: true });
  const [error, setError] = useState<{ versions?: string; content?: string }>({});
  const [items, setItems] = useState<DocItem[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory>>({});
  const [selectedItem, setSelectedItem] = useState<DocItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load versions
  useEffect(() => {
    const load = async () => {
      setLoading(prev => ({ ...prev, versions: true }));
      try {
        const versionsData = await DocumentationLoader.loadVersions();
        setVersions(versionsData);
        const defaultVersion = versionsData[0]?.version || "";
        setCurrentVersion(defaultVersion);
      } catch {
        setError(prev => ({ ...prev, versions: "Failed to load versions." }));
      } finally {
        setLoading(prev => ({ ...prev, versions: false }));
      }
    };
    load();
  }, []);

  // Load docs for current version
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

  // Filter by searchTerm
  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase();
    const inTitle = item.title.toLowerCase().includes(term);
    const inContent = item.content?.some(block => {
      if (block.type === "description" || block.type?.startsWith("title") || block.type === "quote") {
        return block.content.toLowerCase().includes(term);
      }
      if (block.type === "list") {
        return block.items?.some(i => i.toLowerCase().includes(term));
      }
      if (block.type === "code") {
        return block.content.toLowerCase().includes(term);
      }
      return false;
    });
    return inTitle || inContent;
  });

  if (error.versions) {
    return <ErrorMessage message={error.versions} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="flex flex-col min-h-screen border-gray-200 border-x-2">
      <Header
        versions={versions}
        currentVersion={currentVersion}
        onVersionChange={setCurrentVersion}
        loading={loading.versions}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="flex flex-1">
        {/* Sidebar only if not searching */}
        {!searchTerm && (
          <Sidebar
            items={items}
            categories={categories}
            subcategories={subcategories}
            onSelect={setSelectedItem}
            selectedItem={selectedItem}
          />
        )}

        <div className="flex-1 p-6 overflow-y-auto">
          {loading.content && <p className="text-gray-500">Loading content...</p>}
          {error.content && <ErrorMessage message={error.content} />}

          {/* Content search results */}
          {searchTerm && filteredItems.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h2>
              {filteredItems.map(item => {
                const matchSnippet = item.content?.find(block => {
                  if (
                    block.type === "description" ||
                    block.type?.startsWith("title") ||
                    block.type === "quote"
                  ) {
                    return block.content.toLowerCase().includes(searchTerm.toLowerCase());
                  }
                  if (block.type === "list") {
                    return block.items?.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
                  }
                  if (block.type === "code") {
                    return block.content.toLowerCase().includes(searchTerm.toLowerCase());
                  }
                  return false;
                });

                const previewText =
                  matchSnippet?.type === "list"
                    ? matchSnippet.items?.find(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
                    : matchSnippet?.content;

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow cursor-pointer"
                    onClick={() => {
                      setSelectedItem(item);
                      setSearchTerm(""); // exit search mode
                    }}
                  >
                    <h3 className="text-lg font-bold text-blue-600 hover:underline">
                      {item.title}
                    </h3>
                    {previewText && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">{previewText}</p>
                    )}
                  </div>
                );
              })}

            </div>
          )}

          {searchTerm && filteredItems.length === 0 && !loading.content && (
            <div className="text-gray-500 text-center mt-16">No matching documents found</div>
          )}

          {/* Full doc if selected and not searching */}
          {!searchTerm && selectedItem && (
            <ContentRenderer
              title={selectedItem.title}
              content={selectedItem.content}
              category={selectedItem.category?.title}
              subcategory={selectedItem.subcategory?.title}
            />
          )}

          {!searchTerm && !selectedItem && !loading.content && !error.content && (
            <div className="text-gray-500 text-center mt-16">Select a document from the sidebar</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
