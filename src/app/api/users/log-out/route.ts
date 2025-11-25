import { TOKEN_TYPE } from '@/config/enums';
import { deleteAccessTokenCookie, deleteRefreshTokenCookie, getRefreshTokenFromCookie, verifyToken } from '@/lib/auth.util';
import { forbiddenResponse } from '@/lib/response';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = await getRefreshTokenFromCookie();

    if (!refreshToken) {
      return forbiddenResponse('Refresh token not found');
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    if (!payload || payload.type !== TOKEN_TYPE.REFRESH) {
      return forbiddenResponse('Invalid or expired refresh token');
    }

    // Delete refresh token cookie
    await deleteRefreshTokenCookie();
    await deleteAccessTokenCookie();

    const url = new URL('/', request.url);

   return NextResponse.redirect(url, {
      status: 302, 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return forbiddenResponse('Logout failed');
  }
}
