import { TOKEN_TYPE, USER_ROLE } from '@/config/enums';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import "@/lib/envConfig"

const JWT_SECRET = process.env["JWT_SECRET"] || '';
const ACCESS_TOKEN_EXPIRE = parseInt(process.env["JWT_ACCESS_TOKEN_EXPIRE"] || '3600');
const REFRESH_TOKEN_EXPIRE = parseInt(process.env["JWT_REFRESH_TOKEN_EXPIRE"] || '604800');

export interface TokenPayload {
  userId: number;
  username: string;
  email?: string;
  role: typeof USER_ROLE[keyof typeof USER_ROLE];
  type: TOKEN_TYPE;
}

// Type for user data that can be used to generate tokens
export interface UserForToken {
  id: number;
  username: string;
  email?: string | null;
  role: typeof USER_ROLE[keyof typeof USER_ROLE] | null;
}

export interface SetAuthTokenProps {
  type: TOKEN_TYPE;
  token: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate access token
export function generateAccessToken(user: UserForToken): string {
  const payload: TokenPayload = {
    userId: user.id,
    username: user.username,
    email: user.email || undefined,
    role: user.role || USER_ROLE.USER,
    type: TOKEN_TYPE.ACCESS, // Temporary fix inconsistence between next auth and authenticate manully
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });
}

// Generate refresh token
export function generateRefreshToken(user: UserForToken): string {
  const payload: TokenPayload = {
    userId: user.id,
    username: user.username,
    email: user.email || undefined,
    role: user.role || USER_ROLE.USER,
    type: TOKEN_TYPE.REFRESH,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });
}

// Verify token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function setAuthTokenCookie({ type, token }: SetAuthTokenProps) {
  const cookieStore = await cookies();
  const EXPIRED = type === TOKEN_TYPE.ACCESS ? ACCESS_TOKEN_EXPIRE : REFRESH_TOKEN_EXPIRE

  cookieStore.set(type, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: EXPIRED,
    path: '/',
  });
}

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_TYPE.ACCESS, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ACCESS_TOKEN_EXPIRE,
    path: '/',
  });
}

// Set refresh token cookie
export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_TYPE.REFRESH, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: REFRESH_TOKEN_EXPIRE,
    path: '/',
  });
}

// Get refresh token from cookie
export async function getRefreshTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value;
}

export async function getAccessTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
}

export async function deleteAuthTokenCookie(type: TOKEN_TYPE) {
  const cookieStore = await cookies();
  let cookieName = 'refreshToken';

  if (type === TOKEN_TYPE.ACCESS) {
    cookieName = 'accessToken'
  }
  cookieStore.delete(cookieName);
}

// Delete refresh token cookie
export async function deleteRefreshTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_TYPE.REFRESH, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });
}

export async function deleteAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_TYPE.ACCESS, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  });
}



/**
 * Extracts and verifies the JWT from an "Authorization: Bearer <token>" header
 * @param authHeader - Value of the Authorization header (or undefined)
 * @returns Decoded payload or null if invalid/missing
 */
export function getUserFromAuthHeader(authHeader?: string): TokenPayload | null {
  // No header → unauthenticated
  if (!authHeader) {
    return null;
  }

  // Must start with "Bearer " (note the space)
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  // Extract token after "Bearer "
  const token = authHeader.slice(7); // "Bearer ".length === 7

  // Empty token after "Bearer "
  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch (error) {
    // Invalid, expired, malformed token → treat as unauthenticated
    console.warn("Invalid JWT in Authorization header:", error);
    return null;
  }
}