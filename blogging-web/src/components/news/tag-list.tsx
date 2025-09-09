"use client"
import React, {useMemo, useRef, useState} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {cn} from '@/lib/utils';

// TagItem type
export type TagItem = {
  label: string;
  value: string;
  onClick?: (value: string) => void;
};

interface ScrollState {
  left: boolean;
  right: boolean;
}

// Example data (replace with props or data fetching as needed)
const TAGS: TagItem[] = [
  {label: 'All', value: 'all'},
  {label: 'Tech', value: 'tech'},
  {label: 'Design', value: 'design'},
  {label: 'Business', value: 'business'},
  {label: 'AI', value: 'ai'},
  {label: 'React', value: 'react'},
  {label: 'Next.js', value: 'nextjs'},
  {label: 'Tailwind', value: 'tailwind'},
  {label: 'Startup', value: 'startup'},
  {label: 'Product', value: 'product'},
];

const SCROLL_AMOUNT = 120;

const TagList = ({tags = TAGS}: { tags?: TagItem[] }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({left: false, right: true});
  const [tagActive, setTagActive] = useState<TagItem | null>(null)

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    setScrollState({
      left: el.scrollLeft > 0,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  };

  React.useEffect(() => {
    updateScrollState(); // Initial check
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollState);
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);


  const scrollBy = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({left: amount});
    updateScrollState()
  };

  const onTagClick = (tag: TagItem) => {
    setTagActive(tag)
  }

  return (
      <div className={"relative"}>
        <Button
            variant="ghost"
            size="icon"
            aria-label="Scroll left"
            className={cn(
                "absolute -left-8 top-1/2 -translate-y-1/2",
                !scrollState.left && 'hidden'
            )}
            // className={cn(
            //     'absolute -left-2 top-1/2 -translate-y-1/2 z-10 transition-opacity h-7 bg-white rounded-none hover:bg-white',
            //     !scrollState.left && 'opacity-0 pointer-events-none',
            //     'after:absolute after:inset-0 after:w-8 after:h-full after:left-8 after:bg-gradient-to-r after:from-white after:to-transparent after:content-[""] after:pointer-events-none'
            // )}
            onClick={() => scrollBy(-SCROLL_AMOUNT)}
            tabIndex={scrollState.left ? 0 : -1}
        >
          <ChevronLeft/>
        </Button>
        {/* Right Arrow */}
        <Button
            variant="ghost"
            size="icon"
            aria-label="Scroll right"
            className={cn(
                "absolute -right-8 top-1/2 -translate-y-1/2",
                !scrollState.right && 'hidden'
            )}
            // className={cn(
            //     'absolute -right-2 top-1/2 -translate-y-1/2 z-10 transition-opacity h-7 bg-white rounded-none hover:bg-white',
            //     !scrollState.right && 'opacity-0 pointer-events-none',
            //     'after:absolute after:inset-0 after:w-8 after:h-full after:-left-8 after:bg-gradient-to-l after:from-white after:to-transparent after:content-[""] after:pointer-events-none'
            // )}
            onClick={() => scrollBy(SCROLL_AMOUNT)}
            tabIndex={scrollState.right ? 0 : -1}
        >
          <ChevronRight/>
        </Button>
        <div
            component-name="TagList"
            className="w-full max-w-[320px] overflow-hidden no-scrollbar flex-1"
        >
          <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto no-scrollbar  py-2 scroll-smooth"
              tabIndex={0}
              role="list"
          >
            {tags.map((tag) => (
                <span
                    key={tag.value}
                    onClick={() => onTagClick(tag)}
                    className={cn(
                        "whitespace-nowrap px-3 py-2 text-sm font-normal text-gray-500 cursor-pointer rounded-pill hover:bg-gray-100 hover:text-black-primary",
                        tagActive?.value === tag.value && "bg-black-primary text-white"
                    )}
                    tabIndex={0}
                    role="listitem"
                >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
  );
};

export default TagList;