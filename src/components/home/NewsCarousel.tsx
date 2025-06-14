
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const plugin = React.useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true
    })
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        return;
      }

      console.log('Fetched news:', data);
      setNews(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isTextLong = (text: string) => text.length > 150;

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
            opts={{
              align: "start",
              loop: true,
              direction: "rtl",
              skipSnaps: false,
              containScroll: "trimSnaps"
            }}
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.play()}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {news.map((item, index) => {
                const isExpanded = expandedItems.has(item.id);
                const shouldShowReadMore = isTextLong(item.content);
                const displayContent = isExpanded || !shouldShowReadMore 
                  ? item.content 
                  : item.content.substring(0, 150) + '...';

                return (
                  <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                      <CardContent className="p-4 md:p-6 h-full flex flex-col">
                        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-white/20">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
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
                          
                          <div className="flex-1 flex flex-col">
                            <p className="text-white/90 text-sm md:text-base leading-relaxed">
                              {displayContent}
                            </p>
                            
                            {shouldShowReadMore && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(item.id)}
                                className="mt-2 text-white/80 hover:text-white hover:bg-white/20 self-start p-0 h-auto font-normal"
                              >
                                {isExpanded ? 'عرض أقل' : 'اقرأ المزيد'}
                              </Button>
                            )}
                          </div>
                          
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
                );
              })}
            </CarouselContent>
            
            {/* Navigation arrows - visible on all screen sizes */}
            <CarouselPrevious className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white z-10 h-10 w-10" />
            <CarouselNext className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white z-10 h-10 w-10" />
          </Carousel>
          
          {/* Progress indicators */}
          <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse">
            {news.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide % news.length 
                    ? 'bg-white scale-110' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
