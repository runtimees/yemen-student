
import { useState, useEffect, useRef } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

const NewsTicker = () => {
  const [news] = useState([
    {
      id: 1,
      text: "تم فتح باب التقديم للمنح الدراسية للعام الدراسي الجديد",
      image: "https://picsum.photos/id/28/200/100" // Placeholder image
    },
    {
      id: 2,
      text: "موعد تجديد الإقامة للطلبة من 1 يناير إلى 31 مارس",
      image: "https://picsum.photos/id/44/200/100" // Placeholder image
    },
    {
      id: 3,
      text: "إعلان هام: تمديد فترة توثيق الشهادات حتى نهاية الشهر القادم",
      image: "https://picsum.photos/id/133/200/100" // Placeholder image
    },
    {
      id: 4,
      text: "ورشة عمل حول آلية تصديق الشهادات الأسبوع القادم",
      image: "https://picsum.photos/id/180/200/100" // Placeholder image
    }
  ]);

  return (
    <div className="bg-gradient-to-r from-yemen-blue to-blue-700 text-white py-6 px-4 overflow-hidden shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center mb-3">
          <div className="bg-yemen-red px-4 py-2 rounded-lg font-bold text-sm md:text-base shadow-md">
            آخر الأخبار
          </div>
        </div>
        
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {news.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg p-1 h-full">
                  <div className="flex flex-col h-full">
                    <div className="overflow-hidden rounded-lg flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt="News" 
                        className="w-full h-28 object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="p-3 flex-grow">
                      <p className="text-white text-sm md:text-base">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {news.map((item, index) => (
                <span 
                  key={index} 
                  className="h-2 w-2 rounded-full bg-white/50 hover:bg-white cursor-pointer transition-colors"
                >
                </span>
              ))}
            </div>
          </div>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
};

export default NewsTicker;
