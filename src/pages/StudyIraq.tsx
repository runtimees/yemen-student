
import { useEffect } from 'react';

const StudyIraq = () => {
  useEffect(() => {
    // Redirect to the actual Study in Iraq platform
    window.location.href = "https://studyiniraq.scrd-gate.gov.iq";
  }, []);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yemen-red mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">جاري تحويلك إلى منصة الدراسة في العراق</h1>
            <p className="text-gray-600 mb-4">سيتم تحويلك تلقائياً خلال ثوانٍ...</p>
            <p className="text-gray-500 text-sm mb-4">
              إذا لم يتم تحويلك تلقائياً، يرجى النقر على الرابط أدناه:
            </p>
            <a 
              href="https://studyiniraq.scrd-gate.gov.iq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yemen-blue hover:underline"
            >
              انتقل إلى منصة الدراسة في العراق
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyIraq;
