import Link from 'next/link';
import PostThumbnail from './PostThumbnail';
// import PostMeta from './PostMeta';
import { Badge } from '@/components/ui/badge';
import type { SerializedPost } from '@/types/posts';

interface PostItemProps {
  post: SerializedPost;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="md:flex">
          <div className="md:w-64 md:flex-shrink-0">
            <PostThumbnail
              src={post.thumbnail}
              alt={post.title}
              className="w-full !h-48 md:h-full object-cover"
            />
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-0 hover:underline line-clamp-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>

            <div className="flex items-center justify-between mt-auto">
              {/* <PostMeta date={post.publishedAt} /> */}
              <div className="flex gap-2 flex-wrap">
                {post.terms?.slice(0, 3).map((term) => (
                  <Badge key={term.id} variant="outline" className="rounded-full">
                    {term.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
