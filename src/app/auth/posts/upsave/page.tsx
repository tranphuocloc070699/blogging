'use client';

import NovelEditorWrapper from '@/components/posts/novel-editor-wrapper';
import BottomActionBar from "@/components/posts/upsave/bottom-action-bar";
import PostUpsaveExcerpt from '@/components/posts/upsave/post-upsave-excerpt';
import PostUpsaveTitle from '@/components/posts/upsave/post-upsave-title';
import { routes } from '@/config/routes';
import MinimalLayout from '@/layouts/minimal-layout';
import { cn } from '@/lib/utils';
import postService from '@/services/modules/post-service';
import { useTermStore } from '@/store/term.store';
import { ArrowLeft, Calendar, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useSession } from 'next-auth/react';
import resourceService from '@/services/modules/resource-service';

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  termIds: number[];
  status: 'DRAFT' | 'PUBLISHED';
  keywords: string;
}

export default function UpsavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEditMode = !!postId;


  const [thumbnail, setThumbnail] = useState('');
  const [uploading, setUploading] = useState(false);
  // const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const terms = useTermStore.getState().terms;


  const { data: session, status } = useSession()
  const accessToken = (session as any)?.accessToken;




  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/");
      }
    }
  }, [status, session])


  // Debug logging for selectedTermIds changes


  // Form data for settings
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'PUBLISHED',
    keywords: '',
    termIds: [],
  });


  // Track if user has manually edited slug
  // const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);



  // Load existing post data if in edit mode
  useEffect(() => {
    const loadPost = async () => {
      if (!isEditMode || !postId) return;

      setIsLoading(true);
      try {
        const { body } = await postService.getPostByIdForUpsave(parseInt(postId));
        const post = body.data;
        console.log({ post })

        // Set all form fields

        setThumbnail(post.thumbnail || '');

        // Extract term IDs from post terms

        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          thumbnail: post.thumbnail,
          termIds: post.termIds,
          keywords: post.keywords
        });

        // setIsSlugManuallyEdited(true);
      } catch (error: any) {
        console.error('Failed to load post:', error);
        toast.error(error?.message || 'Failed to load post');
        router.push(routes.auth.posts.dashboard);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [isEditMode, postId, router]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  useEffect(() => {
    const keywords = formData.termIds.reduce((acc, id) => {
      const term = terms.find(term => term.id === id);
      if (term?.name) {
        acc.push(term.name);
      }
      return acc;
    }, [] as string[]);
    handleFormDataChange({ keywords: keywords.join(', ') });

  }, [formData.termIds]);






  // Prevent default drag behavior globally
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);

    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  function handleFormDataChange(data: Partial<PostFormData>) {

    setFormData(prev => ({ ...prev, ...data }))

  }


  // Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      if (!accessToken) {
        throw new Error('Please login to upload images');
      }
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await resourceService.uploadFile(file, accessToken)
      setThumbnail(response.url);
      toast.success('Thumbnail uploaded successfully');
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file) return;
      handleThumbnailUpload(file);
    }
  };

  // Save post
  const handleSave = async () => {

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim() || formData.content === '{}') {
      toast.error('Content is required');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }
    if (!formData.keywords.trim()) {
      toast.error('Keywords is required');
      return;
    }

    // setIsSaving(true);
    try {
      let finalExcerpt = formData.excerpt;
      if (!finalExcerpt) {
        try {
          const parsedContent = JSON.parse(formData.content);
          const firstParagraph = parsedContent.content?.find((node: any) =>
            node.type === 'paragraph' && node.content
          );
          if (firstParagraph) {
            finalExcerpt = firstParagraph.content
              .map((c: any) => c.text || '')
              .join('')
              .slice(0, 200);
          }
        } catch {
          finalExcerpt = '';
        }
      }

      const postData: PostFormData = {
        ...formData,
        excerpt: finalExcerpt,
        thumbnail,
      };

      if (isEditMode && postId) {
        await postService.updatePost(accessToken, parseInt(postId), postData);
        toast.success(`Post updated successfully!`);
      } else {
        await postService.createPost(accessToken, postData);
        toast.success(`Post ${formData.status === 'DRAFT' ? 'saved as draft' : 'published'} successfully!`);
      }

      router.push(routes.auth.posts.dashboard);
    } catch (error: any) {
      console.error('Save post error:', error);
      toast.error(error?.message || 'Failed to save post');
    } finally {
      // setIsSaving(false);
    }
  };

  return (
    <MinimalLayout className={"relative"}>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">Loading post...</p>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button
          onClick={() => router.push(routes.auth.posts.dashboard)}
          className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="mx-auto max-w-[768px] px-6 py-8 pb-32">
        <div className="space-y-4 mb-8">
          {/* Tags/Terms - Preview selected terms */}


          {/* Title Input */}

          <PostUpsaveTitle title={formData.title} onFormDataChange={handleFormDataChange} />
          {/* Excerpt Input */}
          <PostUpsaveExcerpt excerpt={formData.excerpt} onFormDataChange={handleFormDataChange} />

          {/* Meta Info - Date placeholder */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="mb-8">
          {!thumbnail ? (
            <label
              htmlFor="thumbnail-upload"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                uploading
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  : isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
              )}
            >
              <div className="flex flex-col items-center justify-center max-w-[50%]">
                <Upload className={cn(
                  "w-12 h-12 mb-3",
                  uploading ? "text-gray-400" :
                    isDragging ? "text-blue-500" : "text-gray-500"
                )} />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">
                    {uploading ? 'Uploading...' :
                      isDragging ? 'Drop image here' :
                        'Thumbnail'}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                id="thumbnail-upload"
                type="file"
                className="hidden"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleThumbnailUpload(file);
                  }
                }}
              />
            </label>
          ) : (
            <section className={"max-w-[768px]  mx-auto"}>
              <div className="relative">
                <Image
                  src={thumbnail}
                  alt="Cover"
                  width={768}
                  height={300}
                  className="h-auto w-full  rounded-lg shadow-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setThumbnail('')}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Editor */}
        <div className="prose prose-lg max-w-none [&_ul]:px-4 [&_ol]:px-4">
          <NovelEditorWrapper
            value={formData.content}
            onChange={(value) => handleFormDataChange({ content: value })}
          />
        </div>


        {formData.termIds.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.termIds.map((termId) => {
              const term = terms.find(t => t.id === termId);
              if (!term) return null;
              return (
                <span

                  key={term.id}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {term.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
      <BottomActionBar onSave={handleSave} onFormDataChange={handleFormDataChange} postKeywords={formData.keywords} termIds={formData.termIds} postContent={formData.content} postStatus={formData.status} postSlug={formData.slug} isEditMode={postId != null} />

    </MinimalLayout>
  );
}
