import { NextRequest } from 'next/server';
import { getAccessTokenFromCookie, getUserFromAuthHeader, type TokenPayload } from './auth';
import { unauthorizedResponse, forbiddenResponse } from './response';
import { TOKEN_TYPE } from '@/config/enums';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

// Optional auth - returns user or null without throwing error
export async function getAuthUser(): Promise<TokenPayload | null> {
  // const authHeader = request.headers.get('authorization');
    const authHeader  = await getAccessTokenFromCookie();
  const user = getUserFromAuthHeader(authHeader);
  if (!user || user.type !== TOKEN_TYPE.ACCESS) {
    return null;
  }
  return user;
}

// Middleware to require authentication
export async function requireAuth(): Promise<TokenPayload> {
  const authHeader = await getAccessTokenFromCookie();
  const user = getUserFromAuthHeader(authHeader);

  if (!user || user.type !== TOKEN_TYPE.ACCESS) {
    // Instead of returning Response, throw it
    throw unauthorizedResponse('Authentication required');
  }

  return user; // Return just the user, not wrapped in object
}

// Middleware to require admin role
export async function requireAdmin(): Promise<TokenPayload> {
  const user = await requireAuth(); 

  if (user.role !== 'ADMIN') {
    throw forbiddenResponse('Admin access required');
  }

  return user;
}
