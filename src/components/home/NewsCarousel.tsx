
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import Autoplay from "embla-carousel-autoplay";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const NewsCarousel = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching news:', error);
        return;
      }

      setNews(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">آخر الأخبار</h2>
          <div className="flex justify-center">
            <div className="animate-pulse text-white">جاري التحميل...</div>
          </div>
        </div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">آخر الأخبار</h2>
          <div className="text-center text-white">لا توجد أخبار متاحة حالياً</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800" dir="rtl">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-white">آخر الأخبار</h2>
        
        <div className="relative max-w-7xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {news.map((item) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-4 md:p-6 h-full flex flex-col">
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-white/20">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/60">
                            <div className="text-center">
                              <div className="text-3xl md:text-4xl mb-2">📰</div>
                              <div className="text-sm">صورة الخبر</div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-3 line-clamp-2">
                          {item.title}
                        </h3>
                        
                        <p className="text-white/90 text-sm md:text-base leading-relaxed flex-1 line-clamp-3">
                          {item.content}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <span className="text-white/70 text-xs md:text-sm">
                            {new Date(item.created_at).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="hidden sm:flex -left-4 md:-left-6 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" />
            <CarouselNext className="hidden sm:flex -right-4 md:-right-6 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white" />
          </Carousel>
          
          {/* Mobile navigation dots */}
          <div className="flex sm:hidden justify-center mt-6 space-x-2">
            {news.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/40"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
