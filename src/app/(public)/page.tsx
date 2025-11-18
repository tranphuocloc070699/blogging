import { Metadata } from 'next';
import BlogPostList from '@/components/public/blog-posts/blog-post-list';
import BlogPostFilterBar from '@/components/public/blog-posts/blog-post-filter-bar';
import PostService from '@/services/modules/post-service';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore articles about web development, React, and modern JavaScript',
};

// Revalidate every 60 seconds for fresh content (ISR)
export const revalidate = 60;

interface HomePageProps {
  searchParams: {
    page?: string;
    search?: string;
    tag?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam, search, tag } = await searchParams;


  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = 10; // Changed to 1 to test pagination with 3 posts

  // Fetch all posts from page 1 to current page (to show all accumulated posts)
  const totalPostsToFetch = page * pageSize;

  // Use service layer to fetch posts
  const postService = new PostService();
  const response = await postService.getPublishedPosts({
    page: 1, // Always start from page 1 to accumulate posts
    size: totalPostsToFetch,
    search,
    tag,
  });

  // Extract data from response (HttpFactory returns {headers, body})
  const posts = response.body.data?.posts || [];
  const hasMore = response.body.data?.hasMore || false;
  const total = response.body.data?.total || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <BlogPostFilterBar />
      <BlogPostList
        posts={posts}
        hasMore={hasMore}
        currentPage={page}
        total={total}
      />
    </div>
  );
}
