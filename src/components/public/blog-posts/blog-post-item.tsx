"use client";
import { formatDate } from "@/lib/string-util";
import { PostDashboardDto } from "@/types/posts";
import { Check, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BlogPostItemProps {
  post: PostDashboardDto;
  isPriority?: boolean;
  isRead?: boolean;
}

const BlogPostItem = ({
  post,
  isPriority = false,
  isRead = false,
}: BlogPostItemProps) => {
  const router = useRouter();
  const detailHref = `/posts/${post.slug}`;

  const prefetchDetail = () => {
    router.prefetch(detailHref);
  };

  return (
    <Link
      key={post.id}
      href={detailHref}
      prefetch
      className="block group"
      onMouseEnter={prefetchDetail}
      onTouchStart={prefetchDetail}
    >
      <div className="flex flex-row gap-3 mb-6 transition-colors">
        {/* Image Container - Fixed Aspect Ratio */}
        <div className="relative w-24 h-20 md:w-40 md:h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden aspect-[6/5]">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={"Blog post thumbnail"}
              fill
              sizes="(max-width: 768px) 96px, 160px"
              quality={75}
              priority={isPriority}
              loading={isPriority ? "eager" : "lazy"}
              fetchPriority={isPriority ? "high" : "auto"}
              className="rounded-md object-cover"
              placeholder="blur"
              blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 112'%3E%3Crect fill='%23f3f4f6' width='160' height='112'/%3E%3C/svg%3E"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="font-semibold text-base md:text-xl line-clamp-2 text-black group-hover:text-gray-600 transition-colors leading-snug pb-0">
            {post.title}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-5 mt-0">
            {post.excerpt}
          </p>

          {/* Footer - Date, Likes, Read Status */}
          <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Heart
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    post.isLiked ? "fill-black text-black" : ""
                  }`}
                />
                <span>{post.likesCount || 0}</span>
              </div>
              {post?.commentsCount != undefined && post.commentsCount > 0 ? (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{post.commentsCount}</span>
                </div>
              ) : (
                <></>
              )}
            </div>

            {/* Read Indicator */}
            {isRead && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <span>read</span>
                <Check className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostItem;
