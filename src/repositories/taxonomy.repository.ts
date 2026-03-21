import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface TaxonomyListInput {
  page: number;
  size: number;
  sortBy: string;
  sortDir: "asc" | "desc";
  search?: string | null;
}

export const taxonomyRepository = {
  async findMany(input: TaxonomyListInput) {
    const where: Prisma.TaxonomyWhereInput = {};
    if (input.search) {
      where.name = { contains: input.search, mode: "insensitive" };
    }

    const [totalElements, taxonomies] = await Promise.all([
      prisma.taxonomy.count({ where }),
      prisma.taxonomy.findMany({
        where,
        skip: input.page * input.size,
        take: input.size,
        orderBy: { [input.sortBy]: input.sortDir },
        include: {
          _count: {
            select: { terms: true },
          },
          terms: true,
        },
      }),
    ]);

    return { totalElements, taxonomies };
  },

  async findById(id: number) {
    return prisma.taxonomy.findUnique({
      where: { id },
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });
  },

  async findByNameOrSlug(name: string, slug: string, excludeId?: number) {
    return prisma.taxonomy.findFirst({
      where: {
        ...(excludeId ? { id: { not: excludeId } } : {}),
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          { slug: { equals: slug, mode: "insensitive" } },
        ],
      },
    });
  },

  async create(data: { name: string; slug: string; description?: string }) {
    return prisma.taxonomy.create({
      data,
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });
  },

  async update(id: number, data: { name?: string; slug?: string; description?: string }) {
    return prisma.taxonomy.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });
  },

  async delete(id: number) {
    return prisma.taxonomy.delete({ where: { id } });
  },
};

