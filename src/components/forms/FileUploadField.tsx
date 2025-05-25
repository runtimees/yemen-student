
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getFileFieldLabel, getFileAcceptType } from './ServiceFormConstants';
import { FileUploadService } from '@/services/fileUploadService';
import { useState } from 'react';

interface FileUploadFieldProps {
  serviceType: string;
  onFileChange: (field: string, file: File | null) => void;
  uploadMethod: 'client' | 'supabase';
  onUploadMethodChange: (method: 'client' | 'supabase') => void;
}

const FileUploadField = ({ serviceType, onFileChange, uploadMethod, onUploadMethodChange }: FileUploadFieldProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      console.log('Selected file details:', {
        name: file.name,
        size: file.size,
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
        type: file.type
      });

      const validation = FileUploadService.validateFile(file);
      if (!validation.valid) {
        toast({
          title: "خطأ في الملف",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }

    // Update the appropriate field based on service type
    if (serviceType === 'passport_renewal') {
      onFileChange('passportFile', file);
    } else if (serviceType === 'certificate_authentication' || serviceType === 'certificate_documentation' || serviceType === 'ministry_authentication') {
      onFileChange('certificateFile', file);
    } else {
      onFileChange('visaFile', file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Method Selection */}
      <div className="space-y-2">
        <Label>طريقة رفع الملف</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMethod === 'client' ? 'default' : 'outline'}
            onClick={() => onUploadMethodChange('client')}
            className="flex-1"
          >
            رفع عبر المتصفح
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'supabase' ? 'default' : 'outline'}
            onClick={() => onUploadMethodChange('supabase')}
            className="flex-1"
          >
            رفع مباشر للتخزين
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          {uploadMethod === 'client' 
            ? 'سيتم رفع الملف عند إرسال الطلب (الطريقة الحالية)'
            : 'سيتم رفع الملف مباشرة إلى التخزين'
          }
        </p>
      </div>

      {/* File Upload Field */}
      <div className="space-y-2">
        <Label htmlFor="file-upload">{getFileFieldLabel(serviceType)} *</Label>
        <Input
          id="file-upload"
          type="file"
          accept={getFileAcceptType(serviceType)}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
          required
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          يجب أن يكون الملف بصيغة PDF (الحد الأقصى: 5MB)
        </p>
        
        {selectedFile && (
          <div className="text-sm text-green-600">
            ✓ تم اختيار الملف: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadField;
