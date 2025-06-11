
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Download } from 'lucide-react';

interface Guide {
  id: string;
  title: string;
  description?: string;
  region: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
}

const GuidesManagement = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    region: '',
    file_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('movement_guides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
      toast.error('خطأ في تحميل الأدلة');
    } finally {
      setLoading(false);
    }
  };

  const saveGuide = async () => {
    if (!formData.title || !formData.region || !formData.file_url) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (editingGuide) {
        const { error } = await supabase
          .from('movement_guides')
          .update(formData)
          .eq('id', editingGuide.id);
        
        if (error) throw error;
        toast.success('تم تحديث الدليل بنجاح');
      } else {
        const { error } = await supabase
          .from('movement_guides')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('تم إضافة الدليل بنجاح');
      }
      
      fetchGuides();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving guide:', error);
      toast.error('خطأ في حفظ الدليل');
    }
  };

  const deleteGuide = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدليل؟')) return;
    
    try {
      const { error } = await supabase
        .from('movement_guides')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم حذف الدليل بنجاح');
      fetchGuides();
    } catch (error) {
      console.error('Error deleting guide:', error);
      toast.error('خطأ في حذف الدليل');
    }
  };

  const toggleGuideStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('movement_guides')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم تحديث حالة الدليل');
      fetchGuides();
    } catch (error) {
      console.error('Error updating guide status:', error);
      toast.error('خطأ في تحديث حالة الدليل');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      region: '',
      file_url: '',
      is_active: true
    });
    setEditingGuide(null);
  };

  const openEditDialog = (guide: Guide) => {
    setEditingGuide(guide);
    setFormData({
      title: guide.title,
      description: guide.description || '',
      region: guide.region,
      file_url: guide.file_url,
      is_active: guide.is_active
    });
    setIsDialogOpen(true);
  };

  const getRegionColor = (region: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800'
    ];
    const index = region.length % colors.length;
    return colors[index];
  };

  if (loading) {
    return <div className="text-center">جاري تحميل الأدلة...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة أدلة الحركة</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة دليل جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingGuide ? 'تعديل الدليل' : 'إضافة دليل جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان الدليل *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل عنوان الدليل"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="أدخل وصف الدليل"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="region">المنطقة/البلد *</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="أدخل اسم المنطقة أو البلد"
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
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">نشط</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveGuide} className="flex-1">
                    {editingGuide ? 'تحديث' : 'حفظ'}
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
                  <TableHead>المنطقة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الإنشاء</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guides.map((guide) => (
                  <TableRow key={guide.id}>
                    <TableCell className="font-medium">{guide.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{guide.description || 'لا يوجد وصف'}</TableCell>
                    <TableCell>
                      <Badge className={getRegionColor(guide.region)}>
                        {guide.region}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={guide.is_active}
                        onCheckedChange={() => toggleGuideStatus(guide.id, guide.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(guide.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(guide.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(guide)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGuide(guide.id)}
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

          {guides.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد أدلة حالياً
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidesManagement;
