'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { routes } from "@/config/routes";
import PostPageHeader from "@/components/posts/post-page-header";
import { Button } from '@/components/ui';
import postService from '@/services/modules/post-service';
import { useClientSession } from '@/hooks/use-client-session';

const pageHeader = {
  title: 'Posts',
  breadcrumb: [
    {
      href: routes.auth.dashboard,
      name: "Dashboard",
    },
    {
      name: 'Posts',
    },
  ],
};

interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const PostsPage = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const session = useClientSession();

  const loadPosts = async () => {
    try {
      const { body } = await postService.getAllPosts();
      setPosts(Array.isArray(body.data) ? body.data as PostSummary[] : []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prevent duplicate API calls in development (React Strict Mode)
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    loadPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(session!.accessToken ?? "", id);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <PostPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
        showCreateButton={true}
        createHref={routes.auth.posts.upsave}
      />

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
          <div className="col-span-full">
            <div className="rounded-lg border border-gray-200 bg-white">
              {loading ? (
                <div className="p-6 text-center">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No posts found. Create your first post to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Published
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{post.title}</div>
                            <div className="text-gray-500 text-xs mt-1 truncate max-w-md">
                              {post.excerpt}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {post.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.publishedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(post.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`${routes.auth.posts.upsave}?id=${post.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostsPage;