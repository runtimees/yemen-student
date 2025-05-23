
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TrackRequests = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate logged in state for now
  const [requestNumber, setRequestNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState<{
    request_number: string;
    status: string;
    service_type: string;
    admin_notes: string | null;
    submission_date: string;
  } | null>(null);
  const [statusTimeline, setStatusTimeline] = useState<{
    status: string;
    date: string;
    complete: boolean;
  }[]>([]);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const fetchRequestData = async () => {
    if (!requestNumber || !submissionDate) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return false;
    }

    setIsLoading(true);

    try {
      // Query the database for the request using date comparison
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('request_number', requestNumber)
        .gte('created_at', `${submissionDate}T00:00:00`)
        .lt('created_at', `${submissionDate}T23:59:59`)
        .single();

      if (error) {
        console.error('Error fetching request:', error);
        toast.error('لم يتم العثور على طلب بالبيانات المدخلة');
        setIsLoading(false);
        return false;
      }

      if (!data) {
        toast.error('لم يتم العثور على طلب بالبيانات المدخلة');
        setIsLoading(false);
        return false;
      }

      // Store the request data
      setRequestData({
        request_number: data.request_number,
        status: data.status,
        service_type: data.service_type,
        admin_notes: data.admin_notes,
        submission_date: data.submission_date
      });

      // Generate timeline based on status
      const statusOrder = ['submitted', 'under_review', 'processing', 'approved', 'rejected'];
      const currentStatusIndex = statusOrder.indexOf(data.status);
      
      const timeline = statusOrder.map((status, index) => {
        let statusDate = '';
        if (index === 0) {
          statusDate = data.submission_date; // Submission date for first status
        }
        
        return {
          status: translateStatus(status),
          date: index === 0 ? data.submission_date : (index <= currentStatusIndex ? 'تم التحديث' : '-'),
          complete: index <= currentStatusIndex
        };
      });
      
      setStatusTimeline(timeline);
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('حدث خطأ أثناء البحث عن الطلب');
      setIsLoading(false);
      return false;
    }
  };

  const translateStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'submitted': 'تم استلام الطلب',
      'under_review': 'قيد المراجعة',
      'processing': 'قيد المعالجة',
      'approved': 'تمت الموافقة',
      'rejected': 'تم الرفض'
    };
    
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      'submitted': 'bg-blue-500',
      'under_review': 'bg-yellow-500',
      'processing': 'bg-yellow-500',
      'approved': 'bg-green-500',
      'rejected': 'bg-red-500'
    };
    
    return colorMap[status] || 'bg-gray-300';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    
    // Fetch request data and show results if successful
    const success = await fetchRequestData();
    if (success) {
      setResultModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-yemen-black">تتبع طلباتك</h1>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">استعلام عن حالة الطلب</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="requestNumber">رقم الطلب</Label>
                    <Input
                      id="requestNumber"
                      placeholder="أدخل رقم الطلب"
                      value={requestNumber}
                      onChange={(e) => setRequestNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="submissionDate">تاريخ تقديم الطلب</Label>
                    <Input
                      id="submissionDate"
                      type="date"
                      value={submissionDate}
                      onChange={(e) => setSubmissionDate(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-yemen-blue hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري البحث...
                      </>
                    ) : (
                      'استعلام'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                إذا كنت قد فقدت رقم الطلب الخاص بك، يرجى التواصل معنا عبر البريد الإلكتروني أو رقم الهاتف.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Result Modal */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">نتيجة الاستعلام</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {requestData && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-xl mb-2">بيانات الطلب</h3>
                  <p><strong>رقم الطلب:</strong> {requestData.request_number}</p>
                  <p><strong>تاريخ التقديم:</strong> {requestData.submission_date}</p>
                  <p><strong>نوع الخدمة:</strong> {requestData.service_type}</p>
                  <p><strong>حالة الطلب:</strong> <span className="font-bold text-yemen-blue">{translateStatus(requestData.status)}</span></p>
                  
                  {requestData.admin_notes && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p><strong>ملاحظات:</strong> {requestData.admin_notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {statusTimeline.map((item, index) => (
                    <div className="flex items-center" key={index}>
                      <div className={`w-8 h-8 ${item.complete ? getStatusColor(statusTimeline[index].status) : 'bg-gray-300'} rounded-full flex items-center justify-center text-white`}>
                        {item.complete ? '✓' : '?'}
                      </div>
                      <div className="ms-3">
                        <p className="font-bold">{item.status}</p>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="mt-6 text-center">
              <Button onClick={() => setResultModalOpen(false)} className="bg-yemen-blue hover:bg-blue-700">
                إغلاق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modals */}
      <LoginForm
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSwitchToSignup={openSignup}
      />
      <SignupForm
        open={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        onSwitchToLogin={openLogin}
      />
    </div>
  );
};

export default TrackRequests;
