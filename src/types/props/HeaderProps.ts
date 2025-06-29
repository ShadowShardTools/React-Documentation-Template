import type { Version } from "../Version";

export interface HeaderProps {
  versions: Version[];
  currentVersion: string;
  onVersionChange: (version: string) => void;
  loading: boolean;
  onSearchOpen: () => void;
}