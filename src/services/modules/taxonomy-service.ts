// services/TaxonomyService.ts
import http from "@/services/factory"; // ← your singleton http
import type { ApiResponse, PaginatedApiResponse, SearchParams } from "@/types/common";
import type {
  CreateTaxonomyDto,
  TaxonomyDto,
  UpdateTaxonomyDto,
} from "@/types/posts";

class TaxonomyService {
  private readonly PREFIX = "/api/taxonomies";

  /** Get all taxonomies (paginated) */
  async getAllTaxonomies(params?: SearchParams) {
    return http.call<PaginatedApiResponse<TaxonomyDto>>({
      method: "GET",
      url: this.PREFIX,
      params,
    });
  }

  /** Get taxonomy by ID */
  async getTaxonomyById(id: number) {
    return http.call<ApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`,
    });
  }

  /** Get taxonomy by slug */
  async getTaxonomyBySlug(slug: string) {
    return http.call<ApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}`,
    });
  }

  /** Get taxonomy with its terms (for admin UI) */
  async getTaxonomyWithTerms(slug: string) {
    return http.call<ApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}/with-terms`,
    });
  }

  /** Create new taxonomy */
  async createTaxonomy(accessToken: string, dto: CreateTaxonomyDto) {
    return http.call<ApiResponse<TaxonomyDto>>({
      method: "POST",
      url: this.PREFIX,
      body: dto,
      accessToken
    });
  }

  /** Update taxonomy */
  async updateTaxonomy(accessToken: string, id: number, dto: UpdateTaxonomyDto) {
    return http.call<ApiResponse<TaxonomyDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: dto,
      accessToken
    });
  }

  /** Delete taxonomy */
  async deleteTaxonomy(accessToken: string, id: number) {
    return http.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`,
      accessToken
    });
  }

  /** Search taxonomies by name/slug */
  async searchTaxonomies(query: string, params?: SearchParams) {
    return http.call<PaginatedApiResponse<TaxonomyDto>>({
      method: "GET",
      url: this.PREFIX,
      params: query ? { ...params, search: query } : params,
    });
  }
}

// Export both ways — flexible for imports
export const taxonomyService = new TaxonomyService();
export default taxonomyService;