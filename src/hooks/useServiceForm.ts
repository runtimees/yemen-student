
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

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
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

    console.log('Authenticated user:', user);
    console.log('User ID (UUID):', user.id);
    console.log('User profile:', userProfile);
    console.log('Form data being submitted:', formData);

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

      // Handle file uploads if any
      const files = [
        { file: formData.passportFile, type: 'passport' },
        { file: formData.certificateFile, type: 'certificate' },
        { file: formData.visaFile, type: 'visa_request' },
      ].filter(item => item.file);

      console.log('Files to upload:', files.length);

      for (const { file, type } of files) {
        if (file) {
          console.log(`Processing file: ${file.name}, Size: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
          
          // Create file path with user ID in folder structure for RLS policy
          const filePath = `${user.id}/${request.id}/${type}/${file.name}`;
          
          console.log('Uploading file to path:', filePath);
          
          // Try upload with additional options to handle larger files
          const { error: uploadError } = await supabase.storage
            .from('files')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            console.error('Upload error details:', uploadError.message);
            
            // Provide more specific error messages based on error message content
            if (uploadError.message.includes('413') || uploadError.message.includes('exceeded the maximum allowed size') || uploadError.message.includes('too large')) {
              throw new Error(`الملف كبير جداً. الحد الأقصى المسموح في النظام أقل من المتوقع. حجم الملف: ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت`);
            }
            
            throw new Error(`فشل في رفع الملف ${type}: ${uploadError.message}`);
          }

          console.log('File uploaded successfully:', filePath);

          // Save file metadata
          const { error: fileMetadataError } = await supabase
            .from('files')
            .insert({
              request_id: request.id,
              file_type: type,
              file_path: filePath,
            });

          if (fileMetadataError) {
            console.error('File metadata error:', fileMetadataError);
            console.error('File metadata error details:', fileMetadataError.message, fileMetadataError.code);
            throw new Error(`فشل في حفظ بيانات الملف ${type}: ${fileMetadataError.message}`);
          }

          console.log('File metadata saved successfully for:', type);
        }
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
  };
};
