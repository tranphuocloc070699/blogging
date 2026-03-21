import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import {
  successResponse,
  errorResponse,
  conflictResponse,
  paginatedResponse,
  serverErrorResponse,
  serviceUnavailableResponse
} from '@/lib/response';
import { isDatabaseUnavailableError } from '@/lib/app-error';
import { serializeBigInt } from '@/lib/api-utils';
import { termServerService } from '@/services/modules/term-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

// GET /api/terms - Get all terms with optional taxonomy filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const isFull = searchParams.get('isFull') === 'true';
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDir = searchParams.get('sortDir') || 'asc';
    const search = searchParams.get('search');
    const taxonomyId = searchParams.get('taxonomyId');

    const { terms, totalElements } = await termServerService.getTerms({
      isFull,
      page,
      size,
      sortBy,
      sortDir: sortDir as "asc" | "desc",
      search: search ?? undefined,
      taxonomyId: taxonomyId ?? undefined,
    });

    // If fetching all data, return without pagination metadata
    if (isFull) {
      return successResponse(
        terms,
        'All terms retrieved successfully'
      );
    }

    // Return paginated response
    const totalPages = Math.ceil(totalElements / size);

    return paginatedResponse(
      terms,
      {
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      'Terms retrieved successfully'
    );
  } catch (error) {
    console.error('Get terms error:', error);
    captureApiRouteError(error, { method: "GET", route: "/api/terms" });

    if (isDatabaseUnavailableError(error)) {
      return serviceUnavailableResponse(
        'Terms are temporarily unavailable. Please try again later.',
        {
          code: 'DATABASE_UNAVAILABLE',
          retryable: true,
        }
      );
    }

    return serverErrorResponse('Failed to fetch terms');
  }
}

// POST /api/terms - Create term (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { name, slug, description, taxonomyId } = body;

    // Validation
    if (!name || !taxonomyId) {
      return errorResponse('Name and taxonomy ID are required');
    }

    const { error, data: term } = await termServerService.createTerm({
      name,
      slug,
      description,
      taxonomyId: parseInt(taxonomyId),
    });

    if (error === "TAXONOMY_NOT_FOUND") {
      return errorResponse('Taxonomy not found', 404);
    }

    if (error === "DUPLICATE") {
      return conflictResponse('Term with this name or slug already exists in this taxonomy');
    }

    if (!term) {
      return errorResponse('Failed to create term', 500);
    }

    const { _count, ...rest } = term;
    return successResponse(
      {
        ...serializeBigInt(rest),
        postCount: _count.postTerms,
      },
      'Term created successfully',
      201
    );
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Create term error:', error);
    captureApiRouteError(error, { method: "POST", route: "/api/terms" });

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('name')) {
        return conflictResponse('A term with this name already exists in this taxonomy');
      }
      if (target?.includes('slug')) {
        return conflictResponse('A term with this slug already exists in this taxonomy');
      }
      return conflictResponse('A term with this name or slug already exists in this taxonomy');
    }

    return errorResponse('Failed to create term', 500);
  }
}
