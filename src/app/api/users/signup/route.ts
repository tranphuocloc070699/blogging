import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth.util';
import { successResponse, errorResponse, conflictResponse } from '@/lib/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validation
    if (!email || !username || !password) {
      return errorResponse('Email, username, and password are required');
    }

    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return conflictResponse('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Convert BigInt to string for JSON serialization


    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return successResponse(
      {
        accessToken,
        refreshToken,
        data: user,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Signup error:', error);
    return errorResponse('Failed to register user', 500);
  }
}
