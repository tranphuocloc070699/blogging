'use client';

import FormGroup from '@/components/form/form-group';
import { Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Image as ImageIcon, X } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface PostMediaProps {
  className?: string;
}

export default function PostMedia({ className }: PostMediaProps) {
  const {
    control,
    setValue,
    watch,
    // formState: { errors },
  } = useFormContext();

  const [dragActive, setDragActive] = useState(false);
  const featuredImage = watch('featuredImage');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setValue('featuredImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue('featuredImage', '');
  };

  return (
    <FormGroup
      title="Media"
      description="Add featured image and gallery for your post"
      className={cn(className)}
    >
      <div className="col-span-full">
        <label className="block text-sm font-medium mb-2">Featured Image</label>

        {featuredImage ? (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-gray-200">
              <img
                src={featuredImage}
                alt="Featured"
                className="h-48 w-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400',
              dragActive && 'border-blue-400 bg-blue-50'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drop image here or click to upload
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-full">
        <Controller
          control={control}
          name="imageAlt"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Image Alt Text"
              placeholder="Describe the image for accessibility"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        />
      </div>

      <div className="col-span-full">
        <Controller
          control={control}
          name="imageCaption"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Image Caption"
              placeholder="Optional caption for the image"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        />
      </div>
    </FormGroup>
  );
}