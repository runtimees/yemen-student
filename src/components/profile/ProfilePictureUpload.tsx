
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const ProfilePictureUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار ملف صورة صالح",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطأ",
        description: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file: File) => {
    if (!userProfile) return;

    setUploading(true);

    try {
      // Get the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('المستخدم غير مُصادق عليه');
      }

      console.log('Current user ID:', user.id);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      // Update user profile in database using the authenticated user's ID
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture_url: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "تم بنجاح",
        description: "تم رفع صورة الملف الشخصي بنجاح",
      });

      // Refresh the page to show updated avatar
      window.location.reload();

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفع الصورة",
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir="rtl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Camera size={20} />
          صورة الملف الشخصي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-yemen-blue">
              <AvatarImage 
                src={previewUrl || userProfile?.profile_picture_url} 
                alt={userProfile?.full_name_ar}
                className="object-cover"
              />
              <AvatarFallback className="bg-yemen-blue text-white text-xl">
                {userProfile?.full_name_ar?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {previewUrl && (
              <Button
                size="sm"
                variant="outline"
                className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={clearPreview}
              >
                <X size={14} />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full bg-yemen-blue hover:bg-blue-700"
          >
            <Upload size={18} className="ml-2" />
            {uploading ? 'جاري الرفع...' : 'اختيار صورة'}
          </Button>
        </div>

        <p className="text-sm text-gray-600 text-center">
          الحد الأقصى: 5 ميجابايت
          <br />
          الصيغ المدعومة: JPG, PNG, GIF
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
