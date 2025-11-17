'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import PostItem from './PostItem';
import { Loader2 } from 'lucide-react';
import type { SerializedPost } from '@/types/posts';

interface PostListProps {
  initialPosts: SerializedPost[];
  searchQuery: string;
  selectedTag: string;
}

export default function PostList({
  initialPosts,
  searchQuery,
  selectedTag,
}: PostListProps) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', searchQuery, selectedTag],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        size: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedTag !== 'All' && { tag: selectedTag }),
      });

      const res = await fetch(`/api/posts/published?${params}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const result = await res.json();

      // Handle the API response structure: { status, message, data: { content: [...] } }
      const posts = result.data?.content || result.data || [];

      // Serialize the posts
      return posts.map((post: any) => ({
        id: Number(post.id),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        thumbnail: post.thumbnail,
        publishedAt: post.publishedAt,
        terms: post.terms || [],
      }));
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
    initialPageParam: 0,
    initialData: {
      pages: [initialPosts],
      pageParams: [0],
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}

      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage && <Loader2 className="w-6 h-6 animate-spin" />}
        </div>
      )}
    </div>
  );
}
