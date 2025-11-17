import type { PaginatedApiResponse, ApiResponse, SearchParams } from "@/types/common";
import HttpFactory from "../factory";
import {
  TaxonomyDto,
  CreateTaxonomyDto,
  UpdateTaxonomyDto
} from "@/types/posts";
import { getClientOrServerUrl } from "@/lib/api-utils";

class TaxonomyService extends HttpFactory {


  readonly PREFIX: string = "/api/taxonomies";

  async getAllTaxonomies(params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}`,
      params: Object.keys(params).length > 0 ? params : undefined
    });
  }

  async getTaxonomyById(id: number) {
    return this.call<ApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}/${id}`
    });
  }

  async getTaxonomyBySlug(slug: string) {
    return this.call<ApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}`
    });
  }

  async getTaxonomyWithTerms(slug: string) {
    return this.call<ApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}/slug/${slug}/with-terms`
    });
  }

  async createTaxonomy(dto: CreateTaxonomyDto) {
    return this.call<ApiResponse<TaxonomyDto>>({
      method: "POST",
      url: `${this.PREFIX}`,
      body: dto
    });
  }

  async updateTaxonomy(id: number, dto: UpdateTaxonomyDto) {
    return this.call<ApiResponse<TaxonomyDto>>({
      method: "PUT",
      url: `${this.PREFIX}/${id}`,
      body: dto
    });
  }

  async deleteTaxonomy(id: number) {
    return this.call<ApiResponse<void>>({
      method: "DELETE",
      url: `${this.PREFIX}/${id}`
    });
  }

  async searchTaxonomies(query: string, params: SearchParams = {}) {
    return this.call<PaginatedApiResponse<TaxonomyDto>>({
      method: "GET",
      url: `${this.PREFIX}`,
      params: { ...params, search: query }
    });
  }
}

export default TaxonomyService;