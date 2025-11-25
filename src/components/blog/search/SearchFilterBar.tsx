'use client';

import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import type { Tag } from '@/types/posts';

interface SearchFilterBarProps {
  tags: Tag[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchFilterBar({
  tags,
  selectedTag,
  onTagChange,
  searchQuery,
  onSearchChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <TagFilter
        tags={tags}
        selectedTag={selectedTag}
        onTagChange={onTagChange}
      />
    </div>
  );
}
