
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface LoginPromptProps {
  onClose: () => void;
}

const LoginPrompt = ({ onClose }: LoginPromptProps) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);

  if (showLoginForm) {
    return (
      <LoginForm 
        open={true} 
        onOpenChange={(open) => {
          if (!open) {
            setShowLoginForm(false);
          }
        }}
        onSwitchToSignup={() => {
          setShowLoginForm(false);
          setShowSignupForm(true);
        }}
      />
    );
  }

  if (showSignupForm) {
    return (
      <SignupForm 
        open={true} 
        onOpenChange={(open) => {
          if (!open) {
            setShowSignupForm(false);
          }
        }}
        onSwitchToLogin={() => {
          setShowSignupForm(false);
          setShowLoginForm(true);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full overflow-hidden border-4 border-yemen-red shadow-lg w-20 h-20">
              <img 
                src="/lovable-uploads/3f42ec74-bc6b-49c4-8f8c-3a5e6895dc36.png" 
                alt="Yemen Student Platform Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <CardTitle className="text-2xl text-yemen-black">
            مرحباً بك في منصة الطلبة اليمنيين
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 mb-6">
            للوصول إلى جميع خدمات المنصة، يرجى تسجيل الدخول أو إنشاء حساب جديد
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-yemen-blue hover:bg-blue-700 text-white"
              onClick={() => setShowLoginForm(true)}
            >
              تسجيل الدخول 🔑
            </Button>
            
            <Button 
              className="w-full bg-yemen-red hover:bg-red-700 text-white"
              onClick={() => setShowSignupForm(true)}
            >
              إنشاء حساب جديد ✨
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              تصفح كضيف 👀
            </Button>
          </div>
          
          <div className="text-center text-2xl space-x-2 mt-4">
            <span>🎓</span>
            <span>📚</span>
            <span>🇾🇪</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPrompt;
