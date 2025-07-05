import type { ContentBlock } from "./ContentBlock";

export interface DocItem {
  id: string;
  title: string;
  content: ContentBlock[];
  tags?: string[];
}
