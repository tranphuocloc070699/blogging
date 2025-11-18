
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

// GET /api/tags - Get all tags from Tag taxonomy
export async function GET() {
  try {
    // Get the Tag taxonomy
    const tagTaxonomy = await prisma.taxonomy.findFirst({
      where: { slug: 'tag' },
    });

    if (!tagTaxonomy) {
      return successResponse({ tags: [] });
    }

    // Get all terms from the Tag taxonomy
    const tags = await prisma.term.findMany({
      where: {
        taxonomyId: tagTaxonomy.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return successResponse({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    return errorResponse('Failed to fetch tags', 500);
  }
}
