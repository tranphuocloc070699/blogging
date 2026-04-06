import { Metadata } from "next";
import { PostDto } from "@/types/posts";
import NovelEditorWrapper from "@/components/posts/novel-editor-wrapper";
import BlogPostTags from "@/components/public/blog-posts/blog-post-tags";
import BlogPostBreadcrumb from "@/components/public/blog-posts/blog-post-breadcrumb";
import BlogPostAction from "@/components/public/blog-posts/blog-post-action";
import BlogPostDiscussion from "@/components/public/blog-posts/blog-post-discussion";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import postService from "@/services/modules/post-service";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { body } = await postService.getPostBySlug(slug);
    const post = body.data;
    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested post could not be found.",
      };
    }

    return {
      title: post.title,
      description: post.excerpt || post.title,
      keywords: post.keywords || "",
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.thumbnail ? [post.thumbnail] : [],
        type: "article",
        publishedTime: post.publishedAt
          ? new Date(post.publishedAt).toISOString()
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || post.title,
        images: post.thumbnail ? [post.thumbnail] : [],
      },
    };
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  let post: PostDto | null = null;

  try {
    const { slug } = await params;
    const session = await auth();
    const accessToken = (session as any)?.accessToken as string | undefined;

    const { body } = await postService.getPostBySlug(slug, accessToken);
    post = body.data;
  } catch (error) {
    console.error("Failed to load post detail:", error);
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

          <header className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
          </header>

          {post.excerpt && (
            <div className="mb-8 max-w-4xl mx-auto">
              <p className="text-base text-gray-500 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}
          <Separator />
          {/* Article Content */}
          <article className="mb-8">
            <div className="prose prose-lg max-w-none [&_.editor-wrapper]:border-0 [&_.ProseMirror]:outline-none [&_ul]:px-4 [&_ol]:px-4">
              <NovelEditorWrapper
                value={post.content}
                readOnly
              />
            </div>
          </article>

          {/* Fixed Like and Share buttons at bottom */}
          <BlogPostAction
            postId={post.id}
            initialLikesCount={post.likesCount}
            initialIsLiked={post.isLiked}
            initialCommentCount={post.commentsCount}
          />

          {/* Tags at the bottom */}
          <BlogPostTags terms={post.terms} />

          {/* Discussion / Comments */}
          <BlogPostDiscussion postId={post.id} />
        </div>
      </main>
    </div>
  );
}
