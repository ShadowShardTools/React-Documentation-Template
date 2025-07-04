import type { Version } from "../entities/Version";

export interface VersionSelectorProps {
  versions: Version[];
  currentVersion: string;
  onVersionChange: (version: string) => void;
  loading: boolean;
}