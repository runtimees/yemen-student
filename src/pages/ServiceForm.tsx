
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ServiceForm = () => {
  const { serviceId } = useParams();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate logged in state for now
  const [formData, setFormData] = useState({
    fullNameArabic: '',
    fullNameEnglish: '',
    universityName: '',
    specialization: '',
    requestNumber: '',
    file: null,
  });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const { toast } = useToast();

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  if (!serviceId) {
    return <Navigate to="/services" />;
  }

  const getServiceTitle = () => {
    switch (serviceId) {
      case 'certificate-auth':
        return 'تصديق الشهادات';
      case 'certificate-doc':
        return 'توثيق الشهادات';
      case 'ministry-auth':
        return 'تصديق الوزارة';
      case 'passport-renewal':
        return 'تجديد جواز السفر';
      case 'visa-request':
        return 'طلب تأشيرة دخول';
      default:
        return 'طلب خدمة';
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: any) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLogin();
      return;
    }

    // Show success modal/message
    setSuccessModalOpen(true);
  };

  const renderFormFields = () => {
    if (serviceId === 'visa-request') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullNameArabic">الاسم الأول</Label>
            <Input
              id="fullNameArabic"
              name="fullNameArabic"
              value={formData.fullNameArabic}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullNameEnglish">الاسم الثاني</Label>
            <Input
              id="fullNameEnglish"
              name="fullNameEnglish"
              value={formData.fullNameEnglish}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requestNumber">رقم الطلب</Label>
            <Input
              id="requestNumber"
              name="requestNumber"
              value={formData.requestNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universityName">اسم الجامعة</Label>
            <Input
              id="universityName"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">التخصص</Label>
            <Input
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">تحميل وثيقة طلب التأشيرة</Label>
            <Input id="file" type="file" onChange={handleFileChange} required />
          </div>
        </>
      );
    }

    // Default form fields for other services
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="fullNameArabic">الاسم الكامل بالعربية</Label>
          <Input
            id="fullNameArabic"
            name="fullNameArabic"
            value={formData.fullNameArabic}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullNameEnglish">الاسم الكامل بالإنجليزية</Label>
          <Input
            id="fullNameEnglish"
            name="fullNameEnglish"
            value={formData.fullNameEnglish}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">
            {serviceId === 'passport-renewal'
              ? 'تحميل صورة جواز السفر'
              : 'تحميل صورة الشهادة'}
          </Label>
          <Input id="file" type="file" onChange={handleFileChange} required />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">{getServiceTitle()}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}
              <Button type="submit" className="w-full bg-yemen-red hover:bg-red-700">
                تقديم الطلب
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">تم تقديم الطلب بنجاح</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">
            <div className="mb-4 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <p className="mb-4">تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.</p>
            <Button
              onClick={() => setSuccessModalOpen(false)}
              className="bg-yemen-blue hover:bg-blue-700"
            >
              العودة للخدمات
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

export default ServiceForm;
