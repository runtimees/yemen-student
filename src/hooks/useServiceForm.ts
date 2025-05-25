
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { FileUploadService } from '@/services/fileUploadService';

interface FormData {
  fullNameAr: string;
  fullNameEn: string;
  universityName: string;
  major: string;
  additionalNotes: string;
  passportFile: File | null;
  certificateFile: File | null;
  visaFile: File | null;
  uploadMethod: 'client' | 'supabase'; // New field to specify upload method
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
    uploadMethod: 'client', // Default to client-side upload
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const setUploadMethod = (method: 'client' | 'supabase') => {
    setFormData(prev => ({ ...prev, uploadMethod: method }));
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

    console.log('Form submission started with upload method:', formData.uploadMethod);
    console.log('Authenticated user:', user);
    console.log('User ID (UUID):', user.id);

    setIsSubmitting(true);

    try {
      // Generate request number
      const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Create request
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
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
        throw new Error('فشل في إنشاء الطلب: ' + requestError.message);
      }

      console.log('Request created successfully:', request);

      // Handle file uploads based on selected method
      const files = [
        { file: formData.passportFile, type: 'passport' },
        { file: formData.certificateFile, type: 'certificate' },
        { file: formData.visaFile, type: 'visa_request' },
      ].filter(item => item.file);

      console.log(`Files to upload: ${files.length} using method: ${formData.uploadMethod}`);

      for (const { file, type } of files) {
        if (file) {
          const uploadOptions = {
            method: formData.uploadMethod,
            userId: user.id,
            requestId: request.id,
            fileType: type
          };

          let uploadResult;
          
          if (formData.uploadMethod === 'supabase') {
            // Direct Supabase upload
            uploadResult = await FileUploadService.uploadToSupabase(file, uploadOptions);
            
            if (!uploadResult.success) {
              throw new Error(uploadResult.error || `فشل في رفع الملف ${type}`);
            }

            // Save metadata for Supabase uploads
            const metadataResult = await FileUploadService.saveFileMetadata(
              request.id, 
              type, 
              uploadResult.filePath!
            );
            
            if (!metadataResult.success) {
              throw new Error(metadataResult.error || `فشل في حفظ بيانات الملف ${type}`);
            }
            
          } else {
            // Client-side upload (original method)
            uploadResult = await FileUploadService.uploadClientSide(file, uploadOptions);
            
            if (!uploadResult.success) {
              throw new Error(uploadResult.error || `فشل في معالجة الملف ${type}`);
            }

            // For client-side uploads, we still need to upload to Supabase storage
            const filePath = `${user.id}/${request.id}/${type}/${file.name}`;
            
            console.log('Uploading client file to Supabase path:', filePath);
            
            const { error: uploadError } = await supabase.storage
              .from('files')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error('Client upload to Supabase error:', uploadError);
              
              if (uploadError.message.includes('413') || 
                  uploadError.message.includes('exceeded the maximum allowed size') || 
                  uploadError.message.includes('too large')) {
                throw new Error(`الملف كبير جداً. الحد الأقصى المسموح في النظام أقل من المتوقع. حجم الملف: ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت`);
              }
              
              throw new Error(`فشل في رفع الملف ${type}: ${uploadError.message}`);
            }

            // Save metadata for client uploads
            const metadataResult = await FileUploadService.saveFileMetadata(
              request.id, 
              type, 
              filePath
            );
            
            if (!metadataResult.success) {
              throw new Error(metadataResult.error || `فشل في حفظ بيانات الملف ${type}`);
            }
          }

          console.log(`File ${type} processed successfully using ${formData.uploadMethod} method`);
        }
      }

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: `رقم الطلب: ${requestNumber}`,
      });

      navigate('/');
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

  return {
    formData,
    setFormData,
    isSubmitting,
    handleFileChange,
    setUploadMethod,
    handleSubmit,
  };
};
