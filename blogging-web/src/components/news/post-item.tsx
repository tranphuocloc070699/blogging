import {Heart, Bookmark, MoreHorizontal, Calendar} from 'lucide-react';
import {useState} from 'react';

export default function PostItem() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(81);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
      <article
          className="w-full mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-8 pb-6">
          {/* Content */}
          <div className="flex gap-8">
            <div className="flex-1">
              <h1 className="text-2xl text-left font-bold text-gray-900 leading-tight mb-4 hover:text-gray-700 cursor-pointer transition-colors hover:underline">
                The Front-End Architecture Blueprint: A Practical Guide to Building Large-Scale
                React Apps
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Building a Front-end app is easy. Maintaining it as it grows? That's where the real
                game begins, as I've talked about in my other articles about scalable architecture
                patterns...
              </p>
            </div>

            {/* Architecture Diagram */}
            <div className="flex-shrink-0">
              <div
                  className="w-40 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-3 shadow-lg">
                <div className="space-y-1">
                  <div className="h-2 bg-yellow-300 rounded-sm opacity-90"></div>
                  <div className="h-2 bg-purple-300 rounded-sm opacity-90"></div>
                  <div className="h-2 bg-teal-300 rounded-sm opacity-90"></div>
                  <div className="h-2 bg-green-400 rounded-sm opacity-90"></div>
                  <div className="h-2 bg-orange-400 rounded-sm opacity-90"></div>
                </div>
                <div className="text-[8px] text-white/80 mt-2 leading-tight">
                  <div>UI Layer</div>
                  <div>Services</div>
                  <div>Core Logic</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6">
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-6">
              <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                      isLiked
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-red-500'
                  }`}
              >
                <Heart
                    className={`w-4 h-4 transition-all duration-200 ${
                        isLiked ? 'fill-current scale-110' : 'hover:scale-105'
                    }`}
                />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4"/>
                <span>Jul 4</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full transition-all duration-200 ${
                      isBookmarked
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                          : 'text-gray-400 hover:bg-gray-50 hover:text-amber-500'
                  }`}
              >
                <Bookmark
                    className={`w-4 h-4 transition-all duration-200 ${
                        isBookmarked ? 'fill-current' : ''
                    }`}
                />
              </button>

              {/* More options */}
              <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-400"/>
              </button>
            </div>
          </div>
        </div>
      </article>
  );
}