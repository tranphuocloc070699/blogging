import { NextRequest } from 'next/server';
import { getAccessTokenFromCookie, getUserFromAuthHeader, type TokenPayload } from './auth';
import { unauthorizedResponse, forbiddenResponse } from './response';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

// Optional auth - returns user or null without throwing error
export async function getAuthUser(): Promise<TokenPayload | null> {
  // const authHeader = request.headers.get('authorization');

    const authHeader  = await getAccessTokenFromCookie();

  console.log({ authHeader })
  const user = getUserFromAuthHeader(authHeader);
  console.log({user})
  if (!user || user.type !== 'access') {
    return null;
  }
  return user;
}

// Middleware to require authentication
export async function requireAuth(request: NextRequest): Promise<{ user: TokenPayload } | Response> {
  const authHeader =  await getAccessTokenFromCookie();;
  const user = getUserFromAuthHeader(authHeader);

  if (!user || user.type !== 'access') {
    return unauthorizedResponse('Authentication required');
  }

  return { user };
}

// Middleware to require admin role
export async function requireAdmin(request: NextRequest): Promise<{ user: TokenPayload } | Response> {
  const authResult = await requireAuth(request);

  if (authResult instanceof Response) {
    return authResult;
  }

  const { user } = authResult;

  if (user.role !== 'ADMIN') {
    return forbiddenResponse('Admin access required');
  }

  return { user };
}
