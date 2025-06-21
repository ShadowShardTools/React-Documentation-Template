export interface ContentBlock {
  type:
    | 'title-h1'
    | 'title-h2'
    | 'title-h3'
    | 'description'
    | 'code'
    | 'list'
    | 'table'
    | 'image'
    | 'quote'
    | 'image-compare'
    | 'image-compare-slider'
    | 'sound'
    | 'youtube'
    | 'carousel';

  content: string;
  language?: string;

  // List
  items?: string[];

  // Table
  headers?: string[];
  rows?: string[][];

  // Image
  alt?: string;
  src?: string;

  // Image compare
  before?: string;
  after?: string;

  // Sound
  mimeType?: string;
  caption?: string;

  // YouTube
  videoId?: string;

  // Carousel
  images?: { src: string; alt?: string }[];
}
