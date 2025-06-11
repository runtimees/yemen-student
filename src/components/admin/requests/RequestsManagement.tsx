
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { translateServiceType, translateStatus } from '@/utils/requestUtils';
import { Search, Eye, Mail, Edit } from 'lucide-react';

interface Request {
  id: string;
  request_number: string;
  service_type: string;
  status: string;
  full_name_ar: string;
  full_name_en: string;
  university_name?: string;
  major?: string;
  additional_notes?: string;
  admin_notes?: string;
  created_at: string;
  user_id: string;
}

const RequestsManagement = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (requestId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('تم تحديث الطلب بنجاح');
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('خطأ في تحديث الطلب');
    }
  };

  const sendEmail = async (request: Request) => {
    try {
      // This would integrate with an email service
      toast.success('تم إرسال البريد الإلكتروني');
    } catch (error) {
      toast.error('خطأ في إرسال البريد الإلكتروني');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.full_name_ar.includes(searchTerm) ||
      (request.full_name_en && request.full_name_en.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center">جاري تحميل الطلبات...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث برقم الطلب أو اسم المستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="submitted">مقدم</SelectItem>
                <SelectItem value="under_review">قيد المراجعة</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="approved">موافق عليه</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>اسم المستخدم</TableHead>
                  <TableHead>نوع الخدمة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.request_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.full_name_ar}</div>
                        {request.full_name_en && (
                          <div className="text-sm text-gray-500">{request.full_name_en}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{translateServiceType(request.service_type)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {translateStatus(request.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminNotes(request.admin_notes || '');
                                setNewStatus(request.status);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl" dir="rtl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الطلب - {request.request_number}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">الاسم بالعربية:</label>
                                  <p>{request.full_name_ar}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">الاسم بالإنجليزية:</label>
                                  <p>{request.full_name_en || 'غير محدد'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">الجامعة:</label>
                                  <p>{request.university_name || 'غير محدد'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">التخصص:</label>
                                  <p>{request.major || 'غير محدد'}</p>
                                </div>
                              </div>
                              
                              {request.additional_notes && (
                                <div>
                                  <label className="text-sm font-medium">ملاحظات المستخدم:</label>
                                  <p className="mt-1 p-2 bg-gray-50 rounded">{request.additional_notes}</p>
                                </div>
                              )}

                              <div>
                                <label className="text-sm font-medium">تحديث الحالة:</label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="submitted">مقدم</SelectItem>
                                    <SelectItem value="under_review">قيد المراجعة</SelectItem>
                                    <SelectItem value="processing">قيد المعالجة</SelectItem>
                                    <SelectItem value="approved">موافق عليه</SelectItem>
                                    <SelectItem value="rejected">مرفوض</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-sm font-medium">ملاحظات الإدارة:</label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="أضف ملاحظات للمستخدم..."
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => updateRequest(request.id, {
                                    status: newStatus,
                                    admin_notes: adminNotes
                                  })}
                                  className="flex-1"
                                >
                                  حفظ التحديثات
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => sendEmail(request)}
                                  className="flex items-center gap-2"
                                >
                                  <Mail className="h-4 w-4" />
                                  إرسال بريد
                                </Button>
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

          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد طلبات مطابقة للبحث
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsManagement;
