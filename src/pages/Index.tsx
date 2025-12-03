import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from '@/components/home/FeatureCard';
import NewsCarousel from '@/components/home/NewsCarousel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import OfflinePage from '@/components/OfflinePage';
import LoginPrompt from '@/components/auth/LoginPrompt';

const Index = () => {
  const { isAuthenticated, userProfile } = useAuth();
  const { toast } = useToast();
  const isOnline = useOfflineDetection();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDiscussionGroupsOpen, setIsDiscussionGroupsOpen] = useState(false);
  const [isStudentLinksOpen, setIsStudentLinksOpen] = useState(false);

  useEffect(() => {
    // Show login prompt immediately when page loads if user is not authenticated
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1000); // Show after 1 second for better UX

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Show login notification if the user is already logged in when they load the page
    if (isAuthenticated && userProfile) {
      toast({
        title: `مرحباً ${userProfile.full_name_ar}`, 
        description: "أنت مسجل الدخول في اتحاد الطلاب اليمنيين في العراق نجد",
      });
    }
  }, [isAuthenticated, userProfile]);

  // Show offline page when no internet connection
  if (!isOnline) {
    return <OfflinePage />;
  }

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
    },
    {
      title: "مكتبة الطلاب",
      description: "تصفح الملخصات والأسئلة وملفات الدراسة PDF المعدة من قبل طلاب الجامعات اليمنية والعراقية",
      icon: "📚",
      link: "/student-library"
    }
  ];

  const discussionGroups = [
    {
      name: "🩺 مجموعة النقاش الطبي",
      link: "https://t.me/medical_group_edu"
    },
    {
      name: "🏗️ مجموعة النقاش الهندسي", 
      link: "https://t.me/engineering_group_edu"
    },
    {
      name: "💻 مجموعة الحاسوب والتقنية",
      link: "https://t.me/tech_group_edu"
    },
    {
      name: "🌐 المجموعة الأكاديمية العامة",
      link: "https://t.me/general_group_edu"
    }
  ];

  const studentServiceLinks = [
    {
      name: "🩺 صفحة الفحص الطبي",
      link: "https://ur.gov.iq/index/login",
      description: "يجب على جميع الطلاب إكمال الفحص الطبي بنجاح قبل بدء إجراءات التقديم للدراسة في العراق. يُرجى الدخول على الرابط أعلاه وإجراء الفحص في المراكز الطبية المعتمدة."
    },
    {
      name: "🏠 صفحة التسجيل في السكن",
      link: "https://ur.gov.iq/index/login"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      {/* Login Prompt Modal */}
      {showLoginPrompt && !isAuthenticated && (
        <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yemen-black via-gray-800 to-gray-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-full overflow-hidden border-4 border-yemen-red shadow-lg w-32 h-32">
              <img 
                src="/lovable-uploads/336b3ba1-da29-454b-a892-70b85883b355.png" 
                alt="شعار اتحاد الطلاب اليمنيين في العراق نجد" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 fade-in" style={{ animationDelay: '0.4s' }}>
            اتحاد الطلاب اليمنيين في العراق نجد
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 fade-in" style={{ animationDelay: '0.6s' }}>
            نحو تعليم عالٍ أسهل وأكثر تمكينًا
          </p>
        </div>
      </section>

      {/* News Carousel */}
      <NewsCarousel />

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-yemen-black fade-in">خدمات المنصة</h2>
          
          <Tabs defaultValue="services" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-1 gap-1">
              <TabsTrigger value="services" className="text-xs sm:text-sm md:text-base px-2 py-2 h-auto leading-tight">
                <span className="block">🔧</span>
                <span className="block">الخدمات الأساسية</span>
              </TabsTrigger>
              <TabsTrigger value="student-links" className="text-xs sm:text-sm md:text-base px-2 py-2 h-auto leading-tight">
                <span className="block">📎</span>
                <span className="block">روابط الخدمات الطلابية</span>
              </TabsTrigger>
              <TabsTrigger value="discussion" className="text-xs sm:text-sm md:text-base px-2 py-2 h-auto leading-tight">
                <span className="block">💬</span>
                <span className="block">مجموعات النقاش</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs sm:text-sm md:text-base px-2 py-2 h-auto leading-tight">
                <span className="block">📢</span>
                <span className="block">الإعلانات الأكاديمية</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="services">
              {/* Temporary Unavailability Notice */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-800">
                  <span className="text-xl">⚠️</span>
                  <p className="font-medium">الخدمات معلقة مؤقتاً</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 opacity-50 pointer-events-none">
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
            </TabsContent>
            
            <TabsContent value="student-links">
              <div className="max-w-2xl mx-auto">
                <Collapsible open={isStudentLinksOpen} onOpenChange={setIsStudentLinksOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-yemen-blue">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📎</span>
                      <h3 className="text-xl font-bold text-yemen-black">روابط الخدمات الطلابية</h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isStudentLinksOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="grid gap-4">
                      {studentServiceLinks.map((service, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-yemen-blue">
                          <a
                            href={service.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-gray-700 hover:text-yemen-blue transition-colors font-medium"
                          >
                            <span className="text-lg">{service.name.split(' ')[0]}</span>
                            <span>{service.name.substring(service.name.indexOf(' ') + 1)}</span>
                          </a>
                          {service.description && (
                            <p className="mt-3 text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border-r-4 border-yemen-blue">
                              {service.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
            
            <TabsContent value="discussion">
              <div className="max-w-2xl mx-auto">
                <Collapsible open={isDiscussionGroupsOpen} onOpenChange={setIsDiscussionGroupsOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-yemen-blue">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💬</span>
                      <h3 className="text-xl font-bold text-yemen-black">مجموعات النقاش الأكاديمية</h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isDiscussionGroupsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="grid gap-3">
                      {discussionGroups.map((group, index) => (
                        <a
                          key={index}
                          href={group.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-yemen-blue"
                        >
                          <span className="text-lg">{group.name.split(' ')[0]}</span>
                          <span className="text-gray-700 hover:text-yemen-blue transition-colors">
                            {group.name.substring(group.name.indexOf(' ') + 1)}
                          </span>
                        </a>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </TabsContent>
            
            <TabsContent value="announcements">
              <div className="max-w-md mx-auto">
                <a
                  href="https://t.me/edu_announcements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-8 bg-gradient-to-r from-yemen-blue to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">📢</div>
                    <h3 className="text-xl font-bold mb-2">الإعلانات الأكاديمية</h3>
                    <p className="text-blue-100">انضم إلى قناة الإعلانات للحصول على آخر التحديثات</p>
                  </div>
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-in">
            <h2 className="text-3xl font-bold mb-6 text-yemen-black">عن المنصة</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              اتحاد الطلاب اليمنيين في العراق نجد هو منصة متكاملة تهدف إلى تسهيل وتحسين تجربة الطلاب اليمنيين الدارسين في العراق،
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
    </div>
  );
};

export default Index;
