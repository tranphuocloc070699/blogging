import {
  createTaxonomyAction,
  deleteTaxonomyAction,
  getTaxonomiesAction,
  getTaxonomyByIdAction,
  updateTaxonomyAction,
} from "@/actions/content/taxonomy.action";
import type { SearchParams } from "@/types/common";
import type { CreateTaxonomyDto, UpdateTaxonomyDto } from "@/types/posts";

class TaxonomyServerService {
  async getTaxonomies(params?: SearchParams & { sortBy?: string }) {
    return getTaxonomiesAction({
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy || (params?.sort as string) || "name",
      sortDir: params?.sortDir ?? "asc",
      search: params?.search ?? null,
    });
  }

  async getTaxonomyById(id: number) {
    return getTaxonomyByIdAction(id);
  }

  async createTaxonomy(dto: CreateTaxonomyDto) {
    return createTaxonomyAction({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    });
  }

  async updateTaxonomy(id: number, dto: UpdateTaxonomyDto) {
    return updateTaxonomyAction(id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
    });
  }

  async deleteTaxonomy(id: number) {
    return deleteTaxonomyAction(id);
  }
}

export const taxonomyServerService = new TaxonomyServerService();
