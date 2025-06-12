
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { translateServiceType, translateStatus } from '@/utils/requestUtils';
import { Badge } from '@/components/ui/badge';

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

  // Function to get the status color based on the current status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get the display status with admin notes - always returns an object
  const getDisplayStatus = () => {
    if (!requestData) {
      return {
        status: 'غير متوفر',
        notes: null
      };
    }
    
    // Show the translated status
    const translatedStatus = translateStatus(requestData.status);
    
    // If admin notes exist and are not empty, show them as additional information
    if (requestData.admin_notes && requestData.admin_notes.trim() !== '') {
      return {
        status: translatedStatus,
        notes: requestData.admin_notes
      };
    }
    
    // If no admin notes, just show the status
    return {
      status: translatedStatus,
      notes: null
    };
  };

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

  const statusInfo = getDisplayStatus();

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
              
              <div className="p-2 bg-white border border-gray-300 rounded">
                <p className="text-sm font-medium text-gray-700 mb-1">حالة الطلب:</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(requestData.status)}>
                    {statusInfo.status}
                  </Badge>
                </div>
                {statusInfo.notes && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-700 mb-1">ملاحظات الإدارة:</p>
                    <p className="text-blue-800">{statusInfo.notes}</p>
                  </div>
                )}
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
              </div>
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
