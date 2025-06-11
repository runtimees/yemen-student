
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestsManagement from '@/components/admin/requests/RequestsManagement';
import UsersManagement from '@/components/admin/users/UsersManagement';
import NewsManagement from '@/components/admin/news/NewsManagement';
import LibraryManagement from '@/components/admin/library/LibraryManagement';
import GuidesManagement from '@/components/admin/guides/GuidesManagement';
import StatsOverview from '@/components/admin/stats/StatsOverview';
import { FileText, Users, Newspaper, Book, MapPin, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const { userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">جاري التحميل...</div>;
  }

  if (!userProfile) {
    return <Navigate to="/" replace />;
  }

  // Temporarily allow access for any authenticated user
  // You can promote yourself to admin through the Users Management tab
  console.log('Current user role:', userProfile.role);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم الإدارية</h1>
          <p className="text-gray-600">إدارة منصة الطلبة اليمنيين</p>
          {userProfile.role !== 'admin' && (
            <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 rounded-md">
              <p className="text-yellow-800 text-sm">
                تم السماح لك بالوصول مؤقتاً. يرجى ترقية حسابك إلى مدير من خلال تبويب "المستخدمين".
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              الإحصائيات
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              الطلبات
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              المستخدمين
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              الأخبار
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              المكتبة
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              الأدلة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <StatsOverview />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsManagement />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="library">
            <LibraryManagement />
          </TabsContent>

          <TabsContent value="guides">
            <GuidesManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
