import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, conflictResponse, paginatedResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { taxonomyServerService } from '@/services/modules/taxonomy-server-service';
import { captureApiRouteError } from '@/lib/sentry-monitoring';

/**
 * @swagger
 * /api/taxonomies:
 *   get:
 *     tags:
 *       - Taxonomies
 *     summary: Get all taxonomies
 *     description: Retrieve all taxonomies with pagination and search
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number (zero-based)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: name
 *         description: Field to sort by
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by taxonomy name
 *     responses:
 *       200:
 *         description: Taxonomies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         content:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Taxonomy'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDir = searchParams.get('sortDir') || 'asc';
    const search = searchParams.get('search');

    const { totalElements, taxonomies } = await taxonomyServerService.getTaxonomies({
      page,
      size,
      sortBy,
      sortDir: sortDir as "asc" | "desc",
      search: search ?? undefined,
    });

    // Format response - Convert BigInt to number and extract term count
    const formattedTaxonomies = taxonomies.map((taxonomy) => {
      const { _count, ...rest } = taxonomy;
      return {
        ...serializeBigInt(rest),
        termCount: _count.terms,
      };
    });

    const totalPages = Math.ceil(totalElements / size);

    return paginatedResponse(
      formattedTaxonomies,
      {
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      'Taxonomies retrieved successfully'
    );
  } catch (error) {
    console.error('Get taxonomies error:', error);
    captureApiRouteError(error, { method: "GET", route: "/api/taxonomies" });
    return errorResponse('Failed to fetch taxonomies', 500);
  }
}

/**
 * @swagger
 * /api/taxonomies:
 *   post:
 *     tags:
 *       - Taxonomies
 *     summary: Create a new taxonomy
 *     description: Create a new taxonomy (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Taxonomy name
 *               slug:
 *                 type: string
 *                 description: Taxonomy slug (auto-generated if not provided)
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Taxonomy description
 *     responses:
 *       201:
 *         description: Taxonomy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Taxonomy'
 *       400:
 *         description: Name is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Taxonomy with this name or slug already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { name, slug, description } = body;

    // Validation
    if (!name) {
      return errorResponse('Name is required');
    }

    const { error, data: taxonomy } = await taxonomyServerService.createTaxonomy({
      name,
      slug,
      description,
    });

    if (error === "DUPLICATE") {
      return conflictResponse('Taxonomy with this name or slug already exists');
    }

    if (!taxonomy) {
      return errorResponse('Failed to create taxonomy', 500);
    }

    const { _count, ...rest } = taxonomy;
    return successResponse(
      {
        ...serializeBigInt(rest),
        termCount: _count.terms,
      },
      'Taxonomy created successfully',
      201
    );
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Create taxonomy error:', error);
    captureApiRouteError(error, { method: "POST", route: "/api/taxonomies" });

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('name')) {
        return conflictResponse('A taxonomy with this name already exists');
      }
      if (target?.includes('slug')) {
        return conflictResponse('A taxonomy with this slug already exists');
      }
      return conflictResponse('A taxonomy with this name or slug already exists');
    }

    return errorResponse('Failed to create taxonomy', 500);
  }
}
