
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Services = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const services = [
    {
      id: 'certificate-auth',
      title: 'تصديق الشهادات',
      description: 'تصديق وتوثيق الشهادات الدراسية',
      icon: '📜',
    },
    {
      id: 'certificate-doc',
      title: 'توثيق الشهادات',
      description: 'توثيق الشهادات من الجهات الرسمية',
      icon: '📋',
    },
    {
      id: 'ministry-auth',
      title: 'تصديق الوزارة',
      description: 'تصديق الوثائق من وزارة التعليم العالي',
      icon: '🏛️',
    },
    {
      id: 'passport-renewal',
      title: 'تجديد جواز السفر',
      description: 'طلب تجديد جواز السفر اليمني',
      icon: '🛂',
    },
    {
      id: 'visa-request',
      title: 'طلب تأشيرة دخول',
      description: 'طلب الحصول على تأشيرة دخول للعراق',
      icon: '✈️',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4 text-yemen-black">خدماتنا</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم مجموعة متنوعة من الخدمات لمساعدة الطلبة اليمنيين في العراق على إكمال إجراءاتهم بسهولة وسرعة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-yemen-red text-white rounded-full">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                  </div>
                  <CardTitle className="text-center text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link to={`/service-form/${service.id}`}>
                    <Button className="bg-yemen-blue hover:bg-blue-700 w-full">
                      تقديم الطلب
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-yemen-black">هل تحتاج إلى مساعدة؟</h2>
            <p className="text-center text-gray-600 mb-6">
              إذا كنت بحاجة إلى مساعدة في تقديم طلب الخدمة، يمكنك التواصل معنا عبر البريد الإلكتروني أو رقم الهاتف المذكور أدناه.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" className="border-yemen-red text-yemen-red hover:bg-yemen-red hover:text-white">
                اتصل بنا
              </Button>
            </div>
          </div>
        </div>
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

export default Services;
