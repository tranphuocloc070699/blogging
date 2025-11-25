// app/post/[slug]/loading.tsx
export default function Loading() {
        return (
                <div className="min-h-screen bg-white">
                        <main className="w-full px-4 lg:px-0 py-4 lg:py-8">
                                <div className="mx-auto w-full lg:w-[768px] animate-pulse">
                                        <div className="flex items-center justify-between">
                                                {/* Breadcrumb Skeleton - Hidden on mobile */}
                                                <div className="hidden md:block mb-6">
                                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                                </div>

                                                {/* Date Skeleton */}
                                                <div className="flex justify-end mb-4">
                                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                </div>
                                        </div>

                                        {/* Title Skeleton */}
                                        <div className="text-center mb-8">
                                                <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                                                <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
                                        </div>

                                        {/* Excerpt Skeleton */}
                                        <div className="text-center mb-8 max-w-4xl mx-auto space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                                                <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
                                        </div>

                                        {/* Thumbnail Skeleton */}
                                        <div className="mb-8">
                                                <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-200 rounded-lg"></div>
                                        </div>

                                        {/* Content Skeleton */}
                                        <div className="mb-8 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>

                                                <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                                                <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
                                                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        </div>

                                        {/* Buttons Skeleton */}
                                        <div className="flex items-center justify-center gap-4 mb-8">
                                                <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                                                <div className="h-10 bg-gray-200 rounded-full w-20"></div>
                                        </div>

                                        {/* Tags Skeleton */}
                                        <div className="pt-6 border-t border-gray-200">
                                                <div className="flex flex-wrap gap-2">
                                                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                                                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                                                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                                                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                                                </div>
                                        </div>
                                </div>
                        </main>
                </div>
        );
}