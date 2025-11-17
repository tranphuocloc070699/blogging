import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, conflictResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';

// GET /api/terms/:id - Get term by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const term = await prisma.term.findUnique({
      where: { id: parseInt(params.id) },
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

    if (!term) {
      return notFoundResponse('Term not found');
    }

    const { _count, ...rest } = term;
    return successResponse({
      ...serializeBigInt(rest),
      postCount: _count.postTerms,
    });
  } catch (error) {
    console.error('Get term error:', error);
    return errorResponse('Failed to fetch term', 500);
  }
}

// PUT /api/terms/:id - Update term (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await request.json();
    const { name, slug, description, taxonomyId } = body;

    // Check if term exists
    const existing = await prisma.term.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!existing) {
      return notFoundResponse('Term not found');
    }

    // Check if new taxonomy exists (if changing taxonomy)
    if (taxonomyId && parseInt(taxonomyId) !== existing.taxonomyId) {
      const taxonomy = await prisma.taxonomy.findUnique({
        where: { id: parseInt(taxonomyId) },
      });

      if (!taxonomy) {
        return errorResponse('Taxonomy not found', 404);
      }
    }

    // Generate slug if name is provided but slug is not
    const termSlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : existing.slug);
    const targetTaxonomyId = taxonomyId ? parseInt(taxonomyId) : existing.taxonomyId;

    // Check for duplicates in the target taxonomy (excluding current term)
    if (name || slug) {
      const duplicate = await prisma.term.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(params.id) } },
            { taxonomyId: targetTaxonomyId },
            {
              OR: [
                ...(name ? [{ name: { equals: name, mode: 'insensitive' as const } }] : []),
                ...(termSlug ? [{ slug: { equals: termSlug, mode: 'insensitive' as const } }] : []),
              ],
            },
          ],
        },
      });

      if (duplicate) {
        return conflictResponse('A term with this name or slug already exists in this taxonomy');
      }
    }

    // Update term
    const term = await prisma.term.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(name && { name }),
        ...(termSlug && { slug: termSlug }),
        ...(description !== undefined && { description }),
        ...(taxonomyId && { taxonomyId: parseInt(taxonomyId) }),
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

    const { _count, ...rest } = term;
    return successResponse({
      ...serializeBigInt(rest),
      postCount: _count.postTerms,
    }, 'Term updated successfully');
  } catch (error: any) {
    console.error('Update term error:', error);

    if (error.code === 'P2002') {
      return conflictResponse('A term with this name or slug already exists in this taxonomy');
    }

    return errorResponse('Failed to update term', 500);
  }
}

// DELETE /api/terms/:id - Delete term (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = requireAdmin(request);
  if (authResult instanceof Response) return authResult;

  try {
    // Check if term exists
    const term = await prisma.term.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        _count: {
          select: { postTerms: true },
        },
      },
    });

    if (!term) {
      return notFoundResponse('Term not found');
    }

    // Check if term is used in posts
    if (term._count.postTerms > 0) {
      return errorResponse('Cannot delete term that is used in posts', 400);
    }

    // Delete term
    await prisma.term.delete({
      where: { id: parseInt(params.id) },
    });

    return successResponse(null, 'Term deleted successfully');
  } catch (error) {
    console.error('Delete term error:', error);
    return errorResponse('Failed to delete term', 500);
  }
}
