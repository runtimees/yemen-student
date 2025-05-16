
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeatureCard from '@/components/home/FeatureCard';
import NewsTicker from '@/components/home/NewsTicker';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

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
        <section className="bg-gradient-to-r from-yemen-black to-gray-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/3f42ec74-bc6b-49c4-8f8c-3a5e6895dc36.png" 
                alt="Yemen Student Platform Logo" 
                className="h-32 w-auto"
              />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              منصة الطلبة اليمنيين في العراق
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              نحو تعليم عالٍ أسهل وأكثر تمكينًا
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={openLogin}
                className="bg-yemen-red hover:bg-red-700 text-white px-8 py-2 rounded-md text-lg"
              >
                تسجيل الدخول
              </Button>
              <Button
                onClick={openSignup}
                variant="outline"
                className="bg-transparent hover:bg-white hover:text-yemen-black text-white border border-white px-8 py-2 rounded-md text-lg"
              >
                إنشاء حساب جديد
              </Button>
            </div>
          </div>
        </section>

        {/* News Ticker */}
        <NewsTicker />

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-yemen-black">خدمات المنصة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  link={feature.link}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-yemen-black">عن المنصة</h2>
              <p className="text-lg text-gray-700 mb-8">
                منصة الطلبة اليمنيين في العراق هي منصة متكاملة تهدف إلى تسهيل وتحسين تجربة الطلاب اليمنيين الدارسين في العراق،
                من خلال توفير خدمات إلكترونية متنوعة تشمل توثيق الشهادات وتجديد جوازات السفر وتسهيل إجراءات الحصول على تأشيرات الدخول،
                بالإضافة إلى متابعة حالة الطلبات المقدمة بشكل إلكتروني.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Auth Modals */}
      <LoginForm
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSwitchToSignup={openSignup}
      />
      <SignupForm
        open={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
};

export default Index;
