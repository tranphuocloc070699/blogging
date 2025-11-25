import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateAccessToken, generateRefreshToken } from '@/lib/auth.util';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/response';

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user with email/username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             emailLogin:
 *               summary: Login with email
 *               value:
 *                 email: user@example.com
 *                 password: password123
 *             usernameLogin:
 *               summary: Login with username
 *               value:
 *                 username: johndoe
 *                 password: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validation
    if ((!email && !username) || !password) {
      return errorResponse('Email/username and password are required');
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          username ? { username } : {},
        ].filter(condition => Object.keys(condition).length > 0)
      }
    });

    if (!user) {
      return unauthorizedResponse('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return unauthorizedResponse('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Remove password from response and convert BigInt to string
    const { password: _, ...userWithoutPassword } = user;
    const userResponse = {
      ...userWithoutPassword,
      id: user.id.toString(),
    };

    return successResponse(
      {
        accessToken,
        refreshToken,
        data: userResponse,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Failed to login', 500);
  }
}
