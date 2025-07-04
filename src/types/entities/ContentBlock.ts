export interface ContentBlock {
  type:
    | 'title-h1'
    | 'title-h2'
    | 'title-h3'
    | 'description'
    | 'list'
    | 'quote'
    | 'table'
    | 'image'
    | 'image-compare'
    | 'image-compare-slider'
    | 'image-carousel'
    | 'audio'
    | 'youtube'
    | 'code'
    | 'math'
    | 'graph';

  content: string;
  
  scriptName?: string;
  language?: string;

  graphExpressions?: string[];

  listItems?: string[];

  tableHeaders?: string[];
  tableRows?: string[][];

  // Image
  imageSrc?: string;
  imageAlt?: string;

  // Image compare
  imageBeforeSrc?: string;
  imageAfterSrc?: string;
  imageBeforeAlt?: string;
  imageAfterAlt?: string;

  // Carousel
  carouselImages?: { src: string; alt?: string }[];

  // Audio
  audioSrc?: string;
  audioCaption?: string;
  audioMimeType?: string;

  youtubeVideoId?: string;
}
