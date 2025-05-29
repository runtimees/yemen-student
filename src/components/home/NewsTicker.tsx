
const NewsTicker = () => {
  const newsItems = [
    "🔔 تم تحديث نظام تتبع الطلبات",
    "📢 إعلان هام: تم فتح باب التقديم للمنح الدراسية",
    "⚠️ تذكير: آخر موعد لتقديم طلبات توثيق الشهادات هو 30 ديسمبر",
    "🎓 ورشة عمل حول إجراءات الدراسة في العراق - السبت القادم",
    "📋 تحديث: تم تبسيط إجراءات تجديد جوازات السفر"
  ];

  return (
    <div className="bg-yemen-red text-white py-2 overflow-hidden relative">
      <div className="flex items-center">
        <div className="bg-yemen-black text-white px-3 py-1 font-bold text-sm whitespace-nowrap flex-shrink-0">
          أخبار هامة
        </div>
        <div className="flex-1 relative overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4 text-sm">
              {newsItems.join(" • ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
