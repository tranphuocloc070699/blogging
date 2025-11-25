import { Metadata } from 'next';
import { PostDto } from '@/types/posts';
import Image from 'next/image';
import NovelEditorWrapper from '@/components/posts/novel-editor-wrapper';
import BlogPostTags from '@/components/public/blog-posts/blog-post-tags';
import BlogPostBreadcrumb from '@/components/public/blog-posts/blog-post-breadcrumb';
import BlogPostAction from '@/components/public/blog-posts/blog-post-action';
import postService from '@/services/modules/post-service';
import { notFound } from 'next/navigation';
import { getAuthSession } from '@/action/auth.action';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await postService.getPostBySlug(slug);

    const post = res.body.data as PostDto;
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      };
    }

    return {
      title: post.title,
      description: post.excerpt || post.title,
      keywords: post.keywords || '',
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.thumbnail ? [post.thumbnail] : [],
        type: 'article',
        publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: post.thumbnail ? [post.thumbnail] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const session = await getAuthSession();
  console.log({ session })
  let post: PostDto | null = null;

  try {
    const { slug } = await params;
    const res = await postService.getPostBySlug(slug, session?.accessToken);
    post = res.body.data as PostDto;

  } catch (error) {
    console.log({ error })
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <main className="w-full px-4 lg:px-0 py-4 lg:py-8">
        <div className="mx-auto w-full lg:w-[768px]">
          <BlogPostBreadcrumb slug={post.slug} publishedAt={post.publishedAt} />

          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
          </header>

          {post.excerpt && (
            <div className="text-center mb-8 max-w-4xl mx-auto">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {post.thumbnail && (
            <div className="mb-8 flex justify-center">
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={500}
                height={300}
                className="rounded-lg object-cover w-full max-w-[768px] h-auto"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="mb-8">
            <div className="prose prose-lg max-w-none [&_.editor-wrapper]:border-0 [&_.ProseMirror]:outline-none [&_ul]:px-4 [&_ol]:px-4">
              <NovelEditorWrapper
                value={post.content}
                readOnly
              // className="pointer-events-none"
              />
            </div>
          </article>

          {/* Fixed Like and Share buttons at bottom */}
          <BlogPostAction
            postId={post.id}
            initialLikesCount={post.likesCount}
            initialIsLiked={post.isLiked}
          />

          {/* Tags at the bottom */}
          <BlogPostTags terms={post.terms} />
        </div>
      </main>
    </div>
  );
}