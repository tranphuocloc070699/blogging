import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRE = parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRE || '3600'); // 1 hour
const REFRESH_TOKEN_EXPIRE = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE || '604800'); // 7 days

export interface TokenPayload {
  userId: number;
  username: string;
  email?: string;
  role: string;
  type: 'access' | 'refresh';
}

// Type for user data that can be used to generate tokens
export interface UserForToken {
  id: number;
  username: string;
  email?: string | null;
  role?: string | null;
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
    role: user.role || 'USER',
    type: 'access',
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });
}

// Generate refresh token
export function generateRefreshToken(user: UserForToken): string {
  const payload: TokenPayload = {
    userId: user.id,
    username: user.username,
    email: user.email || undefined,
    role: user.role || 'USER',
    type: 'refresh',
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

export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', token, {
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
  cookieStore.set('refreshToken', token, {
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


// Delete refresh token cookie
export async function deleteRefreshTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');
}

export async function deleteAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
}


// Get user from access token in Authorization header
export function getUserFromAuthHeader(authHeader: string | undefined): TokenPayload | null {
  if (!authHeader) {
    return null;
  }


  // const token = authHeader.substring(7);
  return verifyToken(authHeader);
}
