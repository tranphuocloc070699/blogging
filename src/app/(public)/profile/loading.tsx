import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const BlogPostItemSkeleton = () => {
	return (
		<div className="flex flex-col md:flex-row gap-4 mb-10 animate-pulse">
			{/* Thumbnail Skeleton */}
			<div className="relative w-full md:w-40 h-48 md:h-28 flex-shrink-0 bg-gray-200 rounded" />

			{/* Content Skeleton */}
			<div className="flex flex-col flex-1 gap-2">
				{/* Title Skeleton */}
				<div className="h-6 bg-gray-200 rounded w-3/4 mb-1" />
				<div className="h-6 bg-gray-200 rounded w-1/2" />

				{/* Excerpt Skeleton */}
				<div className="h-4 bg-gray-200 rounded w-full mt-1" />
				<div className="h-4 bg-gray-200 rounded w-5/6" />

				{/* Meta Info Skeleton */}
				<div className="flex items-center gap-3 mt-auto pt-2">
					<div className="h-4 bg-gray-200 rounded w-20" />
					<div className="h-4 w-1 bg-gray-200 rounded" />
					<div className="h-4 bg-gray-200 rounded w-24" />
					<div className="h-4 w-1 bg-gray-200 rounded" />
					<div className="h-4 bg-gray-200 rounded w-16" />
				</div>
			</div>
		</div>
	);
};

const ProfileDetailSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
				<div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="animate-pulse">
							<div className="h-4 bg-gray-200 rounded w-20 mb-2" />
							<div className="h-5 bg-gray-200 rounded w-32" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

const PostListSkeleton = ({ title, description }: { title: string; description: string }) => {
	return (
		<Card>
			<CardHeader>
				<div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
				<div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
			</CardHeader>
			<CardContent>
				<BlogPostItemSkeleton />
				<BlogPostItemSkeleton />
				<BlogPostItemSkeleton />
			</CardContent>
		</Card>
	);
};

const Loading = () => {
	return (
		<div className='max-w-3xl mx-auto px-4 md:px-0'>
			{/* Breadcrumb Skeleton */}
			<div className="flex items-center gap-2 mb-4 animate-pulse">
				<div className="h-4 bg-gray-200 rounded w-16" />
				<div className="h-4 bg-gray-200 rounded w-1" />
				<div className="h-4 bg-gray-200 rounded w-20" />
			</div>

			{/* Header Skeleton */}
			<div className="flex items-center justify-between md:mt-6 mt-4">
				<div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
				<div className="h-9 bg-gray-200 rounded w-24 animate-pulse" />
			</div>

			{/* Tabs Skeleton */}
			<div className='md:mt-6 mt-4'>
				{/* Tabs List Skeleton */}
				<div className="grid w-full grid-cols-3 gap-2 mb-6 animate-pulse">
					<div className="h-10 bg-gray-200 rounded" />
					<div className="h-10 bg-gray-200 rounded" />
					<div className="h-10 bg-gray-200 rounded" />
				</div>

				{/* Tabs Content Skeleton - Default to Profile Detail */}
				<ProfileDetailSkeleton />
			</div>
		</div>
	);
};

export default Loading;
