
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
    <div className="bg-yemen-red text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <span className="bg-white text-yemen-red px-3 py-1 rounded-md font-bold text-sm flex-shrink-0 ml-4">
            أخبار
          </span>
          <div className="flex-1 overflow-hidden">
            {/* Desktop: Show scrolling animation */}
            <div className="hidden md:block">
              <div 
                className="whitespace-nowrap animate-marquee"
                style={{
                  animation: 'marquee 20s linear infinite'
                }}
              >
                {news.map((item, index) => (
                  <span key={item.id} className="inline-block mr-12">
                    {item.title} - {item.content}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Mobile: Show one item at a time with fade transition */}
            <div className="md:hidden">
              <div className="relative h-6 overflow-hidden">
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
                    <p className="text-sm line-clamp-1">
                      {item.title} - {item.content}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Mobile navigation dots */}
              {news.length > 1 && (
                <div className="flex justify-center mt-2 space-x-1 space-x-reverse">
                  {news.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
