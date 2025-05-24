import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';

const ServiceForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const serviceType = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    fullNameAr: '',
    fullNameEn: '',
    universityName: '',
    major: '',
    additionalNotes: '',
    passportFile: null as File | null,
    certificateFile: null as File | null,
    visaFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceNames = {
    certificate_authentication: 'توثيق الشهادات',
    certificate_documentation: 'توثيق الوثائق',
    ministry_authentication: 'التوثيق من الوزارة',
    passport_renewal: 'تجديد الجواز',
    visa_request: 'طلب فيزا',
  };

  const validateFileSize = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    return file.size <= maxSize;
  };

  const handleFileChange = (field: string, file: File | null) => {
    if (file && !validateFileSize(file)) {
      toast({
        title: "خطأ في حجم الملف",
        description: "حجم الملف يجب أن لا يتجاوز 2 ميجابايت",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate request number
      const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Create request
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: userProfile.id.toString(),
          service_type: serviceType,
          status: 'submitted',
          request_number: requestNumber,
          submission_date: new Date().toISOString().split('T')[0],
          university_name: formData.universityName || null,
          major: formData.major || null,
          additional_notes: formData.additionalNotes || null,
        })
        .select()
        .single();

      if (requestError) {
        console.error('Error creating request:', requestError);
        throw new Error('فشل في إنشاء الطلب');
      }

      // Handle file uploads if any
      const files = [
        { file: formData.passportFile, type: 'passport' },
        { file: formData.certificateFile, type: 'certificate' },
        { file: formData.visaFile, type: 'visa_request' },
      ].filter(item => item.file);

      for (const { file, type } of files) {
        if (file) {
          const filePath = `uploads/${request.id}/${type}/${file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('files')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue; // Continue with other files if one fails
          }

          // Save file metadata
          await supabase
            .from('files')
            .insert({
              request_id: request.id,
              file_type: type,
              file_path: filePath,
            });
        }
      }

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: `رقم الطلب: ${requestNumber}`,
      });

      navigate('/');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الطلب",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileFieldLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'passport_renewal':
        return 'صورة الجواز (PDF)';
      case 'certificate_authentication':
      case 'certificate_documentation':
      case 'ministry_authentication':
        return 'صورة الشهادة (PDF)';
      case 'visa_request':
        return 'المستندات المطلوبة (PDF)';
      default:
        return 'المستندات (PDF)';
    }
  };

  const getFileAcceptType = (serviceType: string) => {
    switch (serviceType) {
      case 'passport_renewal':
        return '.pdf';
      case 'certificate_authentication':
      case 'certificate_documentation':
      case 'ministry_authentication':
        return '.pdf';
      case 'visa_request':
        return '.pdf';
      default:
        return '.pdf';
    }
  };

  const getServiceTitle = (serviceType: string) => {
    return serviceNames[serviceType as keyof typeof serviceNames] || 'خدمة غير محددة';
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl sm:text-2xl text-yemen-blue">
                {getServiceTitle(serviceType)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name-ar">الاسم الكامل بالعربية *</Label>
                  <Input
                    id="full-name-ar"
                    placeholder="أدخل الاسم الكامل بالعربية"
                    value={formData.fullNameAr}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullNameAr: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full-name-en">الاسم الكامل بالإنجليزية *</Label>
                  <Input
                    id="full-name-en"
                    placeholder="Enter full name in English"
                    value={formData.fullNameEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullNameEn: e.target.value }))}
                    required
                    className="w-full"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">اسم الجامعة *</Label>
                  <Input
                    id="university"
                    placeholder="أدخل اسم الجامعة"
                    value={formData.universityName}
                    onChange={(e) => setFormData(prev => ({ ...prev, universityName: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="major">التخصص *</Label>
                  <Input
                    id="major"
                    placeholder="أدخل التخصص"
                    value={formData.major}
                    onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">{getFileFieldLabel(serviceType)} *</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept={getFileAcceptType(serviceType)}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (serviceType === 'passport_renewal') {
                        handleFileChange('passportFile', file);
                      } else if (serviceType === 'certificate_authentication' || serviceType === 'certificate_documentation' || serviceType === 'ministry_authentication') {
                        handleFileChange('certificateFile', file);
                      } else {
                        handleFileChange('visaFile', file);
                      }
                    }}
                    required
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500">
                    يجب أن يكون الملف بصيغة PDF (الحد الأقصى: 2MB)
                  </p>
                </div>

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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 bg-yemen-blue hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/services')}
                    className="w-full sm:w-auto px-6"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ServiceForm;
