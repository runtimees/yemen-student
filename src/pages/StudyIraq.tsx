
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const StudyIraq = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This is just a placeholder. In a real implementation, we would redirect to the actual Study in Iraq platform
    const timer = setTimeout(() => {
      // For demo purposes, we'll just navigate back to the home page
      navigate('/');
      // In a real implementation, you would use:
      // window.location.href = "https://study-iraq-platform.com";
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yemen-red mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">جاري تحويلك إلى منصة الدراسة في العراق</h1>
            <p className="text-gray-600 mb-4">سيتم تحويلك تلقائياً خلال ثوانٍ...</p>
            <p className="text-gray-500 text-sm">
              إذا لم يتم تحويلك تلقائياً، يرجى النقر على الرابط أدناه:
            </p>
            <button className="text-yemen-blue hover:underline mt-2">
              انتقل إلى منصة الدراسة في العراق
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudyIraq;
