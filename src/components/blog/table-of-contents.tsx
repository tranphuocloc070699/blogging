'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TableOfContents as TOCType } from '@/types/posts';

interface TableOfContentsProps {
  toc?: TOCType;
  className?: string;
}

export default function TableOfContents({ toc, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!toc || !toc.enabled || !toc.items || toc.items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // Observe all headings
    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [toc]);

  if (!toc || !toc.enabled || !toc.items || toc.items.length === 0) {
    return null;
  }

  const scrollToHeading = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const renderTocItem = (item: any, index: number) => {
    const isActive = activeId === item.anchor;
    const indent = item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4' : 'pl-8';

    return (
      <li key={index} className={cn(indent)}>
        <button
          onClick={() => scrollToHeading(item.anchor)}
          className={cn(
            'text-left w-full py-1.5 text-sm transition-colors hover:text-gray-900',
            isActive ? 'text-gray-900 font-medium' : 'text-gray-600'
          )}
        >
          {item.title}
        </button>
        {item.children && item.children.length > 0 && (
          <ul className="space-y-1 mt-1">
            {item.children.map((child: any, idx: number) => renderTocItem(child, idx))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={cn('sticky top-24', className)}>
      <nav className="space-y-1">
        <h4 className="font-semibold text-sm text-gray-900 mb-3">Table of Contents</h4>
        <ul className="space-y-1">
          {toc.items.map((item, index) => renderTocItem(item, index))}
        </ul>
      </nav>
    </div>
  );
}
