
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
import Autoplay from "embla-carousel-autoplay";

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
        console.log('Raw news data from database:', data);
        const newsItems: NewsItem[] = data.map(item => ({
          id: parseInt(item.id) || Math.random(), // Fallback to random number if id is invalid
          title: item.title,
          content: item.content,
          is_active: item.is_active,
          created_at: item.created_at
        }));
        console.log('Processed news items:', newsItems);
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

        {/* Carousel with mobile-friendly navigation */}
        <div className="relative max-w-6xl mx-auto">
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {news.map((item, index) => (
                <CarouselItem key={`news-${item.id}-${index}`} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 md:p-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                      {/* Image from database or fallback */}
                      <div className="w-full h-48 md:h-56 rounded-lg overflow-hidden mb-4 border-2 border-white/30">
                        <img 
                          src={item.image_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop&crop=face"}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.log(`Image failed to load for news item ${item.id}:`, item.image_url);
                            e.currentTarget.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=250&fit=crop&crop=face";
                          }}
                        />
                      </div>
                      
                      {/* Text below image */}
                      <div className="text-center">
                        <h3 className="font-bold text-lg md:text-xl text-yellow-200 mb-3 line-clamp-2 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-base line-clamp-3 leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Mobile-friendly navigation arrows */}
            <CarouselPrevious className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 bg-white/30 border-white/40 text-white hover:bg-white/40 hover:text-white w-10 h-10 md:w-8 md:h-8 shadow-lg backdrop-blur-sm z-10" />
            <CarouselNext className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 bg-white/30 border-white/40 text-white hover:bg-white/40 hover:text-white w-10 h-10 md:w-8 md:h-8 shadow-lg backdrop-blur-sm z-10" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
