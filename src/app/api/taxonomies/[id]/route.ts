import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, conflictResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';

// GET /api/taxonomies/:id - Get taxonomy by ID
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxonomy = await prisma.taxonomy.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });

    if (!taxonomy) {
      return notFoundResponse('Taxonomy not found');
    }

    const { _count, ...rest } = taxonomy;
    return successResponse({
      ...serializeBigInt(rest),
      termCount: _count.terms,
    });
  } catch (error) {
    console.error('Get taxonomy error:', error);
    return errorResponse('Failed to fetch taxonomy', 500);
  }
}

// PUT /api/taxonomies/:id - Update taxonomy (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description } = body;

    // Check if taxonomy exists
    const existing = await prisma.taxonomy.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return notFoundResponse('Taxonomy not found');
    }

    // Generate slug if not provided
    const taxonomySlug = slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : existing.slug);

    // Check for duplicates (excluding current taxonomy)
    if (name || slug) {
      const duplicate = await prisma.taxonomy.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                ...(name ? [{ name: { equals: name, mode: 'insensitive' as const } }] : []),
                ...(taxonomySlug ? [{ slug: { equals: taxonomySlug, mode: 'insensitive' as const } }] : []),
              ],
            },
          ],
        },
      });

      if (duplicate) {
        return conflictResponse('A taxonomy with this name or slug already exists');
      }
    }

    // Update taxonomy
    const taxonomy = await prisma.taxonomy.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(taxonomySlug && { slug: taxonomySlug }),
        ...(description !== undefined && { description }),
      },
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });

    const { _count, ...rest } = taxonomy;
    return successResponse({
      ...serializeBigInt(rest),
      termCount: _count.terms,
    }, 'Taxonomy updated successfully');
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Update taxonomy error:', error);

    if (error.code === 'P2002') {
      return conflictResponse('A taxonomy with this name or slug already exists');
    }

    return errorResponse('Failed to update taxonomy', 500);
  }
}

// DELETE /api/taxonomies/:id - Delete taxonomy (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    // Check if taxonomy exists
    const taxonomy = await prisma.taxonomy.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });

    if (!taxonomy) {
      return notFoundResponse('Taxonomy not found');
    }

    // Check if taxonomy has terms
    if (taxonomy._count.terms > 0) {
      return errorResponse('Cannot delete taxonomy with existing terms', 400);
    }

    // Delete taxonomy
    await prisma.taxonomy.delete({
      where: { id: parseInt(id) },
    });

    return successResponse(null, 'Taxonomy deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete taxonomy error:', error);
    return errorResponse('Failed to delete taxonomy', 500);
  }
}
