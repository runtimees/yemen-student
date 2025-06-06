
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getFileFieldLabel, getFileAcceptType, validateFileSize } from './ServiceFormConstants';

interface FileUploadFieldProps {
  serviceType: string;
  onFileChange: (field: string, file: File | null) => void;
}

const FileUploadField = ({ serviceType, onFileChange }: FileUploadFieldProps) => {
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (file) {
      console.log('Selected file details:', {
        name: file.name,
        size: file.size,
        sizeMB: (file.size / 1024 / 1024).toFixed(2),
        type: file.type
      });

      if (!validateFileSize(file)) {
        toast({
          title: "خطأ في حجم الملف",
          description: `حجم الملف ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت. الحد الأقصى المسموح: 5 ميجابايت`,
          variant: "destructive",
        });
        return;
      }
    }

    if (serviceType === 'passport_renewal') {
      onFileChange('passportFile', file);
    } else if (serviceType === 'certificate_authentication' || serviceType === 'certificate_documentation' || serviceType === 'ministry_authentication') {
      onFileChange('certificateFile', file);
    } else {
      onFileChange('visaFile', file);
    }
  };

  return (
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
    </div>
  );
};

export default FileUploadField;
