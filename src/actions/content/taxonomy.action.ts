"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "@/lib/cache-tags";
import { withMonitoredServerAction } from "@/lib/sentry-monitoring";
import { taxonomyRepository, type TaxonomyListInput } from "@/repositories/taxonomy.repository";

const getCachedTaxonomies = unstable_cache(
  async (input: TaxonomyListInput) => taxonomyRepository.findMany(input),
  ["taxonomies-list"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.taxonomies, CACHE_TAGS.terms],
  },
);

const getCachedTaxonomyById = unstable_cache(
  async (id: number) => taxonomyRepository.findById(id),
  ["taxonomy-detail"],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [CACHE_TAGS.taxonomies],
  },
);

export async function getTaxonomiesAction(input: TaxonomyListInput) {
  return withMonitoredServerAction("taxonomy.getTaxonomies", async () =>
    getCachedTaxonomies(input),
  );
}

export async function getTaxonomyByIdAction(id: number) {
  return withMonitoredServerAction("taxonomy.getById", async () =>
    getCachedTaxonomyById(id),
  );
}

export async function createTaxonomyAction(input: {
  name: string;
  slug?: string;
  description?: string;
}) {
  return withMonitoredServerAction("taxonomy.create", async () => {
    const slug =
      input.slug ||
      input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const existing = await taxonomyRepository.findByNameOrSlug(input.name, slug);
    if (existing) {
      return { error: "DUPLICATE" as const, data: null };
    }

    const taxonomy = await taxonomyRepository.create({
      name: input.name,
      slug,
      description: input.description,
    });
    revalidateTag(CACHE_TAGS.taxonomies, "max");
    revalidateTag(CACHE_TAGS.terms, "max");
    revalidateTag(CACHE_TAGS.taxonomyDetail(taxonomy.id), "max");
    return { error: null, data: taxonomy };
  });
}

export async function updateTaxonomyAction(
  id: number,
  input: { name?: string; slug?: string; description?: string },
) {
  return withMonitoredServerAction("taxonomy.update", async () => {
    const existing = await taxonomyRepository.findById(id);
    if (!existing) {
      return { error: "NOT_FOUND" as const, data: null };
    }

    const nextName = input.name ?? existing.name;
    const nextSlug =
      input.slug ||
      (input.name
        ? input.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
        : existing.slug);

    if (input.name || input.slug) {
      const duplicate = await taxonomyRepository.findByNameOrSlug(nextName, nextSlug, id);
      if (duplicate) {
        return { error: "DUPLICATE" as const, data: null };
      }
    }

    const taxonomy = await taxonomyRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(nextSlug ? { slug: nextSlug } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
    });
    revalidateTag(CACHE_TAGS.taxonomies, "max");
    revalidateTag(CACHE_TAGS.terms, "max");
    revalidateTag(CACHE_TAGS.taxonomyDetail(id), "max");
    return { error: null, data: taxonomy };
  });
}

export async function deleteTaxonomyAction(id: number) {
  return withMonitoredServerAction("taxonomy.delete", async () => {
    const existing = await taxonomyRepository.findById(id);
    if (!existing) {
      return { error: "NOT_FOUND" as const };
    }

    if (existing._count.terms > 0) {
      return { error: "HAS_TERMS" as const };
    }

    await taxonomyRepository.delete(id);
    revalidateTag(CACHE_TAGS.taxonomies, "max");
    revalidateTag(CACHE_TAGS.terms, "max");
    revalidateTag(CACHE_TAGS.taxonomyDetail(id), "max");
    return { error: null };
  });
}

