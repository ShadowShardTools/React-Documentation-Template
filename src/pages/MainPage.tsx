import { lazy, Suspense, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Header = lazy(() => import("../layouts/Header/Header"));
const Sidebar = lazy(() => import("../layouts/Sidebar"));
const ContentRenderer = lazy(() => import("../layouts/ContentRenderer"));
const SearchModal = lazy(() => import("../layouts/SearchModal"));

import { UseDocumentationData } from "../services/UseDocumentationData";
import type { DocItem } from "../types/entities/DocItem";
import ErrorMessage from "../components/dialog/ErrorMessage";

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { docId } = useParams();

  const {
    versions,
    currentVersion,
    setCurrentVersion,
    items,
    categories,
    subcategories,
    loading,
    error
  } = UseDocumentationData();

  const [selectedItem, setSelectedItem] = useState<DocItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    if (docId) {
      const match = items.find(item => item.id === docId);
      if (match) {
        setSelectedItem(match);
        return;
      }
    }

    setSelectedItem(items[0]);
    navigate(`/${items[0].id}`, { replace: true });
  }, [docId, items, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditable = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "") ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if (!isEditable && (e.code === "Slash" || (e.ctrlKey && e.code === "KeyK"))) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Ensure sidebar is visible on md+ screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setSidebarVisible(true);
      }
    };

    if (mediaQuery.matches) {
      setSidebarVisible(true);
    }

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleMobileSelect = () => {
    if (window.innerWidth < 768) setSidebarVisible(false);
  };

  const navigateToItem = (item: DocItem, anchor?: string) => {
    const path = `/${item.id}${anchor ? `#${anchor}` : ""}`;
    navigate(path);
    setSelectedItem(item);
    handleMobileSelect();
  };

  const filteredItems = useMemo(() => {
    const query = searchTerm.toLowerCase();
    if (!query) return [];

    return items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);

      const contentMatch = item.content?.some(block => {
        if (["description", "quote"].includes(block.type) || block.type.startsWith("title")) {
          return block.content.toLowerCase().includes(query);
        }
        if (block.type === "list") {
          return block.listItems?.some(i => i.toLowerCase().includes(query));
        }
        if (block.type === "code") {
          return block.content.toLowerCase().includes(query);
        }
        return false;
      });

      return titleMatch || contentMatch;
    });
  }, [items, searchTerm]);

  if (error.versions) {
    return <ErrorMessage message={error.versions} onRetry={() => location.reload()} />;
  }

  return (
    <div className="flex flex-col min-h-screen border-x-2 border-gray-200">
      <Suspense fallback={<div className="h-16 bg-gray-100" />}>
        <Header
          versions={versions}
          currentVersion={currentVersion}
          onVersionChange={setCurrentVersion}
          loading={loading.versions}
          onSearchOpen={() => setIsSearchOpen(true)}
          onSidebarToggle={() => setSidebarVisible(v => !v)}
        />
      </Suspense>

      <main className="flex flex-1">
        <Suspense fallback={<div className="w-64 bg-gray-50 border-r" />}>
          <Sidebar
            items={items}
            categories={categories}
            subcategories={subcategories}
            onSelect={navigateToItem}
            selectedItem={selectedItem}
            visible={isSidebarVisible}
            onMobileClose={handleMobileSelect}
          />
        </Suspense>

        <div className="flex-1 p-2 md:p-6">
          {loading.content && <p className="text-gray-500">Loading content...</p>}
          {error.content && <ErrorMessage message={error.content} />}

          {!loading.content && !error.content && selectedItem && (
            <Suspense fallback={<p className="text-gray-400">Loading content...</p>}>
              <ContentRenderer
                title={selectedItem.title}
                content={selectedItem.content}
                category={selectedItem.category?.title}
                subcategory={selectedItem.subcategory?.title}
              />
            </Suspense>
          )}

          {!loading.content && !error.content && !selectedItem && (
            <div className="text-gray-500 text-center mt-16">
              Select a document from the sidebar
            </div>
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          results={filteredItems}
          onSelect={navigateToItem}
        />
      </Suspense>
    </div>
  );
};

export default MainPage;