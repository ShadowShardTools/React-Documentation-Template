import type { ContentBlock } from "../entities/ContentBlock";

export type ContentBlockRendererProps = {
  block: ContentBlock;
  index: number;
  TextBlock: React.ComponentType<{index: number; block: ContentBlock; currentPath: string;}>;
  MediaBlock: React.ComponentType<{ index: number; block: ContentBlock }>;
  MathBlock: React.ComponentType<{ index: number, content: string }>;
  CodeBlock: React.ComponentType<{ index: number, content: string; language?: string; scriptName?: string }>;
  GraphBlock: React.ComponentType<{ index: number, expressions: string[] }>;
  UnknownBlock: React.ComponentType<{ index: number; type: string }>;
};
