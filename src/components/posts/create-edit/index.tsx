"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Element } from "react-scroll";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import postService from "@/services/modules/post-service";
import { routes } from "@/config/routes";
import FormNav, { formParts } from "@/components/form/form-nav";
import PostSummary from "./post-summary";
import PostContent from "./post-content";
import PostThumbnail from "./post-thumbnail";
import PostTerms from "./post-terms";
// Form validation schema
const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt must be less than 500 characters"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["DRAFT", "PUBLISHED"], {
    message: "Status is required",
  }),
  thumbnail: z.string().optional(),
  termIds: z.array(z.number()).optional(),
  keywords: z
    .string()
});

type PostFormData = z.infer<typeof postFormSchema>;

// Default form values
const defaultValues: PostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "DRAFT",
  thumbnail: "",
  termIds: [],
  keywords: ""
};

// Component mapping for sections
const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: PostSummary,
  [formParts.content]: PostContent,
  [formParts.thumbnail]: PostThumbnail,
  [formParts.terms]: PostTerms,
};

interface CreateEditPostProps {
  slug?: string;
  className?: string;
  post?: Partial<PostFormData>;
}

export default function CreateEditPost({
  slug,
  post,
  className,
}: CreateEditPostProps) {
  const [isLoading, setLoading] = useState(false);
  // const [isDraft, setIsDraft] = useState(false);
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: post ? { ...defaultValues, ...post } : defaultValues,
  });

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    setLoading(true);
    try {
      if (slug) {
        // Update existing post
        await postService.updatePost(parseInt(slug), data);
        toast.success(
          `Post successfully updated${data.status === "DRAFT" ? " as draft" : " and published"}!`,
        );
      } else {
        // Create new post
        await postService.createPost(data);
        toast.success(
          `Post successfully created${data.status === "DRAFT" ? " as draft" : " and published"}!`,
        );
        // Reset form after successful creation
        methods.reset(defaultValues);
        // Redirect to posts list
        router.push(routes.auth.posts.dashboard);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to save post. Please try again.";
      toast.error(errorMessage);
      console.error("Error saving post:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSaveDraft = async () => {
  //   setIsDraft(true);
  //   methods.setValue("status", "DRAFT");
  //   await methods.handleSubmit(onSubmit)();
  //   setIsDraft(false);
  // };

  const handlePublish = async () => {
    if (slug) {

    } else {
      methods.setValue("status", "PUBLISHED");
    }


    await methods.handleSubmit(onSubmit)();
  };

  return (
    <div className={cn("@container", className)}>
      <FormNav className="bg-white dark:bg-gray-950" />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative z-[19] [&_label.block>span]:font-medium"
        >
          <div className="pb-10 mb-10 space-y-8 first:mt-10">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component], index) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
                className={cn(
                  index !== 0 && "border-t border-dashed border-gray-200 pt-8"
                )}
              >
                <Component />
              </Element>
            ))}
          </div>

          {/* Form Footer */}
          <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-4 dark:bg-gray-950 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {methods.formState.errors &&
                  Object.keys(methods.formState.errors).length > 0 && (
                    <p className="text-sm text-red-600">
                      Please fix the errors above before submitting
                    </p>
                  )}
              </div>

              <div className="flex items-center space-x-3">
                {/*<Button*/}
                {/*  type="button"*/}
                {/*  variant="outline"*/}
                {/*  onClick={handleSaveDraft}*/}
                {/*  disabled={isLoading}*/}
                {/*  loading={isDraft}*/}
                {/*>*/}
                {/*  Save Draft*/}
                {/*</Button>*/}

                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading}
                  // loading={isLoading && !isDraft}
                  loading={isLoading}
                >
                  {slug ? "Update Post" : "Publish Post"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
