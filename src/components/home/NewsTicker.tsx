
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsItem } from '@/types/database';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

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
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Beautiful centered title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-1 max-w-20"></div>
            <h2 className="mx-4 text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
              آخر الأخبار
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-white to-transparent flex-1 max-w-20"></div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {news.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                      {/* Large Image */}
                      <div className="w-full h-48 rounded-lg overflow-hidden mb-4 border-2 border-white/30">
                        <img 
                          src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop&crop=face"
                          alt="News"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Text below image */}
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-yellow-200 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-sm line-clamp-3">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation arrows */}
            <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" />
            <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
