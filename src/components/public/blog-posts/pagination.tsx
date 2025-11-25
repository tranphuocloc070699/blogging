'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  total: number;
}

export default function Pagination({ currentPage, hasMore }: PaginationProps) {
  const hasPrevious = currentPage > 1;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-8">
      {/* Previous Button */}
      {hasPrevious && (
        <Link href={`/?page=${currentPage - 1}`} scroll={false}>
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
        </Link>
      )}

      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Page {currentPage}
      </div>

      {/* Next Button */}
      {hasMore && (
        <Link href={`/?page=${currentPage + 1}`} scroll={false}>
          <Button variant="outline" className="flex items-center gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
