
import { Button } from '@/components/ui/button';

const OfflinePage = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yemen-blue to-yemen-black text-white p-4" dir="rtl">
      <div className="text-center max-w-md">
        {/* Animated emoji */}
        <div className="text-8xl mb-6 animate-bounce">
          📡
        </div>
        
        <h1 className="text-3xl font-bold mb-4">لا يوجد اتصال بالإنترنت</h1>
        
        <div className="text-6xl mb-6 space-x-2">
          <span className="inline-block animate-pulse">😞</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>📱</span>
          <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>💔</span>
        </div>
        
        <p className="text-lg mb-8 text-gray-200">
          يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى
        </p>
        
        <Button 
          onClick={handleRetry}
          className="bg-yemen-red hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg"
        >
          المحاولة مرة أخرى 🔄
        </Button>
        
        <div className="mt-8 text-4xl space-x-2">
          <span>🌐</span>
          <span>📶</span>
          <span>💻</span>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
