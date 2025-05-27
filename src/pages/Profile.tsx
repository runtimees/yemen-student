
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import { User } from 'lucide-react';

const Profile = () => {
  const { userProfile, isAuthenticated } = useAuth();

  if (!isAuthenticated || !userProfile) {
    return (
      <div className="container mx-auto py-8 px-4" dir="rtl">
        <div className="text-center">
          <p className="text-lg">يرجى تسجيل الدخول للوصول إلى الملف الشخصي</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yemen-black flex items-center justify-center gap-2">
            <User size={32} />
            الملف الشخصي
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ProfilePictureUpload />
          
          <Card>
            <CardHeader>
              <CardTitle>معلومات الحساب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">الاسم بالعربية</label>
                <p className="text-lg">{userProfile.full_name_ar}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">الاسم بالإنجليزية</label>
                <p className="text-lg">{userProfile.full_name_en || 'غير محدد'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                <p className="text-lg">{userProfile.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
                <p className="text-lg">{userProfile.phone_number || 'غير محدد'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">نوع الحساب</label>
                <p className="text-lg">{userProfile.role === 'student' ? 'طالب' : 'مدير'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
