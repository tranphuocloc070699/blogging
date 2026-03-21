import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface TermListInput {
  isFull: boolean;
  page: number;
  size: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  search?: string | null;
  taxonomyId?: string | null;
}

export const termRepository = {
  async findMany(input: TermListInput) {
    const where: Prisma.TermWhereInput = {};

    if (input.search) {
      where.name = { contains: input.search, mode: "insensitive" };
    }

    if (input.taxonomyId) {
      where.taxonomyId = parseInt(input.taxonomyId, 10);
    }

    const totalElements = await prisma.term.count({ where });

    const queryOptions: Prisma.TermFindManyArgs = {
      where,
      orderBy: { [input.sortBy]: input.sortDir },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        taxonomy: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        postTerms: true,
      },
    };

    if (!input.isFull) {
      queryOptions.skip = input.page * input.size;
      queryOptions.take = input.size;
    }

    const terms = await prisma.term.findMany(queryOptions);
    return { terms, totalElements };
  },

  async findById(id: number) {
    return prisma.term.findUnique({
      where: { id },
      include: {
        taxonomy: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { postTerms: true },
        },
      },
    });
  },

  async create(data: {
    name: string;
    slug?: string;
    description?: string;
    taxonomyId: number;
  }) {
    return prisma.term.create({
      data: {
        name: data.name,
        slug: data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description: data.description,
        taxonomyId: data.taxonomyId,
      },
      include: {
        taxonomy: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { postTerms: true },
        },
      },
    });
  },

  async existsInTaxonomyByNameOrSlug(taxonomyId: number, name: string, slug: string, excludeId?: number) {
    return prisma.term.findFirst({
      where: {
        taxonomyId,
        ...(excludeId ? { id: { not: excludeId } } : {}),
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: slug, mode: "insensitive" } },
        ],
      },
    });
  },

  async update(
    id: number,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      taxonomyId?: number;
    },
  ) {
    return prisma.term.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.taxonomyId !== undefined ? { taxonomyId: data.taxonomyId } : {}),
      },
      include: {
        taxonomy: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: { postTerms: true },
        },
      },
    });
  },

  async delete(id: number) {
    return prisma.term.delete({ where: { id } });
  },

  async findTaxonomyById(id: number) {
    return prisma.taxonomy.findUnique({ where: { id } });
  },
};

