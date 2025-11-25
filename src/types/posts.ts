export interface PostStatus {
  DRAFT: 'DRAFT';
  PUBLISHED: 'PUBLISHED';
}

export interface TocItem {
  title: string;
  anchor: string;
  level: number;
  children?: TocItem[];
}

export interface TableOfContents {
  items: TocItem[];
  enabled: boolean;
}

export interface UserDto {
  id: number;
  name: string;
  avatar?: string;
}

export interface TaxonomyDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  termCount?: number;
  createdAt: string;
  updatedAt: string;
  terms?: TermDto[];
}

export interface TermDto {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
  taxonomy: TaxonomySummaryDto;
  createdAt: string;
  updatedAt: string;
}

export interface TaxonomySummaryDto {
  id: number;
  name: string;
  slug: string;
}

export interface PostDto {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  tableOfContents?: TableOfContents;
  status: 'DRAFT' | 'PUBLISHED';
  author: UserDto;
  terms?: TermDto[];
  publishedAt: Date | null;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
  keywords: string;
  viewsCount?: number;
  likesCount?: number;
  isLiked?: boolean;
  isViewed?: boolean;
}

export type PostDashboardDto = Pick<PostDto, 'id' | 'slug' | 'thumbnail' | 'title' | 'excerpt' | 'publishedAt' | 'likesCount' | 'isLiked'>

export interface PostSummaryDto {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  tableOfContents?: TableOfContents;
  status: 'DRAFT' | 'PUBLISHED';
  termIds?: number[];
  keyword?: string;
  // Thumbnail
  thumbnail?: string;
  keywords: string;
}

export interface UpdatePostDto {
  title?: string;
  excerpt?: string;
  content?: string;
  slug?: string;
  tableOfContents?: TableOfContents;
  status?: string;
  termIds?: number[];

  // Thumbnail
  thumbnail?: string;
  keywords: string;
}

export interface CreateTaxonomyDto {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateTaxonomyDto {
  name?: string;
  slug?: string;
  description?: string;
}

export interface CreateTermDto {
  name: string;
  slug?: string;
  description?: string;
  taxonomyId: number;
}

export interface UpdateTermDto {
  name?: string;
  slug?: string;
  description?: string;
  taxonomyId?: number;
}

export interface SerializedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  publishedAt: string;
  terms: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Series {
  id: number;
  name: string;
  slug: string;
  description?: string;
  _count: {
    posts: number;
  };
}