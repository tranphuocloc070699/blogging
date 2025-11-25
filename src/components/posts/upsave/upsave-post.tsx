import React from 'react';
import CreateEditPost from '../create-edit';

interface UpsavePostProps {
  slug?: string;
  post?: any;
}

const UpsavePost: React.FC<UpsavePostProps> = ({ slug, post }) => {
  return (
    <div component-name="UpsavePost">
      <CreateEditPost slug={slug} post={post} />
    </div>
  );
};

export default UpsavePost;