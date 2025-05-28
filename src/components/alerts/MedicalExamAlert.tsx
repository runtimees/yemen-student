
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell } from 'lucide-react';

interface MedicalExamAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedicalExamAlert = ({ isOpen, onClose }: MedicalExamAlertProps) => {
  const handleDismiss = () => {
    // Mark as shown in session storage
    sessionStorage.setItem('medicalExamAlertShown', 'true');
    onClose();
  };

  const handleGoToMedicalExam = () => {
    window.open('https://ur.gov.iq/index/login', '_blank');
    handleDismiss();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDismiss}>
      <DialogContent className="max-w-md mx-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-yemen-red">
            <Bell className="h-6 w-6" />
            إشعار مهم - الفحص الطبي
          </DialogTitle>
        </DialogHeader>
        
        <Alert className="border-yemen-red bg-red-50">
          <AlertDescription className="text-gray-800 leading-relaxed">
            <strong className="block mb-2">📢 ملاحظة مهمة حول الفحص الطبي:</strong>
            يجب على جميع الطلاب إكمال الفحص الطبي بنجاح قبل المتابعة مع أي من الخدمات المتعلقة بالدراسة في العراق.
            <br /><br />
            يُرجى زيارة الصفحة التالية لإكمال فحصك الطبي في أحد المراكز المعتمدة:
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3 mt-4">
          <Button 
            onClick={handleGoToMedicalExam}
            className="bg-yemen-blue hover:bg-blue-700 text-white w-full"
          >
            🔗 الذهاب إلى صفحة الفحص الطبي
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="w-full"
          >
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalExamAlert;
