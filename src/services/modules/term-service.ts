// services/TermService.ts
import http from "@/services/factory"; // ← your singleton http
import type { ApiResponse, PaginatedApiResponse, SearchParams } from "@/types/common";
import type { CreateTermDto, TermDto, UpdateTermDto } from "@/types/posts";
class TermService {
  private readonly PREFIX = "/api/terms";

  /** Get full list of terms (no pagination) */
  async getAllTerms() {
    return http.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: this.PREFIX,
      params: { isFull: true },
    });
  }

  /** Get paginated terms with filters */
  async getTerms(params?: SearchParams) {
    return http.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: this.PREFIX,
      params,
    });
  }

  /** Get terms belonging to a taxonomy */
  async getTermsByTaxonomy(taxonomySlug: string, params?: SearchParams) {
    return http.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}`,
      params,
    });
  }

  /** Get most popular terms in a taxonomy (e.g. for sidebar) */
  async getPopularTerms(taxonomySlug: string, limit = 10) {
    return http.call<ApiResponse<TermDto[]>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}/popular`,
      params: { limit },
    });
  }

  /** Get single term by ID */
  async getTermById(id: number) {
    return http.call<ApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
    });
  }

  /** Get term by slug */
  async getTermBySlug(slug: string) {
    return http.call<ApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}`,
    });
  }

  /** Get term by taxonomy + slug (common for frontend routing) */
  async getTermBySlugAndTaxonomy(taxonomySlug: string, slug: string) {
    return http.call<ApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}/slug/${slug}`,
    });
  }

  /** Create new term */
  async createTerm(accessToken: string, dto: CreateTermDto) {
    return http.call<ApiResponse<TermDto>>({
      method: "POST",
      url: this.PREFIX,
      body: dto,
      accessToken
    });
  }

  /** Update term */
  async updateTerm(accessToken: string, id: number, dto: UpdateTermDto) {
    return http.call<ApiResponse<TermDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: dto,
      accessToken
    });
  }

  /** Delete term */
  async deleteTerm(accessToken: string, id: number) {
    return http.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`,
      accessToken
    });
  }

  /** Search terms by name/slug */
  async searchTerms(query: string, params?: SearchParams) {
    return http.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: this.PREFIX,
      params: query ? { ...params, search: query } : params,
    });
  }
}

export const termService = new TermService();
export default termService;

