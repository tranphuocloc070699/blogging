import React from 'react';

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

                                </div>
                        </div>
                </div>
        );
};

const FilterBarSkeleton = () => {
        return (
                <div className="mb-10 animate-pulse">
                        {/* Desktop View */}
                        <div className="hidden md:flex items-center gap-4 justify-between">
                                {/* Tags Skeleton */}
                                <div className="h-10 bg-gray-200 rounded w-[220px]" />

                                {/* Search Input Skeleton */}
                                <div className="h-10 bg-gray-200 rounded-3xl w-64" />
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden flex items-center gap-2 justify-between h-10">
                                {/* Tags Select Skeleton */}
                                <div className="h-10 bg-gray-200 rounded w-[220px]" />

                                {/* Search Button Skeleton */}
                                <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
                        </div>
                </div>
        );
};

const Loading = () => {
        return (
                <div className="max-w-3xl mx-auto px-4 md:px-0">
                        <FilterBarSkeleton />

                        {/* Multiple skeleton post items */}
                        <div className="flex flex-col">
                                <BlogPostItemSkeleton />
                                <BlogPostItemSkeleton />
                                <BlogPostItemSkeleton />
                        </div>
                </div>
        );
};

export default Loading;