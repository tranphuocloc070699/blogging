import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, conflictResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { hashPassword } from '@/lib/auth.util';

// GET /api/users/manage/:id - Get user by ID (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!user) {
      return notFoundResponse('User not found');
    }

    const { _count, ...rest } = user;
    return successResponse({
      ...serializeBigInt(rest),
      postCount: _count.posts,
    });
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Get user error:', error);
    return errorResponse('Failed to fetch user', 500);
  }
}

// PUT /api/users/manage/:id - Update user (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const body = await request.json();
    const { username, email, password, role } = body;

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return notFoundResponse('User not found');
    }

    // Validate password length if provided
    if (password && password.length < 6) {
      return errorResponse('Password must be at least 6 characters long');
    }

    // Check for duplicates (excluding current user)
    if (username || email) {
      const duplicate = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: parseInt(id) } },
            {
              OR: [
                ...(username ? [{ username: { equals: username, mode: 'insensitive' as const } }] : []),
                ...(email ? [{ email: { equals: email, mode: 'insensitive' as const } }] : []),
              ],
            },
          ],
        },
      });

      if (duplicate) {
        return conflictResponse('A user with this username or email already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (username) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = await hashPassword(password);

    // Update user
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(
      serializeBigInt(user),
      'User updated successfully'
    );
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Update user error:', error);

    if (error.code === 'P2002') {
      return conflictResponse('A user with this username or email already exists');
    }

    return errorResponse('Failed to update user', 500);
  }
}

// DELETE /api/users/manage/:id - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!user) {
      return notFoundResponse('User not found');
    }

    // Check if user has posts
    if (user._count.posts > 0) {
      return errorResponse('Cannot delete user with existing posts', 400);
    }

    // Delete user
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return successResponse(null, 'User deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete user error:', error);
    return errorResponse('Failed to delete user', 500);
  }
}
