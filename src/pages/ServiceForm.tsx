
import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const ServiceForm = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  
  const [formData, setFormData] = useState({
    fullNameArabic: user?.full_name_ar || '',
    fullNameEnglish: user?.full_name_en || '',
    universityName: '',
    major: '',
    additionalNotes: '',
    file: null as File | null,
  });

  if (!serviceType) {
    return <Navigate to="/services" />;
  }

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'certificate-auth':
        return 'تصديق الشهادات';
      case 'certificate-doc':
        return 'توثيق الشهادات';
      case 'ministry-auth':
        return 'تصديق الوزارة';
      case 'passport-renewal':
        return 'تجديد جواز السفر';
      case 'visa-request':
        return 'طلب تأشيرة دخول';
      default:
        return 'طلب خدمة';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً لتقديم طلب الخدمة",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate unique request number
      const generatedRequestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setRequestNumber(generatedRequestNumber);
      
      // Save request to database
      const { data: requestData, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          service_type: serviceType,
          status: 'submitted',
          request_number: generatedRequestNumber,
          submission_date: new Date().toISOString(),
          university_name: formData.universityName,
          major: formData.major,
          additional_notes: formData.additionalNotes
        })
        .select()
        .single();
      
      if (requestError) {
        throw new Error(requestError.message);
      }
      
      // Upload file if provided
      if (formData.file && requestData) {
        const fileExt = formData.file.name.split('.').pop();
        const fileName = `${user.id}/${generatedRequestNumber}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, formData.file);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        // Get file URL
        const { data: urlData } = supabase.storage
          .from('files')
          .getPublicUrl(fileName);
        
        // Save file reference to database
        const { error: fileError } = await supabase
          .from('files')
          .insert({
            request_id: requestData.id,
            file_type: serviceType,
            file_path: urlData.publicUrl
          });
        
        if (fileError) {
          console.error('Error saving file reference:', fileError);
        }
      }
      
      setSuccessModalOpen(true);
      toast({
        title: "تم تقديم الطلب بنجاح",
        description: `رقم الطلب: ${generatedRequestNumber}`,
      });
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "فشل تقديم الطلب",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    if (serviceType === 'visa-request') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="fullNameArabic">الاسم الكامل بالعربية</Label>
            <Input
              id="fullNameArabic"
              name="fullNameArabic"
              value={formData.fullNameArabic}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullNameEnglish">الاسم الكامل بالإنجليزية</Label>
            <Input
              id="fullNameEnglish"
              name="fullNameEnglish"
              value={formData.fullNameEnglish}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universityName">اسم الجامعة</Label>
            <Input
              id="universityName"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">التخصص</Label>
            <Input
              id="major"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">تحميل وثيقة طلب التأشيرة</Label>
            <Input id="file" type="file" onChange={handleFileChange} required />
          </div>
        </>
      );
    }

    // Default form fields for other services
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="fullNameArabic">الاسم الكامل بالعربية</Label>
          <Input
            id="fullNameArabic"
            name="fullNameArabic"
            value={formData.fullNameArabic}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullNameEnglish">الاسم الكامل بالإنجليزية</Label>
          <Input
            id="fullNameEnglish"
            name="fullNameEnglish"
            value={formData.fullNameEnglish}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="universityName">اسم الجامعة</Label>
          <Input
            id="universityName"
            name="universityName"
            value={formData.universityName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="major">التخصص</Label>
          <Input
            id="major"
            name="major"
            value={formData.major}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalNotes">ملاحظات إضافية</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file">
            {serviceType === 'passport-renewal'
              ? 'تحميل صورة جواز السفر'
              : 'تحميل صورة الشهادة'}
          </Label>
          <Input id="file" type="file" onChange={handleFileChange} required />
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">{getServiceTitle()}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderFormFields()}
              <Button 
                type="submit" 
                className="w-full bg-yemen-red hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري التقديم...' : 'تقديم الطلب'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">تم تقديم الطلب بنجاح</DialogTitle>
          </DialogHeader>
          <div className="text-center p-4">
            <div className="mb-4 flex justify-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <p className="mb-4">تم استلام طلبك وسيتم معالجته في أقرب وقت ممكن.</p>
            <p className="mb-4 font-bold">رقم الطلب: {requestNumber}</p>
            <p className="mb-4">يمكنك تتبع حالة طلبك من خلال صفحة "تتبع طلباتك".</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setSuccessModalOpen(false);
                  navigate('/track');
                }}
                className="bg-yemen-blue hover:bg-blue-700"
              >
                تتبع طلباتك
              </Button>
              <Button
                onClick={() => {
                  setSuccessModalOpen(false);
                  navigate('/services');
                }}
                variant="outline"
              >
                العودة للخدمات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceForm;
