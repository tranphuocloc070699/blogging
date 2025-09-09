"use client"

import React, {useState} from 'react';
import TagList from '@/components/news/tag-list';
import SearchInput from '@/components/news/search-input';
import SortSelect from "@/components/news/sort-select";
import PostItem from "@/components/news/post-item";


const NewsPage = () => {
  const [search, setSearch] = useState('');

  return (
      <div className={"posts-container"}>
        <section className='flex items-center justify-between'>
          <SearchInput value={search} onChange={setSearch}/>
          <TagList/>
          <SortSelect/>
        </section>
        <section className={"md:mt-10"}>
          <PostItem/>
        </section>
      </div>
  );
};

export default NewsPage;