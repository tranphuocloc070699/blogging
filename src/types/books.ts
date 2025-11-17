export interface BookDto {
  id: number;
  name: string;
  author: string;
  publishDate?: string;
  review: string;
  quotes?: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  name: string;
  author: string;
  publishDate?: string;
  review: string;
  quotes?: string[];
  thumbnail?: string;
}

export interface UpdateBookDto {
  name?: string;
  author?: string;
  publishDate?: string;
  review?: string;
  quotes?: string[];
  thumbnail?: string;
}
