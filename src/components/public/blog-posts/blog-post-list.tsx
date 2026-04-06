"use client";

import { ListEmpty } from "@/components/list-empty";
import type { ApiResponse } from "@/lib/response";
import type { PostDashboardDto } from "@/types/posts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogPostItem from "./blog-post-item";
import LoadMore from "./load-more";

interface PublishedPostsPayload {
  posts: PostDashboardDto[];
  hasMore: boolean;
  total: number;
  currentPage: number;
}

interface BlogPostListProps {
  posts: PostDashboardDto[];
  hasMore?: boolean;
  currentPage?: number;
  total?: number;
  search?: string;
  tag?: string;
}

const PAGE_SIZE = 10;

async function fetchPostsPage(page: number, search?: string, tag?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: PAGE_SIZE.toString(),
  });

  if (search) {
    params.set("search", search);
  }

  if (tag) {
    params.set("tag", tag);
  }

  const response = await fetch(`/api/posts/published?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to load posts");
  }

  const payload = (await response.json()) as ApiResponse<PublishedPostsPayload>;
  return payload.data;
}

const BlogPostList = ({
  posts: initialPosts,
  hasMore: initialHasMore = false,
  currentPage = 1,
  search,
  tag,
}: BlogPostListProps) => {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(currentPage);
    setHasMore(initialHasMore);
  }, [currentPage, initialHasMore, initialPosts, search, tag]);

  useEffect(() => {
    posts.forEach((post) => {
      router.prefetch(`/posts/${post.slug}`);
    });
  }, [posts, router]);

  // Refresh server data when navigating back so likesCount / isLiked are up-to-date
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  useEffect(() => {
    if (currentPage <= 1) {
      return;
    }

    let active = true;

    const hydrateRequestedPages = async () => {
      setIsLoadingMore(true);

      try {
        const pages = await Promise.all(
          Array.from({ length: currentPage - 1 }, (_, index) =>
            fetchPostsPage(index + 2, search, tag),
          ),
        );

        if (!active) {
          return;
        }

        const mergedPosts = [
          ...initialPosts,
          ...pages.flatMap((result) => result?.posts ?? []),
        ];

        setPosts(mergedPosts);
        setHasMore(pages.at(-1)?.hasMore ?? initialHasMore);
      } finally {
        if (active) {
          setIsLoadingMore(false);
        }
      }
    };

    hydrateRequestedPages();

    return () => {
      active = false;
    };
  }, [currentPage, initialHasMore, initialPosts, search, tag]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const next = await fetchPostsPage(nextPage, search, tag);

      setPosts((currentPosts) => [...currentPosts, ...(next?.posts ?? [])]);
      setPage(nextPage);
      setHasMore(Boolean(next?.hasMore));

      const params = new URLSearchParams(window.location.search);
      params.set("page", nextPage.toString());
      window.history.replaceState(
        null,
        "",
        params.toString() ? `/?${params.toString()}` : "/",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (posts.length === 0) {
    return <ListEmpty />;
  }

  return (
    <div className="flex flex-col">
      {posts.map((post, index) => (
        <BlogPostItem
          key={`${post.id}-${post.slug}`}
          post={post}
          isPriority={index === 0 && page === 1}
        />
      ))}
      {hasMore && (
        <LoadMore isPending={isLoadingMore} onLoadMore={handleLoadMore} />
      )}
    </div>
  );
};

export default BlogPostList;
