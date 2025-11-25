import { Metadata } from 'next';
import BlogPostList from '@/components/public/blog-posts/blog-post-list';
import BlogPostFilterBar from '@/components/public/blog-posts/blog-post-filter-bar';
import BlogPostListSkeleton from '@/components/public/blog-posts/blog-post-list-skeleton';
import postService from '@/services/modules/post-service';
import { getAuthSession } from '@/action/auth.action';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore articles about web development, React, and modern JavaScript',
};

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tag?: string;
  }>;
}

interface BlogPostsProps {
  page: number;
  search?: string;
  tag?: string;
}

async function BlogPosts({ page, search, tag }: BlogPostsProps) {
  const session = await getAuthSession();
  const pageSize = 10;
  const totalPostsToFetch = page * pageSize;

  const response = await postService.getPublishedPosts({
    page: 1,
    size: totalPostsToFetch,
    search,
    tag
  }, session?.accessToken);

  const posts = response.body.data?.posts || [];
  const hasMore = response.body.data?.hasMore || false;
  const total = response.body.data?.total || 0;

  return (
    <BlogPostList
      posts={posts}
      hasMore={hasMore}
      currentPage={page}
      total={total}
    />
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam, search, tag } = await searchParams;
  const page = pageParam ? parseInt(pageParam) : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <BlogPostFilterBar />
      <Suspense key={`${page}-${search}-${tag}`} fallback={<BlogPostListSkeleton />}>
        <BlogPosts page={page} search={search} tag={tag} />
      </Suspense>
    </div>
  );
}
