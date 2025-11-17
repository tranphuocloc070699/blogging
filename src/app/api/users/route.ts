import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, generateAccessToken, generateRefreshToken, setRefreshTokenCookie, getRefreshTokenFromCookie, setAccessTokenCookie } from '@/lib/auth';
import { successResponse, forbiddenResponse } from '@/lib/response';

// GET /api/users - Authenticate with refresh token
export async function GET(request: NextRequest) {
  try {
    // Get refresh token from cookie


    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return successResponse('User not login');
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    if (!payload || payload.type !== 'refresh') {
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

    await setRefreshTokenCookie(newRefreshToken);
    await setAccessTokenCookie(newAccessToken);
    return successResponse(
      {
        accessToken: newAccessToken,
        data: user,
      },
      'Authentication successful'
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return forbiddenResponse('Authentication failed');
  }
}
