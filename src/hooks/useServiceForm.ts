
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
  const { userProfile } = useAuth();

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

  const handleFileChange = (field: string, file: File | null) => {
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

    console.log('User profile:', userProfile);
    console.log('User ID:', userProfile.id);

    setIsSubmitting(true);

    try {
      // Generate request number
      const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Create request - use userProfile.id directly as it's already a UUID string
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: userProfile.id, // Use directly, no need to convert to string
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

      console.log('Request created successfully:', request);

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

  return {
    formData,
    setFormData,
    isSubmitting,
    handleFileChange,
    handleSubmit,
  };
};
