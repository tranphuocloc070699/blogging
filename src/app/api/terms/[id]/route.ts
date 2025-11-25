import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, conflictResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';

// GET /api/terms/:id - Get term by ID
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const term = await prisma.term.findUnique({
      where: { id: parseInt(id) },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const body = await request.json();
    const { name, slug, description, taxonomyId } = body;

    // Check if term exists
    const existing = await prisma.term.findUnique({
      where: { id: parseInt(id) },
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
            { id: { not: parseInt(id) } },
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
      where: { id: parseInt(id) },
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
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    // Check if term exists
    const term = await prisma.term.findUnique({
      where: { id: parseInt(id) },
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
      where: { id: parseInt(id) },
    });

    return successResponse(null, 'Term deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete term error:', error);
    return errorResponse('Failed to delete term', 500);
  }
}
