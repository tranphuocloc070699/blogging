import type { PaginatedApiResponse, ApiResponse, SearchParams } from "@/types/common";
import HttpFactory from "../factory";
import {
  TermDto,
  CreateTermDto,
  UpdateTermDto
} from "@/types/posts";
import { getClientOrServerUrl } from "@/lib/api-utils";

class TermService extends HttpFactory {
  readonly PREFIX: string = "/api/terms";


  async getAllTerms() {
    return this.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}`,
      params: {
        isFull: true
      }
    });
  }


  async getTerms(params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  async getTermsByTaxonomy(taxonomySlug: string, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  async getPopularTerms(taxonomySlug: string, limit: number = 10) {
    return this.call<ApiResponse<TermDto[]>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}/popular`,
      params: { limit }
    });
  }

  async getTermById(id: number) {
    return this.call<ApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`
    });
  }

  async getTermBySlug(slug: string) {
    return this.call<ApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}`
    });
  }

  async getTermBySlugAndTaxonomy(taxonomySlug: string, slug: string) {
    return this.call<ApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}/taxonomy/${taxonomySlug}/slug/${slug}`
    });
  }

  async createTerm(dto: CreateTermDto) {
    return this.call<ApiResponse<TermDto>>({
      method: "POST",
      url: `${this.PREFIX}`,
      body: dto
    });
  }

  async updateTerm(id: number, dto: UpdateTermDto) {
    return this.call<ApiResponse<TermDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: dto
    });
  }

  async deleteTerm(id: number) {
    return this.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`
    });
  }

  async searchTerms(query: string, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<TermDto>>({
      method: "GET",
      url: `${this.PREFIX}`,
      params: { ...params, search: query }
    });
  }
}

export default TermService;