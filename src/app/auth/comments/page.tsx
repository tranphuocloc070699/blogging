'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui';
import { useClientSession } from '@/hooks/use-client-session';
import { formatDistanceToNow } from 'date-fns';

const pageHeader = {
  title: 'Comments',
  breadcrumb: [
    { href: '/', name: 'Home' },
    { name: 'Comments' },
  ],
};

interface CommentItem {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  postSlug: string;
  postTitle: string;
  user: {
    id: number;
    username: string;
    email: string | null;
  };
  parentId: number | null;
  likesCount: number;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);
  const session = useClientSession();

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const res = await fetch('/api/admin/comments', {
        headers: {
          Authorization: `Bearer ${session?.accessToken ?? ''}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.data ?? []);
      } else {
        toast.error('Failed to load comments');
      }
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      // Re-use the existing delete endpoint (admin-only)
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken ?? ''}`,
        },
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        toast.success('Comment deleted');
      } else {
        toast.error('Failed to delete comment');
      }
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <div className="@container">
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-full">
            <div className="rounded-lg border border-gray-200 bg-white">
              {loading ? (
                <div className="p-6 text-center">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No comments yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Comment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Post
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Likes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {comments.map((comment) => (
                        <tr key={comment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {comment.user.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              {comment.user.email ?? '—'}
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {comment.content}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a
                              href={`/posts/${comment.postSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600 hover:underline max-w-[160px] truncate"
                            >
                              <span className="truncate">{comment.postTitle}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              comment.parentId
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {comment.parentId ? 'Reply' : 'Comment'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {comment.likesCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(comment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
}
