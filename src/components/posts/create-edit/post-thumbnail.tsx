'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import FormGroup from '@/components/form/form-group';
import { Upload, X } from 'lucide-react';
import { useUserStore } from '@/store/user.store';

interface PostThumbnailProps {
  className?: string;
}

export default function PostThumbnail({ className }: PostThumbnailProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const thumbnail = watch('thumbnail');
  const accessToken = useUserStore((state) => state.accessToken);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      if (!accessToken) {
        throw new Error('Please login to upload images');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setValue('thumbnail', data.url, { shouldValidate: true });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setValue('thumbnail', '', { shouldValidate: true });
    setUploadError(null);
  };

  return (
    <FormGroup
      title="Thumbnail"
      description="Upload a thumbnail image for your post"
      className={cn(className)}
    >
      <div className="col-span-full">
        {!thumbnail ? (
          <div className="relative">
            <label
              htmlFor="thumbnail-upload"
              className={cn(
                'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                uploading
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className={cn("w-10 h-10 mb-3", uploading ? "text-gray-400" : "text-gray-500")} />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">
                    {uploading ? 'Uploading...' : 'Click to upload'}
                  </span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                    handleFileUpload(file);
                  }
                }}
              />
            </label>
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-gray-200">
              <img
                src={thumbnail}
                alt="Thumbnail preview"
                className="h-48 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="h-48 flex items-center justify-center bg-gray-100">
                        <div class="text-center text-gray-500">
                          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p class="mt-2 text-sm">Failed to load image</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Remove thumbnail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {errors["thumbnail"]?.message && (
          <p className="mt-2 text-sm text-red-600">{errors["thumbnail"].message as string}</p>
        )}
      </div>
    </FormGroup>
  );
}