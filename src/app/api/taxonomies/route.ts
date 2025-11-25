import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, conflictResponse, paginatedResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';

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

    // Build where clause
    const where: Prisma.TaxonomyWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Get total count
    const totalElements = await prisma.taxonomy.count({ where });

    // Get taxonomies
    const taxonomies = await prisma.taxonomy.findMany({
      where,
      skip: page * size,
      take: size,
      orderBy: { [sortBy]: sortDir },
      include: {
        _count: {
          select: { terms: true },
        },
        terms: true
      },
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

    // Generate slug if not provided
    const taxonomySlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check if taxonomy already exists (case-insensitive)
    const existing = await prisma.taxonomy.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: { equals: taxonomySlug, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      return conflictResponse('Taxonomy with this name or slug already exists');
    }

    // Create taxonomy
    const taxonomy = await prisma.taxonomy.create({
      data: {
        name,
        slug: taxonomySlug,
        description,
      },
      include: {
        _count: {
          select: { terms: true },
        },
      },
    });

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
