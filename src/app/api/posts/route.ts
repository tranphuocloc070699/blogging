import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, paginatedResponse, forbiddenResponse } from '@/lib/response';
import { serializeBigInt } from '@/lib/api-utils';
import { Prisma } from '@prisma/client';
import { transformPostWithTaxonomies } from '@/lib/transformers/post-transformer';
import { HEADER_AUTHORIZATION, USER_ROLE } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';

// Valid post statuses (matching database check constraint)
type PostStatus = 'DRAFT' | 'PUBLISHED';

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     description: Retrieve all posts with filtering, pagination and sorting
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number (zero-based)
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortDir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED]
 *         description: Filter by post status
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search keyword (searches in title, content, and excerpt)
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         content:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDir = searchParams.get('sortDir') || 'desc';
    const status = searchParams.get('status') as PostStatus | null;
    const keyword = searchParams.get('keyword');

    // Build where clause
    const where: Prisma.PostWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
        { excerpt: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const totalElements = await prisma.post.count({ where });

    // Get posts
    const posts = await prisma.post.findMany({
      where,
      skip: page * size,
      take: size,
      orderBy: { [sortBy]: sortDir },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
      },
    });



    const totalPages = Math.ceil(totalElements / size);

    // Convert BigInt to number for JSON serialization
    const postsResponse = posts.map(post => serializeBigInt(post));

    return paginatedResponse(
      postsResponse,
      {
        page,
        size,
        totalElements,
        totalPages,
        first: page === 0,
        last: page >= totalPages - 1,
      },
      'Posts retrieved successfully'
    );
  } catch (error) {
    console.error('Get posts error:', error);
    return errorResponse('Failed to fetch posts', 500);
  }
}


export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    // if (!user || user?.role !== USER_ROLE.ADMIN) throw forbiddenResponse('Admin access required');
    if (!user ) throw forbiddenResponse('Not authenticated');


    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      slug,
      tableOfContents,
      status,
      termIds,
      thumbnail,
      keywords
    } = body;

    // Validation
    if (!title || !excerpt || !content || !slug || !status) {
      return errorResponse('Title, excerpt, content, slug, and status are required');
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return errorResponse('A post with this slug already exists', 409);
    }

    // Create post with terms
    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        slug,
        tableOfContents: tableOfContents || null,
        status,
        authorId: user.userId,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        thumbnail,
        keywords,
        ...(termIds && termIds.length > 0 && {
          postTerms: {
            create: termIds.map((termId: number) => ({
              termId,
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        postTerms: {
          include: {
            term: {
              include: {
                taxonomy: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transform post to group terms by taxonomy
    const transformedPost = transformPostWithTaxonomies(post);
    return successResponse(transformedPost, 'Post created successfully', 201);
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Create post error:', error);
    return errorResponse('Failed to create post', 500);
  }
}
