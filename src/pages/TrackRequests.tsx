
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TrackRequests = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate logged in state for now
  const [requestNumber, setRequestNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    
    // Show results
    setResultModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
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
                  <Button type="submit" className="w-full bg-yemen-blue hover:bg-blue-700">
                    استعلام
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

      <Footer />

      {/* Result Modal */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">نتيجة الاستعلام</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-xl mb-2">بيانات الطلب</h3>
              <p><strong>رقم الطلب:</strong> {requestNumber}</p>
              <p><strong>تاريخ التقديم:</strong> {submissionDate}</p>
              <p><strong>نوع الخدمة:</strong> تصديق شهادة</p>
              <p><strong>حالة الطلب:</strong> <span className="text-green-600 font-bold">قيد المعالجة</span></p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div className="ms-3">
                  <p className="font-bold">تم استلام الطلب</p>
                  <p className="text-sm text-gray-600">15-05-2023</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
                <div className="ms-3">
                  <p className="font-bold">قيد المراجعة</p>
                  <p className="text-sm text-gray-600">17-05-2023</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white">⋯</div>
                <div className="ms-3">
                  <p className="font-bold">قيد المعالجة</p>
                  <p className="text-sm text-gray-600">جاري العمل</p>
                </div>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">?</div>
                <div className="ms-3">
                  <p className="font-bold">اكتمال الطلب</p>
                  <p className="text-sm text-gray-600">-</p>
                </div>
              </div>
            </div>
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
