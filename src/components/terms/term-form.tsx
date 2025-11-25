"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Element } from "react-scroll";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import {
  TermDto,
  CreateTermDto,
  UpdateTermDto,
  TaxonomyDto,
} from "@/types/posts";
import taxonomyService from "@/services/modules/taxonomy-service";
import termService from "@/services/modules/term-service";
import TermFormNav, { termFormParts } from "./term-form-nav";
import TermBasicInfo from "./term-basic-info";
import { useClientSession } from "@/hooks/use-client-session";

const termSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  slug: z.string().max(100, "Slug must be less than 100 characters").optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  taxonomyId: z.number().min(1, "Taxonomy is required"),
});

type TermFormData = z.infer<typeof termSchema>;

interface TermFormProps {
  term?: TermDto;
  mode: "create" | "edit";
}

export default function TermForm({ term, mode }: TermFormProps) {
  const [loading, setLoading] = useState(false);
  const [taxonomies, setTaxonomies] = useState<TaxonomyDto[]>([]);
  const [taxonomiesLoading, setTaxonomiesLoading] = useState(true);
  const router = useRouter();
  const session = useClientSession();
  const methods = useForm<TermFormData>({
    resolver: zodResolver(termSchema),
    defaultValues: term
      ? {
        name: term.name,
        slug: term.slug,
        description: term.description || "",
        taxonomyId: term.taxonomy.id,
      }
      : {
        name: "",
        slug: "",
        description: "",
        taxonomyId: 0,
      },
  });

  useEffect(() => {
    const loadTaxonomies = async () => {
      try {
        const { body } = await taxonomyService.getAllTaxonomies();
        setTaxonomies(Array.isArray(body.data) ? body.data : []);
      } catch (error) {
        console.error("Failed to load taxonomies:", error);
        toast.error("Failed to load taxonomies");
        setTaxonomies([]);
      } finally {
        setTaxonomiesLoading(false);
      }
    };

    loadTaxonomies();
  }, []);

  // Auto-generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (mode === "create" || !term?.slug) {
      methods.setValue("slug", generateSlug(newName));
    }
  };

  const onSubmit = async (data: TermFormData) => {
    setLoading(true);
    try {
      if (mode === "create") {
        await termService.createTerm(session?.accessToken ?? "", data as CreateTermDto);
        toast.success("Term created successfully");
      } else if (term) {
        await termService.updateTerm(session?.accessToken ?? "", term.id, data as UpdateTermDto);
        toast.success("Term updated successfully");
      }
      router.push("/auth/terms");
    } catch (error) {
      toast.error(`Failed to ${mode} term`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("@container")}>
      <TermFormNav className="bg-white dark:bg-gray-950" />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative z-[19] [&_label.block>span]:font-medium"
        >
          <div className="pt-10 pb-10 mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 [&>*:not(:first-child)]:pt-7 [&>*:not(:last-child)]:pb-7 @2xl:gap-9 @3xl:gap-11 @2xl:[&>*:not(:first-child)]:pt-9 @2xl:[&>*:not(:last-child)]:pb-9 @3xl:[&>*:not(:first-child)]:pt-11 @3xl:[&>*:not(:last-child)]:pb-11">
            <Element key={termFormParts.basicInfo} name={termFormParts.basicInfo}>
              <TermBasicInfo
                mode={mode}
                taxonomies={taxonomies}
                taxonomiesLoading={taxonomiesLoading}
                onNameChange={handleNameChange}
              />
            </Element>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/terms")}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading || taxonomiesLoading}
                  loading={loading}
                >
                  {mode === "create" ? "Create Term" : "Update Term"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
