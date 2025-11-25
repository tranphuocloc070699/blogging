import Link from 'next/link';
import type { Series } from '@/types/posts';

interface SeriesCardProps {
  series: Series;
}

export default function SeriesCard({ series }: SeriesCardProps) {
  const postCount = series._count?.posts || 0;

  return (
    <Link href={`/series/${series.slug}`}>
      <div className="border-l-2 border-black pl-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
        <h4 className="font-semibold mb-1">{series.name}</h4>
        {series.description && (
          <p className="text-sm text-gray-600 mb-2">{series.description}</p>
        )}
        <span className="text-xs text-gray-500">
          {postCount} {postCount === 1 ? 'post' : 'posts'}
        </span>
      </div>
    </Link>
  );
}
