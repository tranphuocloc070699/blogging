'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { routes } from '@/config/routes';
import PostPageHeader from '@/components/posts/post-page-header';
import UpsavePost from '@/components/posts/upsave/upsave-post';
import postService from '@/services/modules/post-service';
const pageHeader = {
  title: 'Edit Post',
  breadcrumb: [
    {
      href: routes.auth.dashboard,
      name: 'Dashboard',
    },
    {
      href: routes.auth.posts.dashboard,
      name: 'Posts',
    },
    {
      name: 'Edit',
    },
  ],
};

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const id = parseInt(params["id"] as string);
        const { body } = await postService.getPostById(id);
        setPost(body.data);
      } catch (error) {
        console.error('Failed to load post:', error);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (params["id"]) {
      loadPost();
    }
  }, [params["id"]]);

  if (loading) {
    return (
      <>
        <PostPageHeader
          title={pageHeader.title}
          breadcrumb={pageHeader.breadcrumb}
          showBackButton={true}
          backHref={routes.auth.posts.dashboard}
        />
        <div className="@container">
          <div className="p-6 text-center">Loading post...</div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <PostPageHeader
          title={pageHeader.title}
          breadcrumb={pageHeader.breadcrumb}
          showBackButton={true}
          backHref={routes.auth.posts.dashboard}
        />
        <div className="@container">
          <div className="p-6 text-center text-red-600">Post not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PostPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
        showBackButton={true}
        backHref={routes.posts.dashboard}
      />
      <UpsavePost slug={params["id"] as string} post={post} />
    </>
  );
}
