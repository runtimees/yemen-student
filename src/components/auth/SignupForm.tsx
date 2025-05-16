
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import Captcha from './Captcha';

interface SignupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ open, onOpenChange, onSwitchToLogin }: SignupFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const { toast } = useToast();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isCaptchaVerified) {
      toast({
        title: "التحقق مطلوب",
        description: "يرجى إكمال اختبار التحقق البشري أولاً",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(name, email, password);
      
      if (success) {
        onOpenChange(false);
      } else {
        toast({
          title: "فشل إنشاء الحساب",
          description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة إنشاء الحساب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaVerify = (verified: boolean) => {
    setIsCaptchaVerified(verified);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">إنشاء حساب جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              placeholder="أدخل اسمك الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="focus:ring-yemen-blue focus:border-yemen-blue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">البريد الإلكتروني</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-yemen-blue focus:border-yemen-blue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">كلمة المرور</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-yemen-blue focus:border-yemen-blue"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="أعد إدخال كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="focus:ring-yemen-blue focus:border-yemen-blue"
            />
          </div>
          
          <Captcha onVerify={handleCaptchaVerify} />
          
          <Button 
            type="submit" 
            className="w-full bg-yemen-red hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
          </Button>
          <div className="text-center text-sm">
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-yemen-blue hover:underline"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignupForm;
