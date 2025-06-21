
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface FormData {
  fullNameAr: string;
  fullNameEn: string;
  universityName: string;
  major: string;
  additionalNotes: string;
  passportFile: File | null;
  certificateFile: File | null;
  visaFile: File | null;
}

export const useServiceForm = (serviceType: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    fullNameAr: '',
    fullNameEn: '',
    universityName: '',
    major: '',
    additionalNotes: '',
    passportFile: null,
    certificateFile: null,
    visaFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string>('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const getFileType = (serviceType: string) => {
    if (serviceType === 'passport_renewal') {
      return 'passport';
    } else if (serviceType === 'certificate_authentication' || serviceType === 'certificate_documentation' || serviceType === 'ministry_authentication') {
      return 'certificate';
    } else {
      return 'visa_request';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFileUrl) {
      toast({
        title: "خطأ",
        description: "يجب رفع الملف المطلوب أولاً",
        variant: "destructive",
      });
      return;
    }

    console.log('Authenticated user:', user);
    console.log('User ID (UUID):', user.id);
    console.log('User profile:', userProfile);
    console.log('Form data being submitted:', formData);
    console.log('Uploaded file URL:', uploadedFileUrl);

    setIsSubmitting(true);

    try {
      // Generate request number
      const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Create request - include both Arabic and English names
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          service_type: serviceType,
          status: 'submitted',
          request_number: requestNumber,
          submission_date: new Date().toISOString().split('T')[0],
          full_name_ar: formData.fullNameAr,
          full_name_en: formData.fullNameEn,
          university_name: formData.universityName || null,
          major: formData.major || null,
          additional_notes: formData.additionalNotes || null,
        })
        .select()
        .single();

      if (requestError) {
        console.error('Error creating request:', requestError);
        console.error('Request error details:', requestError.message, requestError.code, requestError.details);
        throw new Error('فشل في إنشاء الطلب: ' + requestError.message);
      }

      console.log('Request created successfully:', request);

      // Save file metadata to database
      if (uploadedFileUrl) {
        const fileType = getFileType(serviceType);
        console.log('Saving file metadata:', { requestId: request.id, fileType, filePath: uploadedFileUrl });
        
        const { error: fileMetadataError } = await supabase
          .from('files')
          .insert({
            request_id: request.id,
            file_type: fileType,
            file_path: uploadedFileUrl,
          });

        if (fileMetadataError) {
          console.error('File metadata error:', fileMetadataError);
          console.error('File metadata error details:', fileMetadataError.message, fileMetadataError.code);
          throw new Error(`فشل في حفظ بيانات الملف: ${fileMetadataError.message}`);
        }

        console.log('File metadata saved successfully');
      }

      // Set success state instead of navigating immediately
      setSubmittedRequestNumber(requestNumber);
      setIsSubmitted(true);

      toast({
        title: "تم إرسال الطلب بنجاح! ✅",
        description: `رقم الطلب: ${requestNumber}\n\nيمكنك استخدام هذا الرقم في تتبع حالة طلبك من خلال صفحة "تتبع الطلبات"`,
        duration: 10000,
      });

    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب';
      toast({
        title: "خطأ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToServices = () => {
    navigate('/services');
  };

  const handleTrackRequest = () => {
    navigate('/track');
  };

  return {
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
  };
};
