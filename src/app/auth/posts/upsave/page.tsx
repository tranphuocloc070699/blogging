"use client";

import NovelEditorWrapper from "@/components/posts/novel-editor-wrapper";
import BottomActionBar from "@/components/posts/upsave/bottom-action-bar";
import PostUpsaveExcerpt from "@/components/posts/upsave/post-upsave-excerpt";
import PostUpsaveTitle from "@/components/posts/upsave/post-upsave-title";
import { routes } from "@/config/routes";
import MinimalLayout from "@/layouts/minimal-layout";
import { cn } from "@/lib/utils";
import postService from "@/services/modules/post-service";
import { useTermStore } from "@/store/term.store";
import { ArrowLeft, CalendarIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useSession } from "next-auth/react";
import resourceService from "@/services/modules/resource-service";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const DRAFT_STORAGE_KEY = "post_draft_create";

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  termIds: number[];
  status: "DRAFT" | "PUBLISHED";
  keywords: string;
  publishedAt?: string | null;
}

export default function UpsavePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isEditMode = !!postId;

  const [thumbnail, setThumbnail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [publishedDate, setPublishedDate] = useState<Date>(new Date());
  // const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  const draftRestoredRef = useRef(false);
  const terms = useTermStore.getState().terms;

  const { data: session, status } = useSession();
  const accessToken = (session as any)?.accessToken;

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/");
      }
    }
  }, [status, session]);

  // Debug logging for selectedTermIds changes

  // Form data for settings
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "PUBLISHED",
    keywords: "",
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
        const { body } = await postService.getPostByIdForUpsave(
          parseInt(postId),
        );
        const post = body.data;
        console.log({ post });

        // Set all form fields

        setThumbnail(post.thumbnail || "");

        // Extract term IDs from post terms

        if (post.publishedAt) {
          setPublishedDate(new Date(post.publishedAt));
        }

        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          thumbnail: post.thumbnail,
          termIds: post.termIds,
          keywords: post.keywords,
          publishedAt: post.publishedAt ?? null,
        });

        // setIsSlugManuallyEdited(true);
      } catch (error: any) {
        console.error("Failed to load post:", error);
        toast.error(error?.message || "Failed to load post");
        router.push(routes.auth.posts.dashboard);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [isEditMode, postId, router]);

  // On mount (create mode only): check for saved draft
  useEffect(() => {
    if (isEditMode) {
      draftRestoredRef.current = true;
      return;
    }
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!saved) {
      draftRestoredRef.current = true;
      return;
    }
    try {
      const draft = JSON.parse(saved);
      const hasContent = draft.title || draft.content || draft.excerpt;
      if (hasContent) {
        setShowRestoreDialog(true);
      } else {
        draftRestoredRef.current = true;
      }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      draftRestoredRef.current = true;
    }
  }, []);

  // Auto-save draft to localStorage on form change (create mode only)
  useEffect(() => {
    if (isEditMode || !draftRestoredRef.current) return;
    const hasContent = formData.title || formData.content || formData.excerpt;
    if (hasContent) {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ ...formData, thumbnail }),
      );
    }
  }, [formData, thumbnail]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  useEffect(() => {
    const keywords = formData.termIds.reduce((acc, id) => {
      const term = terms.find((term) => term.id === id);
      if (term?.name) {
        acc.push(term.name);
      }
      return acc;
    }, [] as string[]);
    handleFormDataChange({ keywords: keywords.join(", ") });
  }, [formData.termIds]);

  // Prevent default drag behavior globally
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefaults);
    window.addEventListener("drop", preventDefaults);

    return () => {
      window.removeEventListener("dragover", preventDefaults);
      window.removeEventListener("drop", preventDefaults);
    };
  }, []);

  function handleFormDataChange(data: Partial<PostFormData>) {
    setFormData((prev) => ({ ...prev, ...data }));
  }

  // Handle thumbnail upload
  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    setUploading(true);
    try {
      if (!accessToken) {
        throw new Error("Please login to upload images");
      }
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      const response = await resourceService.uploadFile(
        file,
        accessToken,
        "thumbnail",
      );
      setThumbnail(response.url);
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
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
      toast.error("Title is required");
      return;
    }

    if (!formData.content.trim() || formData.content === "{}") {
      toast.error("Content is required");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (!formData.keywords.trim()) {
      toast.error("Keywords is required");
      return;
    }

    // setIsSaving(true);
    try {
      let finalExcerpt = formData.excerpt;
      if (!finalExcerpt) {
        try {
          const parsedContent = JSON.parse(formData.content);
          const firstParagraph = parsedContent.content?.find(
            (node: any) => node.type === "paragraph" && node.content,
          );
          if (firstParagraph) {
            finalExcerpt = firstParagraph.content
              .map((c: any) => c.text || "")
              .join("")
              .slice(0, 200);
          }
        } catch {
          finalExcerpt = "";
        }
      }

      const postData: PostFormData = {
        ...formData,
        excerpt: finalExcerpt,
        thumbnail,
        publishedAt: new Date(
          publishedDate.getFullYear(),
          publishedDate.getMonth(),
          publishedDate.getDate(),
          12,
          0,
          0,
        ).toISOString(),
      };

      if (isEditMode && postId) {
        await postService.updatePost(accessToken, parseInt(postId), postData);
        toast.success(`Post updated successfully!`);
      } else {
        await postService.createPost(accessToken, postData);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        toast.success(
          `Post ${formData.status === "DRAFT" ? "saved as draft" : "published"} successfully!`,
        );
      }

      router.push(routes.auth.posts.dashboard);
    } catch (error: any) {
      console.error("Save post error:", error);
      toast.error(error?.message || "Failed to save post");
    } finally {
      // setIsSaving(false);
    }
  };

  return (
    <MinimalLayout className={"relative"}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mx-auto max-w-[768px] px-6 py-8 pb-32 animate-pulse">
          {/* Title skeleton */}
          <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4" />
          {/* Excerpt skeleton */}
          <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-4" />
          {/* Date skeleton */}
          <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-8" />
          {/* Thumbnail skeleton — matches 168×190 */}
          <div className="w-[168px] h-[190px] bg-gray-200 rounded-lg mb-8" />
          {/* Editor skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <button
          onClick={() => {
            if (!isEditMode && localStorage.getItem(DRAFT_STORAGE_KEY)) {
              pendingNavigationRef.current = () =>
                router.push(routes.auth.posts.dashboard);
              setShowDiscardDialog(true);
            } else {
              router.push(routes.auth.posts.dashboard);
            }
          }}
          className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg border border-gray-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div
        className={cn(
          "mx-auto max-w-[768px] px-6 py-8 pb-32",
          isLoading && "hidden",
        )}
      >
        <div className="space-y-4 mb-8">
          {/* Tags/Terms - Preview selected terms */}

          {/* Title Input */}

          <PostUpsaveTitle
            title={formData.title}
            onFormDataChange={handleFormDataChange}
          />
          {/* Excerpt Input */}
          <PostUpsaveExcerpt
            excerpt={formData.excerpt}
            onFormDataChange={handleFormDataChange}
          />

          {/* Publish Date Picker */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-0 h-auto font-normal text-sm text-gray-600 hover:text-gray-900 hover:bg-transparent"
                >
                  <CalendarIcon className="w-4 h-4" />
                  {format(publishedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar
                  className="w-full"
                  mode="single"
                  selected={publishedDate}
                  onSelect={(date) => date && setPublishedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
                "flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                "w-[168px] h-[190px]",
                uploading
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                  : isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100",
              )}
            >
              <div className="flex flex-col items-center justify-center px-2 text-center">
                <Upload
                  className={cn(
                    "w-8 h-8 mb-2",
                    uploading
                      ? "text-gray-400"
                      : isDragging
                        ? "text-blue-500"
                        : "text-gray-500",
                  )}
                />
                <p className="text-xs text-gray-500 font-semibold">
                  {uploading
                    ? "Uploading..."
                    : isDragging
                      ? "Drop here"
                      : "Thumbnail"}
                </p>
                <p className="text-xs text-gray-400 mt-1">168×190</p>
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
            <div className="relative w-[168px] h-[190px]">
              <Image
                src={thumbnail}
                alt="Cover"
                width={168}
                height={190}
                className="w-full h-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setThumbnail("")}
                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <Separator />

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
              const term = terms.find((t) => t.id === termId);
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
      <BottomActionBar
        onSave={handleSave}
        onFormDataChange={handleFormDataChange}
        postKeywords={formData.keywords}
        termIds={formData.termIds}
        postContent={formData.content}
        postStatus={formData.status}
        postSlug={formData.slug}
        isEditMode={postId != null}
      />

      {/* Restore draft dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore unsaved draft?</DialogTitle>
            <DialogDescription>
              You have an unfinished post saved locally. Would you like to
              continue where you left off?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem(DRAFT_STORAGE_KEY);
                draftRestoredRef.current = true;
                setShowRestoreDialog(false);
              }}
            >
              Discard
            </Button>
            <Button
              onClick={() => {
                try {
                  const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
                  if (saved) {
                    const draft = JSON.parse(saved);
                    const { thumbnail: savedThumb, ...savedForm } = draft;
                    setFormData((prev) => ({ ...prev, ...savedForm }));
                    if (savedThumb) setThumbnail(savedThumb);
                  }
                } catch {}
                draftRestoredRef.current = true;
                setShowRestoreDialog(false);
              }}
            >
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discard draft dialog (back button) */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave without saving?</DialogTitle>
            <DialogDescription>
              Your draft will be kept locally. You can restore it next time you
              create a post.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDiscardDialog(false)}
            >
              Stay
            </Button>
            <Button
              onClick={() => {
                setShowDiscardDialog(false);
                pendingNavigationRef.current?.();
              }}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MinimalLayout>
  );
}
