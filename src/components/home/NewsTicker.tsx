
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsItem } from '@/types/database';

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (news.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [news.length]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        return;
      }

      if (data) {
        const newsItems: NewsItem[] = data.map(item => ({
          id: parseInt(item.id),
          title: item.title,
          content: item.content,
          is_active: item.is_active,
          created_at: item.created_at
        }));
        setNews(newsItems);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  if (!news.length) return null;

  return (
    <div className="bg-gradient-to-r from-yemen-red via-red-600 to-yemen-red text-white py-4 overflow-hidden shadow-lg">
      <div className="container mx-auto px-4">
        {/* Beautiful centered title */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-1 max-w-20"></div>
            <h2 className="mx-4 text-2xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
              آخر الأخبار
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-1 max-w-20"></div>
          </div>
        </div>

        <div className="flex items-center">
          <span className="bg-gradient-to-r from-white to-gray-100 text-yemen-red px-4 py-2 rounded-lg font-bold text-sm flex-shrink-0 ml-4 shadow-md border border-white/20">
            أخبار
          </span>
          <div className="flex-1 overflow-hidden">
            {/* Desktop: Show scrolling animation */}
            <div className="hidden md:block">
              <div 
                className="whitespace-nowrap animate-marquee flex items-center"
                style={{
                  animation: 'marquee 25s linear infinite'
                }}
              >
                {news.map((item, index) => (
                  <div key={item.id} className="inline-flex items-center mr-16 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-white/30">
                      <img 
                        src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face"
                        alt="News"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-yellow-200 text-sm">{item.title}</span>
                      <span className="text-white/90 text-sm">{item.content}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mobile: Show one item at a time with fade transition */}
            <div className="md:hidden">
              <div className="relative h-20 overflow-hidden">
                {news.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      index === currentIndex 
                        ? 'opacity-100 translate-y-0' 
                        : index < currentIndex 
                          ? 'opacity-0 -translate-y-full' 
                          : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-white/30">
                        <img 
                          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face"
                          alt="News"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="font-semibold text-yellow-200 text-sm line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-white/90 text-sm line-clamp-1">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile navigation dots */}
              {news.length > 1 && (
                <div className="flex justify-center mt-3 space-x-2 space-x-reverse">
                  {news.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-yellow-300 scale-125 shadow-lg' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
