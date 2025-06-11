
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
  image_url?: string;
}

const NewsManagement = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: true,
    image_url: ''
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('خطأ في تحميل الأخبار');
    } finally {
      setLoading(false);
    }
  };

  const saveNews = async () => {
    try {
      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(formData)
          .eq('id', editingNews.id);
        
        if (error) throw error;
        toast.success('تم تحديث الخبر بنجاح');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('تم إضافة الخبر بنجاح');
      }
      
      fetchNews();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('خطأ في حفظ الخبر');
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم حذف الخبر بنجاح');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('خطأ في حذف الخبر');
    }
  };

  const toggleNewsStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم تحديث حالة الخبر');
      fetchNews();
    } catch (error) {
      console.error('Error updating news status:', error);
      toast.error('خطأ في تحديث حالة الخبر');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      is_active: true,
      image_url: ''
    });
    setEditingNews(null);
  };

  const openEditDialog = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      is_active: newsItem.is_active,
      image_url: newsItem.image_url || ''
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center">جاري تحميل الأخبار...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة الأخبار</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة خبر جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? 'تعديل الخبر' : 'إضافة خبر جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان الخبر</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان الخبر"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">محتوى الخبر</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="أدخل محتوى الخبر"
                    rows={5}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image_url">رابط الصورة (اختياري)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="أدخل رابط الصورة"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">نشط</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveNews} className="flex-1">
                    {editingNews ? 'تحديث' : 'حفظ'}
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
                  <TableHead>المحتوى</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.content}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => toggleNewsStatus(item.id, item.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNews(item.id)}
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

          {news.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد أخبار حالياً
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManagement;
