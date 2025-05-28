
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import AuthGuard from '@/components/auth/AuthGuard';
import ServiceFormHeader from '@/components/forms/ServiceFormHeader';
import PersonalInfoFields from '@/components/forms/PersonalInfoFields';
import FileUploadField from '@/components/forms/FileUploadField';
import FormActions from '@/components/forms/FormActions';
import SubmissionSuccess from '@/components/forms/SubmissionSuccess';
import MedicalExamAlert from '@/components/alerts/MedicalExamAlert';
import { useServiceForm } from '@/hooks/useServiceForm';
import { useMedicalExamAlert } from '@/hooks/useMedicalExamAlert';

const ServiceForm = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const actualServiceType = serviceType || '';

  console.log('ServiceForm - Service type from URL params:', actualServiceType);

  const {
    formData,
    setFormData,
    isSubmitting,
    isSubmitted,
    submittedRequestNumber,
    handleFileChange,
    handleSubmit,
    handleBackToServices,
    handleTrackRequest,
  } = useServiceForm(actualServiceType);

  const { showAlert, triggerAlert, closeAlert } = useMedicalExamAlert();

  // Trigger medical exam alert when accessing any service
  useEffect(() => {
    const servicesRequiringMedicalExam = [
      'certificate_authentication',
      'certificate_documentation', 
      'ministry_authentication',
      'passport_renewal',
      'visa_request'
    ];

    if (servicesRequiringMedicalExam.includes(actualServiceType)) {
      // Small delay to ensure the component is mounted
      const timer = setTimeout(() => {
        triggerAlert();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [actualServiceType, triggerAlert]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <ServiceFormHeader serviceType={actualServiceType} />
            <CardContent className="p-4 sm:p-6">
              {isSubmitted ? (
                <SubmissionSuccess 
                  requestNumber={submittedRequestNumber}
                  onBackToServices={handleBackToServices}
                  onTrackRequest={handleTrackRequest}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <PersonalInfoFields 
                    formData={formData} 
                    setFormData={setFormData} 
                  />

                  <FileUploadField
                    serviceType={actualServiceType}
                    onFileChange={handleFileChange}
                  />

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      placeholder="أضف أي ملاحظات أو تفاصيل إضافية..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      rows={4}
                      className="w-full resize-none"
                    />
                  </div>

                  <FormActions isSubmitting={isSubmitting} />
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Medical Exam Alert Modal */}
      <MedicalExamAlert 
        isOpen={showAlert}
        onClose={closeAlert}
      />
    </AuthGuard>
  );
};

export default ServiceForm;
