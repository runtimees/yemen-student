
import FeatureCard from '@/components/home/FeatureCard';

const Services = () => {
  const services = [
    {
      title: "توثيق الشهادات",
      description: "خدمة توثيق الشهادات الدراسية من الجهات المختصة",
      icon: "📜",
      link: "/service/certificate_authentication"
    },
    {
      title: "توثيق الوثائق",
      description: "خدمة توثيق الوثائق الرسمية والشخصية",
      icon: "📋",
      link: "/service/certificate_documentation"
    },
    {
      title: "توثيق وزاري",
      description: "التوثيق من الوزارات والجهات الحكومية",
      icon: "🏛️",
      link: "/service/ministry_authentication"
    },
    {
      title: "تجديد الجواز",
      description: "خدمة تجديد جوازات السفر اليمنية",
      icon: "📘",
      link: "/service/passport_renewal"
    },
    {
      title: "طلب تأشيرة",
      description: "المساعدة في طلبات التأشيرات للدول المختلفة",
      icon: "✈️",
      link: "/service/visa_request"
    },
    {
      title: "أدلة الحركة",
      description: "تحميل أدلة الحركة للطلاب اليمنيين حسب المنطقة",
      icon: "📖",
      link: "/movement-guides"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-yemen-black">خدماتنا</h1>
            <p className="text-xl text-gray-600">
              نقدم مجموعة شاملة من الخدمات للطلاب اليمنيين
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <FeatureCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
