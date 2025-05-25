import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
  size?: number;
}

export interface FileUploadOptions {
  method: 'client' | 'supabase';
  userId: string;
  requestId: string;
  fileType: string;
}

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  static validateFile(file: File): { valid: boolean; error?: string } {
    console.log('Validating file:', {
      name: file.name,
      size: file.size,
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
      type: file.type
    });

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `الملف كبير جداً. الحد الأقصى المسموح: ${(this.MAX_FILE_SIZE / 1024 / 1024).toFixed(0)} ميجابايت. حجم الملف: ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت`
      };
    }

    if (!file.type.includes('pdf')) {
      return {
        valid: false,
        error: 'يجب أن يكون الملف بصيغة PDF'
      };
    }

    return { valid: true };
  }

  // Client-side upload (current method) - keeps file in browser memory
  static async uploadClientSide(file: File, options: FileUploadOptions): Promise<UploadResult> {
    console.log('Client-side upload initiated for file:', file.name);
    
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // For client-side, we just validate and return the file reference
    // The actual upload to Supabase happens in the form submission
    return {
      success: true,
      filePath: `client://${file.name}`,
      size: file.size
    };
  }

  // Direct Supabase storage upload
  static async uploadToSupabase(file: File, options: FileUploadOptions): Promise<UploadResult> {
    console.log('Supabase direct upload initiated for file:', file.name);
    
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    try {
      // Create file path with user ID in folder structure for RLS policy
      const filePath = `${options.userId}/${options.requestId}/${options.fileType}/${file.name}`;
      
      console.log('Uploading file to Supabase path:', filePath);
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        
        // Handle specific error cases
        if (uploadError.message.includes('413') || 
            uploadError.message.includes('exceeded the maximum allowed size') || 
            uploadError.message.includes('too large')) {
          return {
            success: false,
            error: `الملف كبير جداً. الحد الأقصى المسموح في التخزين أقل من المتوقع. حجم الملف: ${(file.size / 1024 / 1024).toFixed(2)} ميجابايت`
          };
        }
        
        return {
          success: false,
          error: `فشل في رفع الملف: ${uploadError.message}`
        };
      }

      console.log('File uploaded successfully to Supabase:', filePath);
      
      return {
        success: true,
        filePath: filePath,
        size: file.size
      };
    } catch (error) {
      console.error('Unexpected error during Supabase upload:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء رفع الملف'
      };
    }
  }

  // Save file metadata to database
  static async saveFileMetadata(requestId: string, fileType: string, filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('files')
        .insert({
          request_id: requestId,
          file_type: fileType,
          file_path: filePath,
        });

      if (error) {
        console.error('File metadata error:', error);
        return {
          success: false,
          error: `فشل في حفظ بيانات الملف: ${error.message}`
        };
      }

      console.log('File metadata saved successfully for:', fileType);
      return { success: true };
    } catch (error) {
      console.error('Unexpected error saving file metadata:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ بيانات الملف'
      };
    }
  }
}
