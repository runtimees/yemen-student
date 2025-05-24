
import { useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import AuthGuard from '@/components/auth/AuthGuard';
import ServiceFormHeader from '@/components/forms/ServiceFormHeader';
import PersonalInfoFields from '@/components/forms/PersonalInfoFields';
import FileUploadField from '@/components/forms/FileUploadField';
import FormActions from '@/components/forms/FormActions';
import { useServiceForm } from '@/hooks/useServiceForm';

const ServiceForm = () => {
  const { serviceType } = useParams<{ serviceType: string }>();
  const actualServiceType = serviceType || '';

  console.log('ServiceForm - Service type from URL params:', actualServiceType);

  const {
    formData,
    setFormData,
    isSubmitting,
    handleFileChange,
    handleSubmit,
  } = useServiceForm(actualServiceType);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <ServiceFormHeader serviceType={actualServiceType} />
            <CardContent className="p-4 sm:p-6">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ServiceForm;
