import prisma from '@/lib/prisma';
import { verifyToken, generateAccessToken, generateRefreshToken } from '@/lib/auth.util';
import { successResponse, forbiddenResponse, errorResponse } from '@/lib/response';
import { TOKEN_TYPE } from '@/config/enums';
import { NextRequest } from 'next/server';

// POST /api/users/refresh - Refresh access token using refresh token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return errorResponse('Refresh token is required');
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    if (!payload || payload.type !== TOKEN_TYPE.REFRESH) {
      return forbiddenResponse('Invalid or expired refresh token');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return forbiddenResponse('User not found');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return successResponse(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        data: user,
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    console.error('Token refresh error:', error);
    return forbiddenResponse('Token refresh failed');
  }
}


