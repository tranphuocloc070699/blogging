'use client';

import { useState } from 'react';
import SearchFilterBar from './search/SearchFilterBar';
import PostList from './posts/PostList';
import SeriesSidebar from './series/SeriesSidebar';
import type { SerializedPost, Tag, Series } from '@/types/posts';

interface BlogDashboardProps {
  initialPosts: SerializedPost[];
  tags: Tag[];
  series: Series[];
}

export default function BlogDashboard({
  initialPosts,
  tags,
  series,
}: BlogDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <SearchFilterBar
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <PostList
          initialPosts={initialPosts}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
        />
      </div>

      <div className="lg:col-span-4">
        <SeriesSidebar series={series} />
      </div>
    </div>
  );
}
