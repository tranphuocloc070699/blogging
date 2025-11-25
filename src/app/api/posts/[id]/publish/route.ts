import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/middleware';
import { successResponse, errorResponse, notFoundResponse } from '@/lib/response';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/posts/[id]/publish - Publish a post (Admin only)
export async function PATCH({ params }: RouteParams) {
  try {
    await requireAdmin();

    const { id } = await params;
    const postId = parseInt(id);

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return notFoundResponse('Post not found');
    }

    // Publish post
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: existingPost.publishedAt || new Date(),
      },
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

    // Convert to number for JSON serialization
    const postResponse = {
      ...post,
      id: Number(post.id),
      authorId: Number(post.authorId),
      author: {
        ...post.author,
        id: Number(post.author.id),
      },
      postTerms: post.postTerms.map(pt => ({
        postId: Number(pt.postId),
        termId: Number(pt.termId),
        term: {
          ...pt.term,
          id: Number(pt.term.id),
          taxonomyId: Number(pt.term.taxonomyId),
          taxonomy: {
            ...pt.term.taxonomy,
            id: Number(pt.term.taxonomy.id),
          },
        },
      })),
    };

    return successResponse(postResponse, 'Post published successfully');
  } catch (error) {
    // If it's already a Response (from middleware), return it
    if (error instanceof Response) {
      return error;
    }
    console.error('Publish post error:', error);
    return errorResponse('Failed to publish post', 500);
  }
}
