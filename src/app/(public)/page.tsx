import { Metadata } from "next";
import BlogPostList from "@/components/public/blog-posts/blog-post-list";
import BlogPostFilterBar from "@/components/public/blog-posts/blog-post-filter-bar";
import BlogPostListSkeleton from "@/components/public/blog-posts/blog-post-list-skeleton";
import { Suspense } from "react";
import { ErrorMessage } from "@/components/error-message";
import {
  getPublishedPostsPage,
  PUBLIC_POSTS_PAGE_SIZE,
} from "@/lib/public-posts";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore articles about web development, React, and modern JavaScript",
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
  try {
    const response = await getPublishedPostsPage(
      1,
      search,
      tag,
      PUBLIC_POSTS_PAGE_SIZE,
    );

    return (
      <BlogPostList
        posts={response.posts}
        hasMore={response.hasMore}
        currentPage={page}
        total={response.total}
        search={search}
        tag={tag}
      />
    );
  } catch (error) {
    return <ErrorMessage error={error} />;
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam, search, tag } = await searchParams;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <BlogPostFilterBar />
      <Suspense
        key={`${page}-${search}-${tag}`}
        fallback={<BlogPostListSkeleton />}
      >
        <BlogPosts page={page} search={search} tag={tag} />
      </Suspense>
    </div>
  );
}
