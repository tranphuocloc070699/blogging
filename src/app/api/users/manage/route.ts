import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, conflictResponse, paginatedResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { hashPassword } from '@/lib/auth.util';
import { Prisma } from '@prisma/client';

// GET /api/users/manage - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sortBy = searchParams.get('sortBy') || 'username';
    const sortDir = searchParams.get('sortDir') || 'asc';
    const search = searchParams.get('search');

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const totalElements = await prisma.user.count({ where });

    // Get users (excluding password)
    const users = await prisma.user.findMany({
      where,
      skip: page * size,
      take: size,
      orderBy: { [sortBy]: sortDir },
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

    // Format response with post count
    const formattedUsers = users.map((user) => {
      const { _count, ...rest } = user;
      return {
        ...serializeBigInt(rest),
        postCount: _count.posts,
      };
    });

    const totalPages = Math.ceil(totalElements / size);

    return paginatedResponse(
      formattedUsers,
      {
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      'Users retrieved successfully'
    );
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Get users error:', error);
    return errorResponse('Failed to fetch users', 500);
  }
}

// POST /api/users/manage - Create a new user (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { username, email, password, role } = body;

    // Validation
    if (!username || !password) {
      return errorResponse('Username and password are required');
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: 'insensitive' as const } },
          ...(email ? [{ email: { equals: email, mode: 'insensitive' as const } }] : []),
        ],
      },
    });

    if (existing) {
      return conflictResponse('User with this username or email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
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
      'User created successfully',
      201
    );
  } catch (error: any) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Create user error:', error);

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (target?.includes('username')) {
        return conflictResponse('A user with this username already exists');
      }
      if (target?.includes('email')) {
        return conflictResponse('A user with this email already exists');
      }
      return conflictResponse('A user with this username or email already exists');
    }

    return errorResponse('Failed to create user', 500);
  }
}
