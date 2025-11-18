'use client';

import { cn } from '@/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';
import NovelEditorWrapper from '../novel-editor-wrapper';

interface PostContentProps {
  className?: string;
}

export default function PostContent({ className }: PostContentProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn('space-y-4', className)}>
      {/* Title and Description */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Content</h3>
        <p className="mt-0">
          Write your blog post content using the Notion-style editor
        </p>
      </div>

      {/* Full Width Editor */}
      <div className="w-full">
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, value } }) => (
            <div className="min-h-[500px] rounded-lg border border-gray-200">
              <NovelEditorWrapper value={value || ''} onChange={onChange} />
            </div>
          )}
        />
        {errors["content"]?.message && (
          <p className="mt-1 text-sm text-red-600">{errors["content"].message as string}</p>
        )}
        <div className="mt-2 text-xs text-gray-500">
          <p>💡 Tips:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Type / for commands (headings, lists, code blocks, etc.)</li>
            <li>Use Markdown shortcuts: # for headings, ** for bold, * for italic</li>
            <li>Drag and drop to reorder blocks</li>
            <li>Select text to format with the inline toolbar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}