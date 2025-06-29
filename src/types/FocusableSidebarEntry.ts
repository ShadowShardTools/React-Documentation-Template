export type FocusableSidebarEntry = {
  type: 'item' | 'category' | 'subcategory';
  id: string;
  title: string;
  depth: number;
  elementRef: React.RefObject<HTMLElement>;
  onEnter: () => void;
  onLeft?: () => void;
  onRight?: () => void;
};
