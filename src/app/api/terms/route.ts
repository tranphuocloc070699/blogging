import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import {
  successResponse,
  errorResponse,
  conflictResponse,
  paginatedResponse,
  serverErrorResponse
} from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';

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

    // Build where clause
    const where: Prisma.TermWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (taxonomyId) {
      where.taxonomyId = parseInt(taxonomyId);
    }

    // Get total count
    const totalElements = await prisma.term.count({ where });

    // Build query options
    const queryOptions: any = {
      where,
      orderBy: { [sortBy]: sortDir },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        taxonomy: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        postTerms: true
      }
    };

    // Add pagination only if not fetching full data
    if (!isFull) {
      queryOptions.skip = page * size;
      queryOptions.take = size;
    }

    // Get terms
    const terms = await prisma.term.findMany(queryOptions);



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

    // Generate slug if not provided
    const termSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check if taxonomy exists
    const taxonomy = await prisma.taxonomy.findUnique({
      where: { id: parseInt(taxonomyId) },
    });

    if (!taxonomy) {
      return errorResponse('Taxonomy not found', 404);
    }

    // Check if term already exists in this taxonomy (case-insensitive)
    const existing = await prisma.term.findFirst({
      where: {
        taxonomyId: parseInt(taxonomyId),
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: { equals: termSlug, mode: 'insensitive' } },
        ],
      },
    });

    if (existing) {
      return conflictResponse('Term with this name or slug already exists in this taxonomy');
    }

    // Create term
    const term = await prisma.term.create({
      data: {
        name,
        slug: termSlug,
        description,
        taxonomyId: parseInt(taxonomyId),
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
