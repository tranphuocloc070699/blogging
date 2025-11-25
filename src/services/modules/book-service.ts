// services/BookService.ts
import http from "@/services/factory"; // ← your singleton: export const http = new HttpFactory()
import type { ApiResponse, PaginatedApiResponse } from "@/types/common";
import type { BookDto, CreateBookDto, UpdateBookDto } from "@/types/books";

type BookSearchParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
  isFull?: boolean;
};

class BookService {
  private readonly PREFIX = "/api/books";

  /** GET /api/books - Paginated or full list */
  async getAllBooks(params?: BookSearchParams) {
    const response = await http.call<
      ApiResponse<BookDto[]> | PaginatedApiResponse<BookDto>
    >({
      method: "GET",
      url: this.PREFIX,
      params: params
        ? {
            page: params.page,
            size: params.size,
            sortBy: params.sortBy,
            sortDir: params.sortDir,
            search: params.search,
            isFull: params.isFull,
          }
        : undefined,
    });

    return response;
  }

  /** GET /api/books/:id */
  async getBookById(id: number) {
    return http.call<ApiResponse<BookDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
    });
  }

  /** POST /api/books */
  async createBook(data: CreateBookDto) {
    return http.call<ApiResponse<BookDto>>({
      method: "POST",
      url: this.PREFIX,
      body: data, // ← clean! http handles JSON.stringify + Content-Type
    });
  }

  /** PUT /api/books/:id */
  async updateBook(id: number, data: UpdateBookDto) {
    return http.call<ApiResponse<BookDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: data,
    });
  }

  /** DELETE /api/books/:id */
  async deleteBook(id: number) {
    return http.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`,
    });
  }
}

// Export as both default and named (flexible import)
export const bookService = new BookService();
export default bookService;