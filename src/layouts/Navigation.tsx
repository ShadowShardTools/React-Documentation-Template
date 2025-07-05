import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Folder,
  Search,
} from "lucide-react";

import SidebarNavigationHints from "../components/dialog/SidebarNavigationHints";
import type { Category } from "../types/entities/Category";
import type { DocItem } from "../types/entities/DocItem";

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const classes = (active: boolean, focused: boolean, lvl: number) =>
  [
    "flex items-center gap-2 cursor-pointer px-2 py-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
    lvl ? "text-gray-600" : "text-gray-700",
    active ? "bg-blue-100 border-l-2 border-blue-500 text-blue-700 font-semibold" : "",
    focused && !active ? "ring-2 ring-blue-300" : "",
    !active && !focused ? "hover:text-blue-600" : "",
  ].join(" ");

const testString = (s: string | undefined, q: string) =>
  s?.toLowerCase().includes(q) ?? false;

const branchMatches = (node: Category, q: string): boolean =>
  testString(node.title, q) ||
  (node.docs?.some((d) => testString(d.title, q)) ?? false) ||
  (node.children?.some((c) => branchMatches(c, q)) ?? false);

/* -------------------------------------------------------------------------- */
/*                               Flat list util                               */
/* -------------------------------------------------------------------------- */

interface FlatEntryDoc {
  type: "doc";
  id: string;
  item: DocItem;
  depth: number;
  key: string; // doc-${id}
}

interface FlatEntryCat {
  type: "category";
  id: string;
  depth: number;
  key: string; // cat-${id}
}

export type FlatEntry = FlatEntryDoc | FlatEntryCat;

const buildEntries = (
  tree: Category[],
  standaloneDocs: DocItem[],
  open: Record<string, boolean>,
  filter: string,
): FlatEntry[] => {
  const list: FlatEntry[] = [];

  const lower = filter.toLowerCase();

  // standalone docs first (depth 0)
  standaloneDocs
    .filter((d) => testString(d.title, lower))
    .forEach((d) =>
      list.push({
        type: "doc",
        id: d.id,
        item: d,
        depth: 0,
        key: `doc-${d.id}`,
      }),
    );

  const visit = (node: Category, depth: number) => {
    if (!branchMatches(node, lower)) return;

    list.push({ type: "category", id: node.id, depth, key: `cat-${node.id}` });

    if (open[node.id]) {
      node.docs?.forEach((d) => {
        if (!testString(d.title, lower)) return;
        list.push({
          type: "doc",
          id: d.id,
          item: d,
          depth: depth + 1,
          key: `doc-${d.id}`,
        });
      });
      node.children?.forEach((c) => visit(c, depth + 1));
    }
  };

  tree.forEach((n) => visit(n, 0));
  return list;
};

/* -------------------------------------------------------------------------- */
/*                                   Rows                                     */
/* -------------------------------------------------------------------------- */

interface DocRowProps {
  doc: DocItem;
  depth: number;
  active: boolean;
  focused: boolean;
  select: (d: DocItem) => void;
}

const DocRow = React.forwardRef<HTMLLIElement, DocRowProps>(
  ({ doc, depth, active, focused, select }, ref) => (
    <li
      ref={ref}
      data-key={`doc-${doc.id}`}
      role="treeitem"
      aria-selected={focused}
      onClick={() => select(doc)}
      className={classes(active, focused, depth)}
    >
      <FileText className="w-4 h-4 shrink-0" />
      {doc.title}
    </li>
  ),
);
DocRow.displayName = "DocRow";

interface CategoryRowProps {
  node: Category;
  depth: number;
  expanded: boolean;
  focused: boolean;
  toggle: (id: string) => void;
}

const CategoryRow = React.forwardRef<HTMLButtonElement, CategoryRowProps>(
  ({ node, depth, expanded, focused, toggle }, ref) => (
    <button
      ref={ref}
      data-key={`cat-${node.id}`}
      role="treeitem"
      aria-expanded={expanded}
      aria-selected={focused}
      onClick={() => toggle(node.id)}
      className={classes(false, focused, depth)}
      style={{ justifyContent: "space-between", width: "100%" }}
    >
      <span className="flex items-center gap-2">
        <Folder className="w-4 h-4 shrink-0" />
        {node.title}
      </span>
      {expanded ? (
        <ChevronDown className="w-4 h-4 shrink-0" />
      ) : (
        <ChevronRight className="w-4 h-4 shrink-0" />
      )}
    </button>
  ),
);
CategoryRow.displayName = "CategoryRow";

/* -------------------------------------------------------------------------- */
/*                                 Branch UI                                 */
/* -------------------------------------------------------------------------- */

interface BranchProps {
  node: Category;
  depth: number;
  open: Record<string, boolean>;
  toggle: (id: string) => void;
  filter: string;
  current: DocItem | null | undefined;
  focusedKey: string | null;
  select: (d: DocItem) => void;
}

const Branch: React.FC<BranchProps> = ({
  node,
  depth,
  open,
  toggle,
  filter,
  current,
  focusedKey,
  select,
}) => {
  if (!branchMatches(node, filter)) return null;

  const expanded = !!open[node.id];
  const catKey = `cat-${node.id}`;
  const catFocused = focusedKey === catKey;

  return (
    <div className={depth ? "ml-4 space-y-1" : "space-y-1"}>
      <CategoryRow
        ref={null}
        node={node}
        depth={depth}
        expanded={expanded}
        focused={catFocused}
        toggle={toggle}
      />

      {expanded && !!node.docs?.length && (
        <ul className="ml-5 space-y-1">
          {node.docs.map((d) => (
            <DocRow
              key={d.id}
              ref={null}
              doc={d}
              depth={depth + 1}
              active={current?.id === d.id}
              focused={focusedKey === `doc-${d.id}`}
              select={select}
            />
          ))}
        </ul>
      )}

      {expanded &&
        node.children?.map((c) => (
          <Branch
            key={c.id}
            node={c}
            depth={depth + 1}
            open={open}
            toggle={toggle}
            filter={filter}
            current={current}
            focusedKey={focusedKey}
            select={select}
          />
        ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                Navigation                                  */
/* -------------------------------------------------------------------------- */

export interface NavigationProps {
  tree: Category[];
  standaloneDocs?: DocItem[];
  onSelect: (doc: DocItem) => void;
  selectedItem?: DocItem | null;
  isSearchOpen?: boolean; // if external search modal is open – skip nav hotkeys
}

const Navigation: React.FC<NavigationProps> = ({
  tree,
  standaloneDocs = [],
  onSelect,
  selectedItem,
  isSearchOpen = false,
}) => {
  // expanded state
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = useCallback(
    (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] })),
    [],
  );

  // filter text
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // flat list & cursor (focused) handling
  const entries = useMemo(
    () => buildEntries(tree, standaloneDocs, open, filter),
    [tree, standaloneDocs, open, filter],
  );

  const [cursor, setCursor] = useState(0);
  const currentKey = entries[cursor]?.key ?? null;

  // keep cursor in range on list updates
  useEffect(() => {
    if (cursor >= entries.length) setCursor(entries.length ? 0 : 0);
  }, [entries.length, cursor]);

  // scroll focused row into view
  useEffect(() => {
    if (!currentKey) return;
    const el = document.querySelector<HTMLElement>(`[data-key="${currentKey}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [currentKey]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isSearchOpen) return; // external search modal overrides nav hotkeys

      const activeElement = document.activeElement as HTMLElement | null;
      const isTyping =
        activeElement && ["INPUT", "TEXTAREA"].includes(activeElement.tagName);

      // Handle ESC to unfocus filter
      if (e.key === "Escape" && activeElement === inputRef.current) {
        e.preventDefault();
        inputRef.current?.blur();
        return;
      }

      if (isTyping && activeElement !== inputRef.current) return;

      switch (e.key) {
        case e.ctrlKey && "ArrowDown":
          e.preventDefault();
          setCursor((i) => Math.min(entries.length - 1, i + 1));
          break;
        case e.ctrlKey && "ArrowUp":
          e.preventDefault();
          setCursor((i) => Math.max(0, i - 1));
          break;
        case "ArrowRight": {
          const entry = entries[cursor];
          if (entry?.type === "category" && !open[entry.id]) {
            e.preventDefault();
            toggle(entry.id);
          }
          break;
        }
        case "ArrowLeft": {
          const entry = entries[cursor];
          if (entry?.type === "category" && open[entry.id]) {
            e.preventDefault();
            toggle(entry.id);
          }
          break;
        }
        case "Enter": {
          const entry = entries[cursor];
          if (!entry) return;
          e.preventDefault();
          if (entry.type === "doc") {
            onSelect(entry.item);
          } else {
            toggle(entry.id);
          }
          break;
        }
        case "f":
        case "F":
          if (!isTyping) {
            e.preventDefault();
            inputRef.current?.focus();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entries, cursor, toggle, open, onSelect, isSearchOpen]);

  

  const lower = filter.toLowerCase();

  return (
    <>
      {/* Filter input */}
      <div className="mb-3 relative">
        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Enter here to filter…"
          className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded bg-white pointer-events-none">
          F
        </kbd>
      </div>

      {/* Hints */}
      <SidebarNavigationHints className="mb-4" />

      {/* Navigation tree */}
      <nav role="tree" aria-label="Documentation navigation" className="space-y-4">
        {/* Stand‑alone docs */}
        {standaloneDocs.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">General</h2>
            <ul className="space-y-1">
              {standaloneDocs
                .filter((d) => d.title.toLowerCase().includes(lower))
                .map((d) => (
                  <DocRow
                    key={d.id}
                    ref={null}
                    doc={d}
                    depth={0}
                    active={selectedItem?.id === d.id}
                    focused={currentKey === `doc-${d.id}`}
                    select={onSelect}
                  />
                ))}
            </ul>
          </section>
        )}

        {/* Category tree */}
        {tree.map((node) => (
          <Branch
            key={node.id}
            node={node}
            depth={0}
            open={open}
            toggle={toggle}
            filter={lower}
            current={selectedItem}
            focusedKey={currentKey}
            select={onSelect}
          />
        ))}
      </nav>
    </>
  );
};

export default Navigation;
