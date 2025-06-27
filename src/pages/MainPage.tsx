import { useEffect, useState } from "react";
import ContentRenderer from "../layouts/ContentRenderer";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/Sidebar";
import { UseDocumentationData } from "../services/UseDocumentationData";
import SearchModal from "../layouts/SearchModal";
import type { DocItem } from "../types/DocItem";
import { useNavigate, useParams } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { docId } = useParams();

  const {
    versions, currentVersion, setCurrentVersion,
    items, categories, subcategories,
    loading, error
  } = UseDocumentationData();

  const [selectedItem, setSelectedItem] = useState<DocItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!docId || !items.length) return;
    const found = items.find(item => item.id === docId);
    if (found) setSelectedItem(found);
  }, [docId, items]);

  // Open modal on `/` key
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.ctrlKey && e.key.toLowerCase() === "k")) && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  // Filter logic (title priority)
  const filteredItems = items.filter(item => {
    const t = searchTerm.toLowerCase();
    const inTitle = item.title.toLowerCase().includes(t);
    const inContent = item.content?.some(block => {
      if (block.type === "description" || block.type?.startsWith("title") || block.type === "quote")
        return block.content.toLowerCase().includes(t);
      if (block.type === "list")
        return block.items?.some(i => i.toLowerCase().includes(t));
      if (block.type === "code")
        return block.content.toLowerCase().includes(t);
      return false;
    });
    return inTitle || inContent;
  });

  if (error.versions) {
    return <ErrorMessage message={error.versions} onRetry={() => location.reload()} />;
  }

  return (
    <div className="flex flex-col min-h-screen border-x-2 border-gray-200">
      <Header
        versions={versions}
        currentVersion={currentVersion}
        onVersionChange={setCurrentVersion}
        loading={loading.versions}
        onSearchOpen={() => setIsSearchOpen(true)}
      />

      <main className="flex flex-1">
        <Sidebar
          items={items}
          categories={categories}
          subcategories={subcategories}
          onSelect={(item) => {
            navigate(`/${item.id}`);
            setSelectedItem(item);
          }}
          selectedItem={selectedItem}
        />

        <div className="flex-1 p-2 md:p-6">
          {loading.content && <p className="text-gray-500">Loading content...</p>}
          {error.content && <ErrorMessage message={error.content} />}

          {selectedItem && (
            <ContentRenderer
              title={selectedItem.title}
              content={selectedItem.content}
              category={selectedItem.category?.title}
              subcategory={selectedItem.subcategory?.title}
            />
          )}

          {!selectedItem && !loading.content && !error.content && (
            <div className="text-gray-500 text-center mt-16">
              Select a document from the sidebar
            </div>
          )}
        </div>
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        results={filteredItems}
        onSelect={(item) => {
          navigate(`/${item.id}`);
          setSelectedItem(item);
        }}
      />
    </div>
  );
};

export default MainPage;
