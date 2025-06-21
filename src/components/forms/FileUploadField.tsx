
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { getFileFieldLabel, getFileAcceptType, validateFileSize } from './ServiceFormConstants';
import FileUpload from '@/components/ui/file-upload';

interface FileUploadFieldProps {
  serviceType: string;
  onFileChange: (field: string, file: File | null) => void;
  onUrlChange: (field: string, url: string) => void;
}

const FileUploadField = ({ serviceType, onFileChange, onUrlChange }: FileUploadFieldProps) => {
  const { toast } = useToast();

  const getFieldName = () => {
    if (serviceType === 'passport_renewal') {
      return 'passportFile';
    } else if (serviceType === 'certificate_authentication' || serviceType === 'certificate_documentation' || serviceType === 'ministry_authentication') {
      return 'certificateFile';
    } else {
      return 'visaFile';
    }
  };

  const handleUploadSuccess = (url: string) => {
    const fieldName = getFieldName();
    console.log('File upload successful:', { fieldName, url });
    onUrlChange(fieldName, url);
  };

  const handleUploadError = (error: string) => {
    console.error('File upload error:', error);
    toast({
      title: "خطأ في رفع الملف",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-2">
      <FileUpload
        bucket="files"
        allowedTypes={['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
        maxSize={10485760} // 10MB
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        label={`${getFileFieldLabel(serviceType)} *`}
        accept={getFileAcceptType(serviceType)}
      />
      <p className="text-sm text-gray-500">
        يجب أن يكون الملف بصيغة PDF أو صورة (الحد الأقصى: 10MB)
      </p>
    </div>
  );
};

export default FileUploadField;
