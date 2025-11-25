import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse, forbiddenResponse } from '@/lib/response';
import { transformPostWithTaxonomies } from '@/lib/transformers/post-transformer';
import { HEADER_AUTHORIZATION, USER_ROLE } from '@/config/enums';
import { getUserFromAuthHeader } from '@/lib/auth.util';

export interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Get post by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // Check for upsave query parameter
    const { searchParams } = new URL(request.url);
    const isUpsave = searchParams.get('upsave') === 'true';

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
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

    if (!post) {
      return notFoundResponse('Post not found');
    }

    // If upsave=true, return simplified format for editing
    if (isUpsave) {
      const termIds = post.postTerms.map(pt => pt.termId);

      const upsaveResponse = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        thumbnail: post.thumbnail || undefined,
        termIds: termIds,
        status: post.status,
        keywords: post.keywords || '',
        publishedAt: post.publishedAt,

      };

      return successResponse(upsaveResponse);
    }

    // Transform post to group terms by taxonomy
    const transformedPost = transformPostWithTaxonomies(post);
    return successResponse(transformedPost);
  } catch (error) {
    console.error('Get post error:', error);
    return errorResponse('Failed to fetch post', 500);
  }
}

// PUT /api/posts/[id] - Update post (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user || user?.role !== USER_ROLE.ADMIN) throw forbiddenResponse('Admin access required');


    const { id } = await params;
    const postId = parseInt(id);
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

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return notFoundResponse('Post not found');
    }

    // If slug is being changed, check if it's already taken
    if (slug && slug !== existingPost.slug) {
      const slugTaken = await prisma.post.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return errorResponse('A post with this slug already exists', 409);
      }
    }

    // Update post
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (slug !== undefined) updateData.slug = slug;
    if (tableOfContents !== undefined) updateData.tableOfContents = tableOfContents;
    if (status !== undefined) {
      updateData.status = status;
      // Set publishedAt when status changes to PUBLISHED
      if (status === 'PUBLISHED' && existingPost.status !== 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (keywords !== undefined) updateData.keywords = keywords;

    // Handle post-term relationships
    if (termIds !== undefined) {
      // Delete all existing post-term relationships
      await prisma.postTerm.deleteMany({
        where: { postId },
      });

      // Create new post-term relationships
      if (termIds.length > 0) {
        updateData.postTerms = {
          create: termIds.map((termId: number) => ({
            termId,
          })),
        };
      }
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
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
    return successResponse(transformedPost, 'Post updated successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Update post error:', error);
    return errorResponse('Failed to update post', 500);
  }
}

// DELETE /api/posts/[id] - Delete post (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const authorization = request.headers.get(HEADER_AUTHORIZATION);
    console.log({ authorization })
    const user = getUserFromAuthHeader(authorization ?? "");
    if (!user || user?.role !== USER_ROLE.ADMIN) throw forbiddenResponse('Admin access required');


    const { id } = await params;
    const postId = parseInt(id);

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return notFoundResponse('Post not found');
    }

    // Delete post (taxonomies will be cascade deleted)
    await prisma.post.delete({
      where: { id: postId },
    });

    return successResponse(null, 'Post deleted successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Delete post error:', error);
    return errorResponse('Failed to delete post', 500);
  }
}
