'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input, Textarea, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import FormGroup from '@/components/form/form-group';
import { Search, Globe, Share2, Eye } from 'lucide-react';

interface PostSeoProps {
  className?: string;
}

const indexOptions = [
  { label: 'Index (Default)', value: 'index' },
  { label: 'No Index', value: 'noindex' },
  { label: 'No Follow', value: 'nofollow' },
  { label: 'No Index, No Follow', value: 'noindex,nofollow' },
];

export default function PostSeo({ className }: PostSeoProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const metaTitle = watch('metaTitle') || '';
  const metaDescription = watch('metaDescription') || '';
  const canonicalUrl = watch('canonicalUrl') || '';

  return (
    <FormGroup
      title="SEO Settings"
      description="Optimize your post for search engines and social media"
      className={cn(className)}
    >
      {/* Meta Title */}
      <div className="col-span-full">
        <label className="block text-sm font-medium mb-2">
          <Search className="inline h-4 w-4 mr-1" />
          Meta Title
        </label>
        <Input
          placeholder="SEO optimized title (recommended: 50-60 characters)"
          {...register('metaTitle')}
          error={errors.metaTitle?.message as string}
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-gray-500">Length: {metaTitle.length} characters</span>
          <span className={cn(
            metaTitle.length > 60 ? 'text-red-500' :
              metaTitle.length > 50 ? 'text-yellow-500' : 'text-green-500'
          )}>
            {metaTitle.length > 60 ? 'Too long' :
              metaTitle.length > 50 ? 'Good' : 'Could be longer'}
          </span>
        </div>
      </div>

      {/* Meta Description */}
      <div className="col-span-full">
        <label className="block text-sm font-medium mb-2">
          Meta Description
        </label>
        <Controller
          control={control}
          name="metaDescription"
          render={({ field: { onChange, value } }) => (
            <Textarea
              placeholder="Brief description for search results (recommended: 150-160 characters)"
              value={value}
              onChange={onChange}
              rows={3}
              className="resize-none"
            />
          )}
        />
        <div className="mt-1 flex justify-between text-xs">
          <span className="text-gray-500">Length: {metaDescription.length} characters</span>
          <span className={cn(
            metaDescription.length > 160 ? 'text-red-500' :
              metaDescription.length > 150 ? 'text-yellow-500' : 'text-green-500'
          )}>
            {metaDescription.length > 160 ? 'Too long' :
              metaDescription.length > 150 ? 'Good' : 'Could be longer'}
          </span>
        </div>
        {errors.metaDescription?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.metaDescription.message as string}</p>
        )}
      </div>

      {/* Meta Keywords */}
      <div className="col-span-full">
        <Input
          label="Meta Keywords"
          placeholder="keyword1, keyword2, keyword3"
          {...register('metaKeywords')}
          error={errors.metaKeywords?.message as string}
        />
        <p className="mt-1 text-xs text-gray-500">
          Separate keywords with commas (optional, not used by most search engines)
        </p>
      </div>

      {/* Canonical URL */}
      <div className="col-span-full">
        <label className="block text-sm font-medium mb-2">
          <Globe className="inline h-4 w-4 mr-1" />
          Canonical URL
        </label>
        <Input
          placeholder="https://example.com/canonical-url"
          {...register('canonicalUrl')}
          error={errors.canonicalUrl?.message as string}
        />
        <p className="mt-1 text-xs text-gray-500">
          Specify the canonical URL to avoid duplicate content issues
        </p>
      </div>

      {/* Focus Keyword */}
      <div>
        <Input
          label="Keywords"
          placeholder="main keyword for this post"
          {...register('focusKeyword')}
          error={errors.focusKeyword?.message as string}
        />
      </div>

      {/* Open Graph Settings */}
      <div className="col-span-full border-t pt-6">
        <h5 className="text-sm font-medium mb-4 flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          Social Media (Open Graph)
        </h5>

        <div className="space-y-4">
          <Input
            label="OG Title"
            placeholder="Title for social media sharing"
            {...register('ogTitle')}
            error={errors.ogTitle?.message as string}
          />

          <Controller
            control={control}
            name="ogDescription"
            render={({ field: { onChange, value } }) => (
              <div>
                <label className="block text-sm font-medium mb-2">
                  OG Description
                </label>
                <Textarea
                  placeholder="Description for social media sharing"
                  value={value}
                  onChange={onChange}
                  rows={2}
                  className="resize-none"
                />
              </div>
            )}
          />

          <Input
            label="OG Image URL"
            placeholder="https://example.com/image.jpg"
            {...register('ogImage')}
            error={errors.ogImage?.message as string}
          />
        </div>
      </div>

      {/* Twitter Card Settings */}
      <div className="col-span-full border-t pt-6">
        <h5 className="text-sm font-medium mb-4">
          Twitter Card
        </h5>

        <div className="space-y-4">
          <Controller
            name="twitterCardType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Card Type"
                options={[
                  { label: 'Summary', value: 'summary' },
                  { label: 'Summary Large Image', value: 'summary_large_image' },
                ]}
                value={value}
                onValueChange={onChange}
                placeholder="Select card type"
              />
            )}
          />

          <Input
            label="Twitter Handle"
            placeholder="@yourusername"
            {...register('twitterHandle')}
            error={errors.twitterHandle?.message as string}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="col-span-full border-t pt-6">
        <h5 className="text-sm font-medium mb-4">
          Search Result Preview
        </h5>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {metaTitle || 'Your post title will appear here'}
          </div>
          <div className="text-green-700 text-sm">
            {canonicalUrl || 'https://example.com/your-post-slug'}
          </div>
          <div className="text-gray-600 text-sm mt-1">
            {metaDescription || 'Your meta description will appear here. This is what users will see in search results.'}
          </div>
        </div>
      </div>
    </FormGroup>
  );
}