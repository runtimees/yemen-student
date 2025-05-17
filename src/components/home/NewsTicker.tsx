
import { useState, useEffect, useRef } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { databaseService } from '@/services/databaseService';
import { NewsItem } from '@/types/database';

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const autoplayTimer = useRef<number | null>(null);
  const [api, setApi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch news from the real database
    const fetchNews = async () => {
      try {
        setLoading(true);
        const activeNews = await databaseService.getActiveNews();
        setNews(activeNews);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("تعذر تحميل الأخبار");
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  useEffect(() => {
    if (!api) return;

    // Start autoplay - scroll every 15 seconds
    const autoplay = () => {
      if (autoplayTimer.current) {
        clearTimeout(autoplayTimer.current);
      }
      
      autoplayTimer.current = window.setTimeout(() => {
        api.scrollNext();
        autoplay();
      }, 15000); // 15 seconds
    };
    
    autoplay();
    
    // Clean up on unmount
    return () => {
      if (autoplayTimer.current) {
        clearTimeout(autoplayTimer.current);
      }
    };
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-yemen-blue to-blue-700 text-white py-6 px-4 overflow-hidden shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center mb-3">
            <div className="bg-yemen-red px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-md">
              آخر الأخبار
            </div>
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-pulse">جاري تحميل الأخبار...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-r from-yemen-blue to-blue-700 text-white py-6 px-4 overflow-hidden shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center mb-3">
            <div className="bg-yemen-red px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-md">
              آخر الأخبار
            </div>
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg">{error}</p>
              <button 
                className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-md transition-colors"
                onClick={() => window.location.reload()}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No news items
  if (news.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yemen-blue to-blue-700 text-white py-6 px-4 overflow-hidden shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center mb-3">
            <div className="bg-yemen-red px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-md">
              آخر الأخبار
            </div>
          </div>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg">لا توجد أخبار حالياً</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal render with news
  return (
    <div className="bg-gradient-to-r from-yemen-blue to-blue-700 text-white py-6 px-4 overflow-hidden shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center mb-3">
          <div className="bg-yemen-red px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-md">
            آخر الأخبار
          </div>
        </div>
        
        <div className="relative">
          <Carousel setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
              {news.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg p-1 h-full">
                    <div className="flex flex-col h-full">
                      <div className="overflow-hidden rounded-lg flex-shrink-0">
                        <img 
                          src={`https://picsum.photos/id/${item.id * 50}/200/100`}
                          alt="News" 
                          className="w-full h-28 object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="p-3 flex-grow">
                        <h3 className="font-bold mb-2">{item.title}</h3>
                        <p className="text-white text-sm md:text-base">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2" />
            <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2" />
          </Carousel>
          
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {news.map((_, index) => (
                <button 
                  key={index} 
                  className="h-2 w-2 rounded-full bg-white/50 hover:bg-white cursor-pointer transition-colors"
                  onClick={() => handleDotClick(index)}
                >
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
