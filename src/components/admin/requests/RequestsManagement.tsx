
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
import { Search, Eye, Mail, Edit, FileText, Download, ExternalLink } from 'lucide-react';

interface RequestFile {
  id: string;
  file_type: string;
  file_path: string;
  uploaded_at: string;
}

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
  files?: RequestFile[];
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
      console.log('Fetching requests...');
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
        throw requestsError;
      }
      
      console.log('Fetched requests:', requestsData);

      // Fetch files for each request
      const requestsWithFiles = await Promise.all(
        (requestsData || []).map(async (request) => {
          const { data: filesData, error: filesError } = await supabase
            .from('files')
            .select('*')
            .eq('request_id', request.id);

          if (filesError) {
            console.error(`Error fetching files for request ${request.id}:`, filesError);
            return { ...request, files: [] };
          }

          return { ...request, files: filesData || [] };
        })
      );

      setRequests(requestsWithFiles);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = async (requestId: string, updates: any) => {
    try {
      console.log('Updating request:', requestId, updates);
      
      const { error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', requestId);

      if (error) {
        console.error('Error updating request:', error);
        throw error;
      }
      
      toast.success('تم تحديث الطلب بنجاح');
      
      // Refresh the requests list to show updated data
      await fetchRequests();
      setSelectedRequest(null);
      
      console.log('Request updated successfully');
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

  const handleFileView = (filePath: string) => {
    window.open(filePath, '_blank');
  };

  const handleFileDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(filePath);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('تم تحميل الملف بنجاح');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('خطأ في تحميل الملف');
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    switch (fileType) {
      case 'passport': return 'جواز السفر';
      case 'certificate': return 'الشهادة';
      case 'visa_request': return 'طلب الفيزا';
      case 'other': return 'أخرى';
      default: return fileType;
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
          <CardTitle>إدارة الطلبات ({requests.length} طلب)</CardTitle>
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

          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد طلبات في النظام حتى الآن
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>نوع الخدمة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الملفات المرفقة</TableHead>
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
                          <div className="font-medium">{request.full_name_ar || 'غير محدد'}</div>
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
                        <div className="flex flex-col gap-1">
                          {request.files && request.files.length > 0 ? (
                            request.files.map((file) => (
                              <div key={file.id} className="flex items-center gap-2 text-sm">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <span className="text-gray-600">{getFileTypeLabel(file.file_type)}</span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFileView(file.file_path)}
                                    className="h-6 px-2"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleFileDownload(file.file_path, `${getFileTypeLabel(file.file_type)}.pdf`)}
                                    className="h-6 px-2"
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">لا توجد ملفات</span>
                          )}
                        </div>
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
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                              <DialogHeader>
                                <DialogTitle>تفاصيل الطلب - {request.request_number}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">الاسم بالعربية:</label>
                                    <p>{request.full_name_ar || 'غير محدد'}</p>
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

                                {/* Files Section */}
                                {request.files && request.files.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium mb-3 block">الملفات المرفقة:</label>
                                    <div className="grid grid-cols-1 gap-3">
                                      {request.files.map((file) => (
                                        <div key={file.id} className="border rounded-lg p-4 bg-gray-50">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <FileText className="h-8 w-8 text-blue-600" />
                                              <div>
                                                <p className="font-medium">{getFileTypeLabel(file.file_type)}</p>
                                                <p className="text-sm text-gray-500">
                                                  تم الرفع: {new Date(file.uploaded_at).toLocaleDateString('ar-SA')}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleFileView(file.file_path)}
                                                className="flex items-center gap-2"
                                              >
                                                <ExternalLink className="h-4 w-4" />
                                                عرض
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleFileDownload(file.file_path, `${request.request_number}-${getFileTypeLabel(file.file_type)}.pdf`)}
                                                className="flex items-center gap-2"
                                              >
                                                <Download className="h-4 w-4" />
                                                تحميل
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
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
          )}

          {filteredRequests.length === 0 && requests.length > 0 && (
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
