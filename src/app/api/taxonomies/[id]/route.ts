import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, conflictResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { taxonomyServerService } from '@/services/modules/taxonomy-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

// GET /api/taxonomies/:id - Get taxonomy by ID
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxonomy = await taxonomyServerService.getTaxonomyById(parseInt(id));

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
    captureApiRouteError(error, { method: "GET", route: "/api/taxonomies/[id]" });
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

    const { error, data: taxonomy } = await taxonomyServerService.updateTaxonomy(parseInt(id), {
      name,
      slug,
      description,
    });

    if (error === "NOT_FOUND") {
      return notFoundResponse('Taxonomy not found');
    }

    if (error === "DUPLICATE") {
      return conflictResponse('A taxonomy with this name or slug already exists');
    }

    if (!taxonomy) {
      return errorResponse('Failed to update taxonomy', 500);
    }

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
    captureApiRouteError(error, { method: "PUT", route: "/api/taxonomies/[id]" });

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
    const { error } = await taxonomyServerService.deleteTaxonomy(parseInt(id));
    if (error === "NOT_FOUND") {
      return notFoundResponse('Taxonomy not found');
    }

    if (error === "HAS_TERMS") {
      return errorResponse('Cannot delete taxonomy with existing terms', 400);
    }

    return successResponse(null, 'Taxonomy deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete taxonomy error:', error);
    captureApiRouteError(error, { method: "DELETE", route: "/api/taxonomies/[id]" });
    return errorResponse('Failed to delete taxonomy', 500);
  }
}
