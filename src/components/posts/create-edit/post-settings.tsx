'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Input, Switch, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import FormGroup from '@/components/form/form-group';
import { Calendar, Clock, Eye, MessageCircle } from 'lucide-react';

interface PostSettingsProps {
  className?: string;
}

const visibilityOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Password Protected', value: 'password' },
];

export default function PostSettings({ className }: PostSettingsProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const visibility = watch('visibility');
  const allowComments = watch('allowComments');
  const isFeatured = watch('isFeatured');

  return (
    <FormGroup
      title="Post Settings"
      description="Configure publication settings and post options"
      className={cn(className)}
    >
      {/* Publication Date */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Calendar className="inline h-4 w-4 mr-1" />
          Publish Date
        </label>
        <Input
          type="datetime-local"
          {...register('publishedAt')}
          error={errors.publishedAt?.message as string}
        />
      </div>

      {/* Visibility */}
      <div>
        <Controller
          name="visibility"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label={
                <span>
                  <Eye className="inline h-4 w-4 mr-1" />
                  Visibility
                </span>
              }
              options={visibilityOptions}
              value={value}
              onValueChange={onChange}
              error={errors?.visibility?.message as string}
              placeholder="Select visibility"
            />
          )}
        />
      </div>

      {/* Password Field (if password protected) */}
      {visibility === 'password' && (
        <div className="col-span-full">
          <Input
            label="Password"
            type="password"
            placeholder="Enter password for this post"
            {...register('password')}
            error={errors.password?.message as string}
          />
        </div>
      )}

      {/* Reading Time */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Clock className="inline h-4 w-4 mr-1" />
          Estimated Reading Time (minutes)
        </label>
        <Input
          type="number"
          min="1"
          max="999"
          placeholder="Auto-calculated"
          {...register('readingTime', { valueAsNumber: true })}
          error={errors.readingTime?.message as string}
        />
        <p className="mt-1 text-xs text-gray-500">
          Leave empty to auto-calculate based on word count
        </p>
      </div>

      {/* Author Override */}
      <div>
        <Input
          label="Author Override"
          placeholder="Leave empty to use current user"
          {...register('authorOverride')}
          error={errors.authorOverride?.message as string}
        />
      </div>

      {/* Post Options */}
      <div className="col-span-full space-y-4">
        <h5 className="text-sm font-medium">Post Options</h5>

        {/* Allow Comments */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <label className="text-sm font-medium">Allow Comments</label>
              <p className="text-xs text-gray-500">Enable comments for this post</p>
            </div>
          </div>
          <Controller
            name="allowComments"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch checked={value} onCheckedChange={onChange} />
            )}
          />
        </div>

        {/* Featured Post */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Featured Post</label>
            <p className="text-xs text-gray-500">Mark this post as featured</p>
          </div>
          <Controller
            name="isFeatured"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch checked={value} onCheckedChange={onChange} />
            )}
          />
        </div>

        {/* Sticky Post */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Sticky Post</label>
            <p className="text-xs text-gray-500">Pin this post to the top</p>
          </div>
          <Controller
            name="isSticky"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch checked={value} onCheckedChange={onChange} />
            )}
          />
        </div>
      </div>

      {/* Custom Fields */}
      <div className="col-span-full">
        <h5 className="text-sm font-medium mb-3">Custom Fields</h5>
        <div className="space-y-3">
          <Input
            label="Custom Field 1"
            placeholder="e.g., external_link"
            {...register('customFields.field1.key')}
          />
          <Input
            placeholder="Value"
            {...register('customFields.field1.value')}
          />
        </div>
      </div>
    </FormGroup>
  );
}