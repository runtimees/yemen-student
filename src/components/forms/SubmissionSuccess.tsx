
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Search } from 'lucide-react';

interface SubmissionSuccessProps {
  requestNumber: string;
  onBackToServices: () => void;
  onTrackRequest: () => void;
}

const SubmissionSuccess = ({ 
  requestNumber, 
  onBackToServices, 
  onTrackRequest 
}: SubmissionSuccessProps) => {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-green-600">
          تم إرسال الطلب بنجاح! ✅
        </h2>
        <p className="text-gray-600">
          تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border-2 border-green-200">
        <h3 className="font-semibold text-gray-800 mb-2">رقم الطلب</h3>
        <p className="text-2xl font-bold text-green-600 font-mono">
          {requestNumber}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          احتفظ بهذا الرقم لتتبع حالة طلبك
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onTrackRequest}
          className="w-full bg-yemen-blue hover:bg-blue-700 text-white"
        >
          <Search className="ml-2 h-4 w-4" />
          تتبع الطلب
        </Button>
        
        <Button
          onClick={onBackToServices}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى الخدمات
        </Button>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
