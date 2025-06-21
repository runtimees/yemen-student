
import { useServiceForm } from '@/hooks/useServiceForm';
import ServiceFormHeader from '@/components/forms/ServiceFormHeader';
import PersonalInfoFields from '@/components/forms/PersonalInfoFields';
import FileUploadField from '@/components/forms/FileUploadField';
import FormActions from '@/components/forms/FormActions';
import SubmissionSuccess from '@/components/forms/SubmissionSuccess';
import LoginPrompt from '@/components/auth/LoginPrompt';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

const ServiceForm = () => {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState<string>('certificate_authentication');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    const pathServiceType = window.location.pathname.split('/').pop();
    
    console.log('ServiceForm - URL params type:', typeParam);
    console.log('ServiceForm - Path service type:', pathServiceType);
    
    // Determine service type from URL
    let finalServiceType = 'certificate_authentication';
    if (typeParam) {
      finalServiceType = typeParam;
    } else if (pathServiceType && pathServiceType !== 'service') {
      finalServiceType = pathServiceType;
    }
    
    console.log('ServiceForm - Final service type:', finalServiceType);
    setServiceType(finalServiceType);
  }, []);
  
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
    uploadedFileUrl,
    setUploadedFileUrl,
  } = useServiceForm(serviceType);

  const handleUrlChange = (field: string, url: string) => {
    console.log(`File uploaded for ${field}: ${url}`);
    setUploadedFileUrl(url);
  };

  if (!user) {
    return <LoginPrompt onClose={() => {}} />;
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
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceForm;
