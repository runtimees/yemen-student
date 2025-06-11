
import { useServiceForm } from '@/hooks/useServiceForm';
import { ServiceFormHeader } from '@/components/forms/ServiceFormHeader';
import { PersonalInfoFields } from '@/components/forms/PersonalInfoFields';
import { FileUploadField } from '@/components/forms/FileUploadField';
import { FormActions } from '@/components/forms/FormActions';
import { SubmissionSuccess } from '@/components/forms/SubmissionSuccess';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ServiceForm = () => {
  const { user } = useAuth();
  const serviceType = new URLSearchParams(window.location.search).get('type') || 'certificate_authentication';
  
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
  } = useServiceForm(serviceType);

  const handleUrlChange = (field: string, url: string) => {
    // Handle URL changes for uploaded files
    console.log(`File uploaded for ${field}: ${url}`);
  };

  if (!user) {
    return <LoginPrompt />;
  }

  if (isSubmitted) {
    return (
      <SubmissionSuccess
        requestNumber={submittedRequestNumber}
        onBackToServices={handleBackToServices}
        onTrackRequest={handleTrackRequest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        <ServiceFormHeader serviceType={serviceType} />
        
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <PersonalInfoFields
                formData={formData}
                setFormData={setFormData}
                serviceType={serviceType}
              />

              <FileUploadField
                serviceType={serviceType}
                onFileChange={handleFileChange}
                onUrlChange={handleUrlChange}
              />

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="أضف أي ملاحظات أو تفاصيل إضافية هنا..."
                  rows={4}
                />
              </div>

              <FormActions
                isSubmitting={isSubmitting}
                onCancel={handleBackToServices}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceForm;
