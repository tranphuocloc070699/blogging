import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';

// GET /api/books/:id - Get book by ID
export async function GET(
  _: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return notFoundResponse('Book not found');
    }

    return successResponse(serializeBigInt(book));
  } catch (error) {
    console.error('Get book error:', error);
    return errorResponse('Failed to fetch book', 500);
  }
}

// PUT /api/books/:id - Update book (Admin only)
export async function PUT(
  request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await requireAdmin();

    const body = await request.json();
    const { name, author, publishDate, review, quotes, thumbnail } = body;

    // Check if book exists
    const existing = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return notFoundResponse('Book not found');
    }

    // Update book
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(author !== undefined && { author }),
        ...(publishDate !== undefined && { publishDate: publishDate ? new Date(publishDate) : null }),
        ...(review !== undefined && { review }),
        ...(quotes !== undefined && { quotes }),
        ...(thumbnail !== undefined && { thumbnail }),
      },
    });

    return successResponse(
      serializeBigInt(book),
      'Book updated successfully'
    );
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Update book error:', error);
    return errorResponse('Failed to update book', 500);
  }
}

// DELETE /api/books/:id - Delete book (Admin only)
export async function DELETE(
   _: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;

  try {
    const user = await requireAdmin();

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return notFoundResponse('Book not found');
    }

    // Delete book
    await prisma.book.delete({
      where: { id: parseInt(id) },
    });

    return successResponse(null, 'Book deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete book error:', error);
    return errorResponse('Failed to delete book', 500);
  }
}
