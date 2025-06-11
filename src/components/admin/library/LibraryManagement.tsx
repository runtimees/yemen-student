
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Download } from 'lucide-react';

interface LibraryDocument {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  category: string;
  country: string;
  uploaded_by_admin_id?: string;
  upload_date: string;
  created_at: string;
}

const LibraryManagement = () => {
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<LibraryDocument | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    category: '',
    country: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('student_library_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('خطأ في تحميل المستندات');
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async () => {
    if (!formData.title || !formData.file_url || !formData.category || !formData.country) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (editingDocument) {
        const { error } = await supabase
          .from('student_library_documents')
          .update(formData)
          .eq('id', editingDocument.id);
        
        if (error) throw error;
        toast.success('تم تحديث المستند بنجاح');
      } else {
        const { error } = await supabase
          .from('student_library_documents')
          .insert([{
            ...formData,
            upload_date: new Date().toISOString()
          }]);
        
        if (error) throw error;
        toast.success('تم إضافة المستند بنجاح');
      }
      
      fetchDocuments();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('خطأ في حفظ المستند');
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستند؟')) return;
    
    try {
      const { error } = await supabase
        .from('student_library_documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم حذف المستند بنجاح');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('خطأ في حذف المستند');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file_url: '',
      category: '',
      country: ''
    });
    setEditingDocument(null);
  };

  const openEditDialog = (document: LibraryDocument) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      description: document.description || '',
      file_url: document.file_url,
      category: document.category,
      country: document.country
    });
    setIsDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medical': return 'bg-red-100 text-red-800';
      case 'Engineering': return 'bg-blue-100 text-blue-800';
      case 'IT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryColor = (country: string) => {
    switch (country) {
      case 'Iraq': return 'bg-orange-100 text-orange-800';
      case 'Yemen': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center">جاري تحميل المستندات...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة مكتبة الطلبة</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة مستند جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingDocument ? 'تعديل المستند' : 'إضافة مستند جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان المستند *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان المستند"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="أدخل وصف المستند"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="file_url">رابط الملف *</Label>
                  <Input
                    id="file_url"
                    value={formData.file_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                    placeholder="أدخل رابط الملف"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">التصنيف *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medical">طبي</SelectItem>
                        <SelectItem value="Engineering">هندسة</SelectItem>
                        <SelectItem value="IT">تقنية المعلومات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">البلد *</Label>
                    <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البلد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Iraq">العراق</SelectItem>
                        <SelectItem value="Yemen">اليمن</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveDocument} className="flex-1">
                    {editingDocument ? 'تحديث' : 'حفظ'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>البلد</TableHead>
                  <TableHead>تاريخ الرفع</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{document.description || 'لا يوجد وصف'}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category === 'Medical' ? 'طبي' : 
                         document.category === 'Engineering' ? 'هندسة' : 
                         document.category === 'IT' ? 'تقنية المعلومات' : document.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCountryColor(document.country)}>
                        {document.country === 'Iraq' ? 'العراق' : 'اليمن'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(document.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(document.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(document)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDocument(document.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {documents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد مستندات في المكتبة حالياً
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryManagement;
