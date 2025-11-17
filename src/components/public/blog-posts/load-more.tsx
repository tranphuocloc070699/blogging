'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadMoreProps {
  currentPage: number;
}

export default function LoadMore({ currentPage }: LoadMoreProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    const nextPage = currentPage + 1;

    // Create new URL search params
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());

    // Navigate to the new page with transition
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex items-center justify-center my-8">
      <Button
        onClick={loadMore}
        disabled={isPending}
        variant="outline"
        size="sm"
        className="text-sm"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </Button>
    </div>
  );
}
