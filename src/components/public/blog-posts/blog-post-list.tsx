import { PostDashboardDto } from '@/types/posts'
import React from 'react'
import LoadMore from './load-more'
import BlogPostItem from './blog-post-item'

interface BlogPostListProps {
	posts: PostDashboardDto[];
	hasMore?: boolean;
	currentPage?: number;
	total?: number;
}

const BlogPostList = ({ posts, hasMore = false, currentPage = 1 }: BlogPostListProps) => {

	return (
		<div className="flex flex-col">
			{posts.map((post) => (
				<BlogPostItem key={post.id} post={post} />
			))}

			{hasMore && (
				<LoadMore currentPage={currentPage} />
			)}
		</div>
	);
};

export default BlogPostList;
