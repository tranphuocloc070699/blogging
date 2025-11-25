import { formatDate } from '@/lib/string-util';
import { PostDashboardDto } from '@/types/posts';
import { Check, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostItemProps {
        post: PostDashboardDto;
}

const BlogPostItem = ({ post }: BlogPostItemProps) => {

        const isRead = false;
        return (
                <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                        <div className="flex flex-col md:flex-row gap-4 mb-10 transition-colors ">

                                {/* Thumbnail */}
                                <div className="relative w-full md:w-40 h-48 md:h-28 flex-shrink-0  bg-gray-200">
                                        {post.thumbnail ? (
                                                <Image
                                                        src={post.thumbnail}
                                                        alt={post.title}
                                                        fill
                                                        className="rounded-md object-cover transition-transform duration-300"
                                                />
                                        ) : (
                                                <div className="w-full h-full bg-gray-300" />
                                        )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col  flex-1">
                                        {/* Title */}
                                        <h2 className="font-semibold text-xl line-clamp-2 mb-0 group-hover:text-blue-600 transition-colors">
                                                {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mt-0 leading-5">
                                                {post.excerpt}
                                        </p>

                                        {/* Meta info */}
                                        <div className="flex items-center justify-between  flex-wrap gap-2 md:mt-auto mt-4">
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span>{formatDate(post.publishedAt)}</span>
                                                        {/* <span>•</span>
                                                        <div className="flex items-center gap-1">
                                                                <Eye className="w-4 h-4" />
                                                                <span>{viewCount} views</span>
                                                        </div> */}
                                                        <span>•</span>
                                                        <div className="flex items-center gap-1">
                                                                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-black text-black' : ''}`} />
                                                                <span>{post.likesCount || 0}</span>
                                                        </div>
                                                </div>
                                                {isRead && (
                                                        <div className="flex items-center gap-1 text-sm text-blue-600">
                                                                <span>read</span>
                                                                <Check className="w-4 h-4" />
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        </div>
                </Link>
        );
};

export default BlogPostItem;