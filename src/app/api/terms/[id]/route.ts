import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, conflictResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { isDatabaseUnavailableError } from '@/lib/app-error';
import { serviceUnavailableResponse } from '@/lib/response';
import { termServerService } from '@/services/modules/term-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

// GET /api/terms/:id - Get term by ID
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const term = await termServerService.getTermById(parseInt(id));

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
    captureApiRouteError(error, { method: "GET", route: "/api/terms/[id]" });

    if (isDatabaseUnavailableError(error)) {
      return serviceUnavailableResponse(
        'Term data is temporarily unavailable. Please try again later.',
        {
          code: 'DATABASE_UNAVAILABLE',
          retryable: true,
        }
      );
    }

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

    const { error, data: term } = await termServerService.updateTerm(parseInt(id), {
      name,
      slug,
      description,
      taxonomyId: taxonomyId ? parseInt(taxonomyId) : undefined,
    });

    if (error === "NOT_FOUND") {
      return notFoundResponse('Term not found');
    }

    if (error === "TAXONOMY_NOT_FOUND") {
      return errorResponse('Taxonomy not found', 404);
    }

    if (error === "DUPLICATE") {
      return conflictResponse('A term with this name or slug already exists in this taxonomy');
    }

    if (!term) {
      return errorResponse('Failed to update term', 500);
    }

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
    captureApiRouteError(error, { method: "PUT", route: "/api/terms/[id]" });

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
    const { error } = await termServerService.deleteTerm(parseInt(id));
    if (error === "NOT_FOUND") {
      return notFoundResponse('Term not found');
    }

    if (error === "IN_USE") {
      return errorResponse('Cannot delete term that is used in posts', 400);
    }

    return successResponse(null, 'Term deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete term error:', error);
    captureApiRouteError(error, { method: "DELETE", route: "/api/terms/[id]" });
    return errorResponse('Failed to delete term', 500);
  }
}
