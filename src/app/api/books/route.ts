import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  serverErrorResponse
} from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';

// GET /api/books - Get all books with pagination or full data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const isFull = searchParams.get('isFull') === 'true';
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const search = searchParams.get('search');

    // Build where clause
    const where: Prisma.BookWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const totalElements = await prisma.book.count({ where });

    // Build query options
    const queryOptions: any = {
      where,
      orderBy: { [sortBy]: sortDir },
    };

    // Add pagination only if not fetching full data
    if (!isFull) {
      queryOptions.skip = page * size;
      queryOptions.take = size;
    }

    // Get books
    const books = await prisma.book.findMany(queryOptions);

    // Format response - Convert BigInt to number
    const formattedBooks = books.map((book) => serializeBigInt(book));

    // If fetching all data, return without pagination metadata
    if (isFull) {
      return successResponse(
        formattedBooks,
        'All books retrieved successfully'
      );
    }

    // Return paginated response
    const totalPages = Math.ceil(totalElements / size);
    return paginatedResponse(
      formattedBooks,
      {
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      'Books retrieved successfully'
    );
  } catch (error) {
    console.error('Get books error:', error);
    return serverErrorResponse('Failed to fetch books');
  }
}

// POST /api/books - Create book (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { name, author, publishDate, review, quotes, thumbnail } = body;

    // Validation
    if (!name || !author || !review) {
      return errorResponse('Name, author, and review are required');
    }

    // Create book
    const book = await prisma.book.create({
      data: {
        name,
        author,
        publishDate: publishDate ? new Date(publishDate) : null,
        review,
        quotes: quotes || null,
        thumbnail,
      },
    });

    return successResponse(
      serializeBigInt(book),
      'Book created successfully',
      201
    );
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Create book error:', error);
    return errorResponse('Failed to create book', 500);
  }
}
