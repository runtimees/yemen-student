
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, ExternalLink } from 'lucide-react';

interface LibraryDocument {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  category: string;
  country: string;
  upload_date: string;
}

const StudentLibrary = () => {
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('student_library_documents')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      if (data) {
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentsByCategory = (category: string, country: string) => {
    return documents.filter(doc => doc.category === category && doc.country === country);
  };

  const categories = [
    { key: 'Medical-Iraq', title: 'ملخصات وأسئلة كلية الطب - الطلاب العراقيون', category: 'Medical', country: 'Iraq' },
    { key: 'Medical-Yemen', title: 'ملخصات وأسئلة كلية الطب - الطلاب اليمنيون', category: 'Medical', country: 'Yemen' },
    { key: 'Engineering-Iraq', title: 'ملخصات وأسئلة كلية الهندسة - الطلاب العراقيون', category: 'Engineering', country: 'Iraq' },
    { key: 'Engineering-Yemen', title: 'ملخصات وأسئلة كلية الهندسة - الطلاب اليمنيون', category: 'Engineering', country: 'Yemen' },
    { key: 'IT-Iraq', title: 'علوم الحاسوب والأمن السيبراني وتقنية المعلومات - الطلاب العراقيون', category: 'IT', country: 'Iraq' },
    { key: 'IT-Yemen', title: 'علوم الحاسوب والأمن السيبراني وتقنية المعلومات - الطلاب اليمنيون', category: 'IT', country: 'Yemen' },
  ];

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yemen-blue mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">جار تحميل المكتبة...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-yemen-black">مكتبة الطلاب</h1>
            <p className="text-xl text-gray-600">
              تصفح الملخصات والأسئلة وملفات الدراسة PDF المعدة من قبل طلاب الجامعات اليمنية والعراقية
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {categories.map((cat) => {
                const categoryDocs = getDocumentsByCategory(cat.category, cat.country);
                return (
                  <AccordionItem key={cat.key} value={cat.key} className="bg-white rounded-lg shadow-sm border">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-yemen-black hover:no-underline">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-yemen-blue" />
                        {cat.title}
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {categoryDocs.length} ملف
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      {categoryDocs.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>لا توجد ملفات متاحة في هذا القسم حالياً</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {categoryDocs.map((doc) => (
                            <Card key={doc.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-yemen-black">{doc.title}</CardTitle>
                                {doc.description && (
                                  <CardDescription className="text-gray-600">
                                    {doc.description}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-gray-500">
                                    تاريخ الرفع: {new Date(doc.upload_date).toLocaleDateString('ar-SA')}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(doc.file_url, '_blank')}
                                      className="text-yemen-blue border-yemen-blue hover:bg-yemen-blue hover:text-white"
                                    >
                                      <ExternalLink className="h-4 w-4 ml-2" />
                                      عرض
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => handleDownload(doc.file_url, doc.title)}
                                      className="bg-yemen-blue hover:bg-blue-700"
                                    >
                                      <Download className="h-4 w-4 ml-2" />
                                      تحميل
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLibrary;
