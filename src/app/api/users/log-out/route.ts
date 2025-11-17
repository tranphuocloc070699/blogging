import { NextRequest } from 'next/server';
import { verifyToken, deleteRefreshTokenCookie, getRefreshTokenFromCookie } from '@/lib/auth';
import { successResponse, forbiddenResponse } from '@/lib/response';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return forbiddenResponse('Refresh token not found');
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    if (!payload || payload.type !== 'refresh') {
      return forbiddenResponse('Invalid or expired refresh token');
    }

    // Delete refresh token cookie
    await deleteRefreshTokenCookie();

    return successResponse(null, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    return forbiddenResponse('Logout failed');
  }
}
