
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { translateServiceType, translateStatus } from '@/utils/requestUtils';

interface RequestData {
  request_number: string;
  status: string;
  service_type: string;
  admin_notes: string | null;
  submission_date: string;
  created_at: string;
}

interface RequestResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestData: RequestData | null;
}

const RequestResultModal = ({ open, onOpenChange, requestData }: RequestResultModalProps) => {
  console.log('RequestResultModal - requestData:', requestData);

  if (!requestData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">نتيجة الاستعلام</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-center text-red-500">لم يتم العثور على بيانات الطلب</p>
            <div className="mt-6 text-center">
              <Button onClick={() => onOpenChange(false)} className="bg-yemen-blue hover:bg-blue-700">
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">نتيجة الاستعلام</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-xl mb-4">بيانات الطلب</h3>
            <div className="space-y-3">
              <div className="p-2 bg-white border border-gray-300 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">رقم الطلب:</p>
                <p className="font-semibold">{requestData.request_number || 'غير متوفر'}</p>
              </div>
              
              <div className="p-2 bg-white border border-gray-300 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">تاريخ التقديم:</p>
                <p className="font-semibold">
                  {requestData.created_at ? 
                    new Date(requestData.created_at).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    'غير متوفر'
                  }
                </p>
              </div>
              
              <div className="p-2 bg-white border border-gray-300 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">نوع الخدمة:</p>
                <p className="font-semibold">
                  {requestData.service_type ? 
                    translateServiceType(requestData.service_type) : 
                    'غير متوفر'
                  }
                </p>
              </div>
              
              <div className="mt-4">
                {/* Order Received Status */}
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    ✓
                  </div>
                  <div className="ms-3 flex-1">
                    <p className="font-bold text-gray-900">تم استلام الطلب</p>
                    <p className="text-sm text-gray-600">
                      {requestData.created_at ? 
                        new Date(requestData.created_at).toLocaleDateString('ar-SA') : 
                        'غير متوفر'
                      }
                    </p>
                  </div>
                </div>

                {/* Current Order Status */}
                <div className="mt-4 p-3 bg-white border border-gray-300 rounded">
                  <label className="block text-sm font-medium text-gray-700 mb-2">حالة الطلب:</label>
                  <div className="w-full p-2 border border-gray-300 rounded bg-gray-50">
                    {requestData.status ? 
                      translateStatus(requestData.status) : 
                      'غير متوفر'
                    }
                  </div>
                </div>
              </div>
              
              {requestData.admin_notes && (
                <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <p><strong>ملاحظات:</strong> {requestData.admin_notes}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button onClick={() => onOpenChange(false)} className="bg-yemen-blue hover:bg-blue-700">
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestResultModal;
