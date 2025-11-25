'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Element } from "react-scroll";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { TaxonomyDto, CreateTaxonomyDto, UpdateTaxonomyDto } from '@/types/posts';
import taxonomyService from '@/services/modules/taxonomy-service';
import TaxonomyFormNav, { taxonomyFormParts } from './taxonomy-form-nav';
import TaxonomyBasicInfo from './taxonomy-basic-info';
import { useClientSession } from '@/hooks/use-client-session';

const taxonomySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  slug: z.string().max(100, 'Slug must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type TaxonomyFormData = z.infer<typeof taxonomySchema>;

interface TaxonomyFormProps {
  taxonomy?: TaxonomyDto;
  mode: 'create' | 'edit';
}

export default function TaxonomyForm({ taxonomy, mode }: TaxonomyFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useClientSession();

  const methods = useForm<TaxonomyFormData>({
    resolver: zodResolver(taxonomySchema),
    defaultValues: taxonomy ? {
      name: taxonomy.name,
      slug: taxonomy.slug,
      description: taxonomy.description || '',
    } : {
      name: '',
      slug: '',
      description: '',
    },
  });

  // Auto-generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (mode === 'create' || !taxonomy?.slug) {
      methods.setValue('slug', generateSlug(newName));
    }
  };

  const onSubmit = async (data: TaxonomyFormData) => {
    setLoading(true);
    try {
      if (mode === 'create') {
        await taxonomyService.createTaxonomy(session?.accessToken ?? "", data as CreateTaxonomyDto);
        toast.success('Taxonomy created successfully');
      } else if (taxonomy) {
        await taxonomyService.updateTaxonomy(session?.accessToken ?? "", taxonomy.id, data as UpdateTaxonomyDto);
        toast.success('Taxonomy updated successfully');
      }
      router.push('/auth/taxonomies');
    } catch (error) {
      toast.error(`Failed to ${mode} taxonomy`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("@container")}>
      <TaxonomyFormNav className="bg-white dark:bg-gray-950" />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative z-[19] [&_label.block>span]:font-medium"
        >
          <div className="pt-10 pb-10 mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 [&>*:not(:first-child)]:pt-7 [&>*:not(:last-child)]:pb-7 @2xl:gap-9 @3xl:gap-11 @2xl:[&>*:not(:first-child)]:pt-9 @2xl:[&>*:not(:last-child)]:pb-9 @3xl:[&>*:not(:first-child)]:pt-11 @3xl:[&>*:not(:last-child)]:pb-11">
            <Element key={taxonomyFormParts.basicInfo} name={taxonomyFormParts.basicInfo}>
              <TaxonomyBasicInfo mode={mode} onNameChange={handleNameChange} />
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
                  onClick={() => router.push('/taxonomies')}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                >
                  {mode === 'create' ? 'Create Taxonomy' : 'Update Taxonomy'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}