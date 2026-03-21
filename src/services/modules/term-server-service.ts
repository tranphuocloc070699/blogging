import {
  createTermAction,
  deleteTermAction,
  getTermByIdAction,
  getTermsAction,
  updateTermAction,
} from "@/actions/content/term.action";
import type { SearchParams } from "@/types/common";
import type { CreateTermDto, UpdateTermDto } from "@/types/posts";

class TermServerService {
  async getTerms(params?: (SearchParams & { isFull?: boolean }) & { sortBy?: string; taxonomyId?: string }) {
    return getTermsAction({
      isFull: Boolean(params?.isFull),
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sortBy: params?.sortBy || (params?.sort as string) || "name",
      sortDir: params?.sortDir ?? "asc",
      search: params?.search ?? null,
      taxonomyId: params?.taxonomyId ?? null,
    });
  }

  async getTermById(id: number) {
    return getTermByIdAction(id);
  }

  async createTerm(dto: CreateTermDto) {
    return createTermAction({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      taxonomyId: dto.taxonomyId,
    });
  }

  async updateTerm(id: number, dto: UpdateTermDto) {
    return updateTermAction(id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      taxonomyId: dto.taxonomyId,
    });
  }

  async deleteTerm(id: number) {
    return deleteTermAction(id);
  }
}

export const termServerService = new TermServerService();
