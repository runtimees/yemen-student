
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeatureCard from '@/components/home/FeatureCard';
import NewsTicker from '@/components/home/NewsTicker';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Show login notification if the user is already logged in when they load the page
    if (isAuthenticated && user) {
      toast({
        title: `مرحباً ${user.full_name_ar}`, 
        description: "أنت مسجل الدخول في منصة الطلبة اليمنيين",
      });
    }
  }, [isAuthenticated, user]);

  const features = [
    {
      title: "خدماتنا",
      description: "استكشف جميع الخدمات التي نقدمها للطلبة اليمنيين",
      icon: "🛠️",
      link: "/services"
    },
    {
      title: "تتبع طلباتك",
      description: "تابع حالة طلباتك المقدمة واستعلم عنها",
      icon: "📊",
      link: "/track"
    },
    {
      title: "رؤيتنا",
      description: "تعرف على رؤيتنا ورسالتنا وأهدافنا",
      icon: "🌟",
      link: "/vision"
    },
    {
      title: "منصة الدراسة في العراق",
      description: "انتقل إلى منصة الدراسة في العراق الرسمية",
      icon: "🎓",
      link: "/study-iraq"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-yemen-black via-gray-800 to-gray-900 text-white py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="rounded-full overflow-hidden border-4 border-yemen-red shadow-lg w-32 h-32">
                <img 
                  src="/lovable-uploads/3f42ec74-bc6b-49c4-8f8c-3a5e6895dc36.png" 
                  alt="Yemen Student Platform Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 fade-in" style={{ animationDelay: '0.4s' }}>
              منصة الطلبة اليمنيين في العراق
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 fade-in" style={{ animationDelay: '0.6s' }}>
              نحو تعليم عالٍ أسهل وأكثر تمكينًا
            </p>
          </div>
        </section>

        {/* News Ticker */}
        <NewsTicker />

        {/* Features Section */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-yemen-black fade-in">خدمات المنصة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="fade-in hover-card-effect" 
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    link={feature.link}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 bg-gradient-to-br from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center fade-in">
              <h2 className="text-3xl font-bold mb-6 text-yemen-black">عن المنصة</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                منصة الطلبة اليمنيين في العراق هي منصة متكاملة تهدف إلى تسهيل وتحسين تجربة الطلاب اليمنيين الدارسين في العراق،
                من خلال توفير خدمات إلكترونية متنوعة تشمل توثيق الشهادات وتجديد جوازات السفر وتسهيل إجراءات الحصول على تأشيرات الدخول،
                بالإضافة إلى متابعة حالة الطلبات المقدمة بشكل إلكتروني.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="bg-yemen-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link to="/services">
                    استكشف خدماتنا
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 bg-yemen-blue text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-lg">طالب مستفيد</div>
              </div>
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-4xl font-bold mb-2">20+</div>
                <div className="text-lg">جامعة عراقية</div>
              </div>
              <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-lg">خدمة متنوعة</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
