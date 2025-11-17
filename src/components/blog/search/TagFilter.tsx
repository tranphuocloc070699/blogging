'use client';

import { Button } from '@/components/ui/button';
import type { Tag } from '@/types/posts';

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

export default function TagFilter({
  tags,
  selectedTag,
  onTagChange,
}: TagFilterProps) {
  // Add "All" option at the beginning
  const allTags = [
    { id: 'all', name: 'All', slug: 'All' },
    ...tags,
  ];

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block overflow-x-auto scrollbar-hide snap-x snap-mandatory max-w-md">
        <div className="flex gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag.id}
              onClick={() => onTagChange(tag.slug)}
              variant={selectedTag === tag.slug ? 'default' : 'outline'}
              className={`snap-start rounded-full whitespace-nowrap ${
                selectedTag === tag.slug ? '' : 'hover:border-black'
              }`}
              size="sm"
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory w-full">
        <div className="flex gap-2 pb-2">
          {allTags.map((tag) => (
            <Button
              key={tag.id}
              onClick={() => onTagChange(tag.slug)}
              variant={selectedTag === tag.slug ? 'default' : 'outline'}
              className={`snap-start rounded-full whitespace-nowrap ${
                selectedTag === tag.slug ? '' : 'hover:border-black'
              }`}
              size="sm"
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
