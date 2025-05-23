
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface MovementGuide {
  id: string;
  title: string;
  region: string;
  file_url: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const MovementGuides = () => {
  const [guides, setGuides] = useState<MovementGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('movement_guides')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching movement guides:', error);
      toast.error('فشل في تحميل أدلة الحركة');
    } finally {
      setLoading(false);
    }
  };

  const getRegionTitle = (region: string) => {
    const regionTitles: Record<string, string> = {
      'southern': 'المحافظات الجنوبية',
      'northern': 'المحافظات الشمالية',
      'outside_yemen': 'خارج اليمن'
    };
    return regionTitles[region] || region;
  };

  const getRegionDescription = (region: string) => {
    const descriptions: Record<string, string> = {
      'southern': 'دليل الحركة للمحافظات الجنوبية في الجمهورية اليمنية',
      'northern': 'دليل الحركة للمحافظات الشمالية في الجمهورية اليمنية',
      'outside_yemen': 'دليل الحركة للطلاب اليمنيين خارج اليمن'
    };
    return descriptions[region] || '';
  };

  const handleDownload = (fileUrl: string, title: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('تم بدء التحميل');
    } catch (error) {
      toast.error('فشل في تحميل الملف');
    }
  };

  const groupedGuides = guides.reduce((acc, guide) => {
    if (!acc[guide.region]) {
      acc[guide.region] = [];
    }
    acc[guide.region].push(guide);
    return acc;
  }, {} as Record<string, MovementGuide[]>);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <main className="flex-grow py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-pulse">جاري تحميل أدلة الحركة...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-yemen-black">أدلة الحركة</h1>
            <p className="text-xl text-gray-600">
              تحميل أدلة الحركة للطلاب اليمنيين حسب المنطقة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {['southern', 'northern', 'outside_yemen'].map((region) => {
              const regionGuides = groupedGuides[region] || [];
              const hasGuides = regionGuides.length > 0;
              
              return (
                <Card key={region} className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border-yemen-blue hover:border-yemen-red">
                  <CardHeader className="pb-4 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-yemen-blue text-white rounded-full">
                        <FileText size={32} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-yemen-black">
                      {getRegionTitle(region)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600 mb-4">
                      {getRegionDescription(region)}
                    </p>
                    
                    {hasGuides ? (
                      <div className="space-y-3">
                        {regionGuides.map((guide) => (
                          <div key={guide.id} className="border border-gray-200 rounded-lg p-3">
                            <h4 className="font-semibold mb-2">{guide.title}</h4>
                            {guide.description && (
                              <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                            )}
                            <Button
                              onClick={() => handleDownload(guide.file_url, guide.title)}
                              className="bg-yemen-red hover:bg-red-700 text-white w-full"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              تحميل الدليل
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <p>لا توجد أدلة متاحة حالياً</p>
                        <p className="text-sm mt-2">سيتم إضافة الأدلة قريباً</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovementGuides;
