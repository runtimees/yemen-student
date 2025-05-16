
import { useState, useEffect, useRef } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { mockDatabase } from '@/services/mockDatabase';
import { NewsItem } from '@/types/database';
import useEmblaCarousel from 'embla-carousel-react';

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const autoplayTimer = useRef<number | null>(null);

  useEffect(() => {
    // Fetch news from the mock database
    const activeNews = mockDatabase.getActiveNews();
    setNews(activeNews);
  }, []);

  useEffect(() => {
    if (emblaApi) {
      // Start autoplay - scroll every 15 seconds
      const autoplay = () => {
        if (!emblaApi) return;
        
        if (autoplayTimer.current) {
          clearTimeout(autoplayTimer.current);
        }
        
        autoplayTimer.current = window.setTimeout(() => {
          emblaApi.scrollNext();
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
    }
  }, [emblaApi]);

  return (
    <div className="bg-gradient-to-r from-yemen-blue to-blue-700 text-white py-6 px-4 overflow-hidden shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center mb-3">
          <div className="bg-yemen-red px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-md">
            آخر الأخبار
          </div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {news.map((item) => (
                <div key={item.id} className="flex-none w-full md:w-1/2 lg:w-1/3 p-2">
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
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {news.map((item, index) => (
                <button 
                  key={index} 
                  className="h-2 w-2 rounded-full bg-white/50 hover:bg-white cursor-pointer transition-colors"
                  onClick={() => emblaApi?.scrollTo(index)}
                >
                </button>
              ))}
            </div>
          </div>
          
          <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2" />
          <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
