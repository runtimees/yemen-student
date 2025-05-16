
import { useState, useEffect } from 'react';

const NewsTicker = () => {
  const [news] = useState([
    "تم فتح باب التقديم للمنح الدراسية للعام الدراسي الجديد",
    "موعد تجديد الإقامة للطلبة من 1 يناير إلى 31 مارس",
    "إعلان هام: تمديد فترة توثيق الشهادات حتى نهاية الشهر القادم",
    "ورشة عمل حول آلية تصديق الشهادات الأسبوع القادم"
  ]);

  return (
    <div className="bg-yemen-blue text-white py-3 overflow-hidden">
      <div className="relative flex items-center">
        <div className="bg-yemen-red px-4 py-1 font-bold z-10 text-sm md:text-base">
          آخر الأخبار
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap">
            {news.map((item, index) => (
              <span key={index} className="mx-4 text-sm md:text-base">
                &#9733; {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
