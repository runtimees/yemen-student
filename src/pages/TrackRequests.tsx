
import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import RequestTrackingForm from '@/components/tracking/RequestTrackingForm';
import RequestResultModal from '@/components/tracking/RequestResultModal';
import { useRequestTracking } from '@/hooks/useRequestTracking';

const TrackRequests = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate logged in state for now
  const [resultModalOpen, setResultModalOpen] = useState(false);
  
  const { isLoading, requestData, statusTimeline, fetchRequestData } = useRequestTracking();

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleFormSubmit = async (requestNumber: string) => {
    const success = await fetchRequestData(requestNumber);
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
            
            <RequestTrackingForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              isLoggedIn={isLoggedIn}
              onLoginRequired={openLogin}
            />

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                إذا كنت قد فقدت رقم الطلب الخاص بك، يرجى التواصل معنا عبر البريد الإلكتروني أو رقم الهاتف.
              </p>
            </div>
          </div>
        </div>
      </main>

      <RequestResultModal
        open={resultModalOpen}
        onOpenChange={setResultModalOpen}
        requestData={requestData}
        statusTimeline={statusTimeline}
      />

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
