
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Upload, X, FileText, Image } from 'lucide-react';

interface FileUploadProps {
  bucket: string;
  allowedTypes: string[];
  maxSize: number; // in bytes
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentFile?: string;
  label: string;
  accept?: string;
}

const FileUpload = ({
  bucket,
  allowedTypes,
  maxSize,
  onUploadSuccess,
  onUploadError,
  currentFile,
  label,
  accept
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `نوع الملف غير مدعوم. الأنواع المسموحة: ${allowedTypes.join(', ')}`;
    }
    
    if (file.size > maxSize) {
      return `حجم الملف كبير جداً. الحد الأقصى: ${formatFileSize(maxSize)}`;
    }
    
    return null;
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        onUploadError?.(validationError);
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      setPreviewUrl(publicUrl);
      onUploadSuccess(publicUrl);
      
      toast.success('تم رفع الملف بنجاح');
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = 'خطأ في رفع الملف';
      toast.error(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const removeFile = () => {
    setPreviewUrl(null);
    onUploadSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {previewUrl ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
          {isImage(previewUrl) ? (
            <div className="flex items-center space-x-4 space-x-reverse">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">تم رفع الصورة بنجاح</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="mt-2"
                >
                  <X className="w-4 h-4 ml-1" />
                  إزالة
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4 space-x-reverse">
              <FileText className="w-12 h-12 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">تم رفع الملف بنجاح</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="mt-2"
                >
                  <X className="w-4 h-4 ml-1" />
                  إزالة
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            {bucket === 'news-images' ? (
              <Image className="mx-auto h-12 w-12 text-gray-400" />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="mt-4">
              <Input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept={accept}
                disabled={uploading}
                className="hidden"
                id={`file-upload-${bucket}`}
              />
              <Label
                htmlFor={`file-upload-${bucket}`}
                className="cursor-pointer"
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    {uploading ? 'جاري الرفع...' : 'اختر ملف'}
                  </span>
                </Button>
              </Label>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              الحد الأقصى: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
