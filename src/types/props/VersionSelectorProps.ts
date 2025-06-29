import type { Version } from "../Version";

export interface VersionSelectorProps {
  versions: Version[];
  currentVersion: string;
  onVersionChange: (version: string) => void;
  loading: boolean;
}