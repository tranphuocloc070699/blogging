import type { ApiResponse, PaginatedApiResponse } from "@/types/common";
import HttpFactory from "../factory";
import { BookDto, CreateBookDto, UpdateBookDto } from "@/types/books";

class BookService extends HttpFactory {
  readonly PREFIX: string = "/api/books";

  /**
   * GET /api/books
   * Get all books with pagination
   */
  async getAllBooks(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    search?: string;
    isFull?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', params.page.toString());
    if (params?.size !== undefined) searchParams.set('size', params.size.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortDir) searchParams.set('sortDir', params.sortDir);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.isFull !== undefined) searchParams.set('isFull', params.isFull.toString());

    if (params?.isFull) {
      return this.call<ApiResponse<BookDto[]>>({
        method: "GET",
        url: `${this.PREFIX}?${searchParams.toString()}`,
      });
    }

    return this.call<PaginatedApiResponse<BookDto>>({
      method: "GET",
      url: `${this.PREFIX}?${searchParams.toString()}`,
    });
  }

  /**
   * GET /api/books/:id
   * Get book by ID
   */
  async getBookById(id: number) {
    return this.call<ApiResponse<BookDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
    });
  }

  /**
   * POST /api/books
   * Create a new book (Admin only)
   */
  async createBook(requestData: CreateBookDto) {
    return this.call<ApiResponse<BookDto>>({
      method: "POST",
      url: this.PREFIX,
      body: requestData
    });
  }

  /**
   * PUT /api/books/:id
   * Update book (Admin only)
   */
  async updateBook(id: number, requestData: UpdateBookDto) {
    return this.call<ApiResponse<BookDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: requestData
    });
  }

  /**
   * DELETE /api/books/:id
   * Delete book (Admin only)
   */
  async deleteBook(id: number) {
    return this.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`,
    });
  }
}

export default BookService;
