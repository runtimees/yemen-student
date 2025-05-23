
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { translateServiceType, translateStatus } from '@/utils/requestUtils';
import StatusTimeline from './StatusTimeline';

interface RequestData {
  request_number: string;
  status: string;
  service_type: string;
  admin_notes: string | null;
  submission_date: string;
  created_at: string;
}

interface StatusTimelineItem {
  status: string;
  date: string;
  complete: boolean;
}

interface RequestResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestData: RequestData | null;
  statusTimeline: StatusTimelineItem[];
}

const RequestResultModal = ({ open, onOpenChange, requestData, statusTimeline }: RequestResultModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">نتيجة الاستعلام</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {requestData && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-xl mb-2">بيانات الطلب</h3>
                <p><strong>رقم الطلب:</strong> {requestData.request_number}</p>
                <p><strong>تاريخ التقديم:</strong> {new Date(requestData.created_at).toLocaleDateString('ar-SA')}</p>
                <p><strong>نوع الخدمة:</strong> {translateServiceType(requestData.service_type)}</p>
                <p><strong>حالة الطلب:</strong> <span className="font-bold text-yemen-blue">{translateStatus(requestData.status)}</span></p>
                
                {requestData.admin_notes && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p><strong>ملاحظات:</strong> {requestData.admin_notes}</p>
                  </div>
                )}
              </div>
              
              <StatusTimeline timeline={statusTimeline} />
            </>
          )}
          
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
