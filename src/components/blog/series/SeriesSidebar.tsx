import { BookOpen } from 'lucide-react';
import SeriesCard from './SeriesCard';
import type { Series } from '@/types/posts';

interface SeriesSidebarProps {
  series: Series[];
}

export default function SeriesSidebar({ series }: SeriesSidebarProps) {
  if (series.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 sticky top-24">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2" />
        Series
      </h3>
      <div className="space-y-4">
        {series.map((item) => (
          <SeriesCard key={item.id} series={item} />
        ))}
      </div>
    </div>
  );
}
