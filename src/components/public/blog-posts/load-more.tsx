'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreProps {
  currentPage: number;
  isPending: boolean;
  onLoadMore: () => void;
}

export default function LoadMore({ currentPage, isPending, onLoadMore }: LoadMoreProps) {
  return (
    <div className="flex items-center justify-center my-8">
      <Button
        onClick={onLoadMore}
        disabled={isPending}
        variant="outline"
        size="sm"
        className="text-sm min-w-32"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          `Load More ${currentPage + 1}`
        )}
      </Button>
    </div>
  );
}
