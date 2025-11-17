import React from 'react';
import { routes } from "@/config/routes";
import PostPageHeader from "@/components/posts/post-page-header";
import UpsavePost from "@/components/posts/upsave/upsave-post";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Post - Blog CMS',
  description: 'Create a new blog post',
};

const pageHeader = {
  title: 'Create Post',
  breadcrumb: [
    {
      href: routes.auth.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.auth.posts.dashboard,
      name: 'Posts',
    },
    {
      name: "Create",
    },
  ],
};

const CreatePostPage = () => {
  return (
    <>
      <PostPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
        showBackButton={true}
        backHref={routes.auth.posts.dashboard}
      />
      <UpsavePost />
    </>
  );
};

export default CreatePostPage;