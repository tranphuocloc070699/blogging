"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "@/lib/cache-tags";
import { withMonitoredServerAction } from "@/lib/sentry-monitoring";
import { termRepository, type TermListInput } from "@/repositories/term.repository";

const getCachedTerms = unstable_cache(
  async (input: TermListInput) => termRepository.findMany(input),
  ["terms-list"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.terms, CACHE_TAGS.taxonomies],
  },
);

const getCachedTermById = unstable_cache(
  async (id: number) => termRepository.findById(id),
  ["term-detail"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.terms],
  },
);

export async function getTermsAction(input: TermListInput) {
  return withMonitoredServerAction("term.getTerms", async () => getCachedTerms(input));
}

export async function getTermByIdAction(id: number) {
  return withMonitoredServerAction("term.getById", async () => getCachedTermById(id));
}

export async function createTermAction(input: {
  name: string;
  slug?: string;
  description?: string;
  taxonomyId: number;
}) {
  return withMonitoredServerAction("term.create", async () => {
    const termSlug =
      input.slug ||
      input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const taxonomy = await termRepository.findTaxonomyById(input.taxonomyId);
    if (!taxonomy) {
      return { error: "TAXONOMY_NOT_FOUND" as const, data: null };
    }

    const existing = await termRepository.existsInTaxonomyByNameOrSlug(
      input.taxonomyId,
      input.name,
      termSlug,
    );
    if (existing) {
      return { error: "DUPLICATE" as const, data: null };
    }

    const term = await termRepository.create({ ...input, slug: termSlug });
    revalidateTag(CACHE_TAGS.terms, "max");
    revalidateTag(CACHE_TAGS.taxonomies, "max");
    revalidateTag(CACHE_TAGS.termDetail(term.id), "max");
    return { error: null, data: term };
  });
}

export async function updateTermAction(
  id: number,
  input: {
    name?: string;
    slug?: string;
    description?: string;
    taxonomyId?: number;
  },
) {
  return withMonitoredServerAction("term.update", async () => {
    const existing = await termRepository.findById(id);
    if (!existing) {
      return { error: "NOT_FOUND" as const, data: null };
    }

    const nextName = input.name ?? existing.name;
    const nextSlug =
      input.slug ||
      (input.name
        ? input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : existing.slug);
    const nextTaxonomyId = input.taxonomyId ?? existing.taxonomyId;

    if (input.taxonomyId && input.taxonomyId !== existing.taxonomyId) {
      const taxonomy = await termRepository.findTaxonomyById(input.taxonomyId);
      if (!taxonomy) {
        return { error: "TAXONOMY_NOT_FOUND" as const, data: null };
      }
    }

    if (input.name || input.slug || input.taxonomyId) {
      const duplicate = await termRepository.existsInTaxonomyByNameOrSlug(
        nextTaxonomyId,
        nextName,
        nextSlug,
        id,
      );
      if (duplicate) {
        return { error: "DUPLICATE" as const, data: null };
      }
    }

    const term = await termRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(nextSlug ? { slug: nextSlug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.taxonomyId !== undefined ? { taxonomyId: input.taxonomyId } : {}),
    });

    revalidateTag(CACHE_TAGS.terms, "max");
    revalidateTag(CACHE_TAGS.taxonomies, "max");
    revalidateTag(CACHE_TAGS.termDetail(id), "max");
    return { error: null, data: term };
  });
}

export async function deleteTermAction(id: number) {
  return withMonitoredServerAction("term.delete", async () => {
    const existing = await termRepository.findById(id);
    if (!existing) {
      return { error: "NOT_FOUND" as const };
    }

    if (existing._count.postTerms > 0) {
      return { error: "IN_USE" as const };
    }

    await termRepository.delete(id);
    revalidateTag(CACHE_TAGS.terms, "max");
    revalidateTag(CACHE_TAGS.taxonomies, "max");
    revalidateTag(CACHE_TAGS.termDetail(id), "max");
    return { error: null };
  });
}

