
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { FileText, CheckCircle, Clock, Users } from 'lucide-react';

interface Stats {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  totalUsers: number;
}

const StatsOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total requests
      const { count: totalRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true });

      // Get completed requests
      const { count: completedRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get pending requests
      const { count: pendingRequests } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'under_review', 'processing']);

      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalRequests: totalRequests || 0,
        completedRequests: completedRequests || 0,
        pendingRequests: pendingRequests || 0,
        totalUsers: totalUsers || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate = stats.totalRequests > 0 
    ? Math.round((stats.completedRequests / stats.totalRequests) * 100) 
    : 0;

  const pendingRate = stats.totalRequests > 0 
    ? Math.round((stats.pendingRequests / stats.totalRequests) * 100) 
    : 0;

  if (loading) {
    return <div className="text-center">جاري تحميل الإحصائيات...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات المكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% من إجمالي الطلبات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات قيد المعالجة</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {pendingRate}% من إجمالي الطلبات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ملخص الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>معدل إكمال الطلبات</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>الطلبات قيد المعالجة</span>
                <span>{pendingRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${pendingRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
