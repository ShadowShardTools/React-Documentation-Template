import type { Version } from "../entities/Version";

export interface HeaderProps {
  versions: Version[];
  currentVersion: string;
  onVersionChange: (version: string) => void;
  loading: boolean;
  onSearchOpen: () => void;
}