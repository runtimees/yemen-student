
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Search, Eye, Edit, UserMinus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  full_name_ar: string;
  full_name_en: string;
  email: string;
  phone_number?: string;
  role: string;
  residence_status?: string;
  created_at: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      console.log('Current user profile:', userProfile);
      
      // First, let's try to get the current session to make sure we're authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session:', sessionData);
      if (sessionError) {
        console.error('Session error:', sessionError);
      }

      // Try to fetch users with error logging
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Supabase query result:', { data, error, count });
      
      if (error) {
        console.error('Error fetching users:', error);
        toast.error(`خطأ في تحميل المستخدمين: ${error.message}`);
        
        // If it's an RLS error, let's check if we can bypass it
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          console.log('RLS policy issue detected. Trying with service role...');
          toast.error('مشكلة في صلاحيات الوصول للبيانات. يرجى التحقق من إعدادات قاعدة البيانات.');
        }
      } else {
        console.log(`Successfully fetched ${data?.length || 0} users`);
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      toast.error('خطأ غير متوقع في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      console.log(`Updating user ${userId} role to ${newRole}`);
      
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        toast.error(`خطأ في تحديث دور المستخدم: ${error.message}`);
        return;
      }
      
      toast.success('تم تحديث دور المستخدم بنجاح');
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Unexpected error updating user role:', error);
      toast.error('خطأ غير متوقع في تحديث دور المستخدم');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name_ar.includes(searchTerm) ||
      user.full_name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'student': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'student': return 'طالب';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div>جاري تحميل المستخدمين...</div>
        <div className="text-sm text-gray-500 mt-2">
          إذا استمر التحميل لفترة طويلة، يرجى التحقق من إعدادات قاعدة البيانات
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>إدارة المستخدمين</span>
            <span className="text-sm font-normal text-gray-500">
              إجمالي المستخدمين: {users.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="تصفية حسب الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="student">طالب</SelectItem>
                <SelectItem value="admin">مدير</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={fetchUsers} 
              variant="outline"
              className="whitespace-nowrap"
            >
              تحديث البيانات
            </Button>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                لا توجد مستخدمين في قاعدة البيانات
              </div>
              <div className="text-sm text-gray-400">
                هذا قد يعني أن هناك مشكلة في الصلاحيات أو أن قاعدة البيانات فارغة
              </div>
              <Button onClick={fetchUsers} className="mt-4">
                إعادة المحاولة
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>تاريخ التسجيل</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.full_name_ar}</div>
                            {user.full_name_en && (
                              <div className="text-sm text-gray-500">{user.full_name_en}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone_number || 'غير محدد'}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('ar-SA')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg" dir="rtl">
                                <DialogHeader>
                                  <DialogTitle>تفاصيل المستخدم</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">الاسم بالعربية:</label>
                                    <p>{user.full_name_ar}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">الاسم بالإنجليزية:</label>
                                    <p>{user.full_name_en || 'غير محدد'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">البريد الإلكتروني:</label>
                                    <p>{user.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">رقم الهاتف:</label>
                                    <p>{user.phone_number || 'غير محدد'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">حالة الإقامة:</label>
                                    <p>{user.residence_status || 'غير محدد'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">تغيير الدور:</label>
                                    <Select 
                                      defaultValue={user.role}
                                      onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="student">طالب</SelectItem>
                                        <SelectItem value="admin">مدير</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد مستخدمين مطابقين للبحث
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
