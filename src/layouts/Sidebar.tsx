import type { NavigationProps } from "../types/props/NavigationProps";
import Navigation from "./Navigation";

const Sidebar: React.FC<NavigationProps> = ({
  items,
  categories,
  subcategories,
  onSelect,
  selectedItem,
  visible,
  onMobileClose,
}) => {

  return (
    <>
      <aside className="fixed md:sticky top-16 bottom-0 md:top-16 md:h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-gray-200 p-4 overflow-y-auto custom-scrollbar bg-white z-40">
        <Navigation items={items} categories={categories} subcategories={subcategories} onSelect={onSelect} selectedItem={selectedItem} visible={visible} onMobileClose={onMobileClose} />
      </aside>
    </>
  );
};

export default Sidebar;
