import type { ContentBlock } from "../ContentBlock";

export type ContentBlockRendererProps = {
  block: ContentBlock;
  index: number;
  GraphBlock: React.ComponentType<{ expressions: string[] }>;
  CompareImage: React.ComponentType<{ leftImage: string; rightImage: string; sliderLineColor: string }>;
  Splide: React.ComponentType<{ options: any; children: React.ReactNode }>;
  SplideSlide: React.ComponentType<{ children: React.ReactNode }>;
};
