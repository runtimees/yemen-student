
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { PhoneInput } from '@/components/ui/phone-input';
import Captcha from './Captcha';

interface SignupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ open, onOpenChange, onSwitchToLogin }: SignupFormProps) => {
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [phone, setPhone] = useState('');
  const [residenceStatus, setResidenceStatus] = useState('');
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

    if (!nameAr || !nameEn || !phone || !residenceStatus) {
      toast({
        title: "خطأ",
        description: "يرجى تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(nameAr, email, password, nameEn, phone, residenceStatus);
      
      if (success) {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "مرحباً بك في اتحاد الطلاب اليمنيين في العراق نجد",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "فشل إنشاء الحساب",
          description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl">إنشاء حساب جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name-ar">الاسم الكامل بالعربية *</Label>
            <Input
              id="name-ar"
              placeholder="أدخل اسمك الكامل بالعربية"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              required
              className="focus:ring-yemen-blue focus:border-yemen-blue"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name-en">الاسم الكامل بالإنجليزية *</Label>
            <Input
              id="name-en"
              placeholder="Enter your full name in English"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              required
              className="focus:ring-yemen-blue focus:border-yemen-blue"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <PhoneInput
              value={phone}
              onChange={setPhone}
              placeholder="رقم الهاتف"
            />
          </div>

          <div className="space-y-3">
            <Label>الحالة السكنية *</Label>
            <RadioGroup value={residenceStatus} onValueChange={setResidenceStatus} className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="resident_in_iraq" id="resident" />
                <Label htmlFor="resident" className="cursor-pointer">مقيم في العراق</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="applying_to_study" id="applying" />
                <Label htmlFor="applying" className="cursor-pointer">متقدم للدراسة في العراق</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">البريد الإلكتروني *</Label>
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
            <Label htmlFor="signup-password">كلمة المرور *</Label>
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
            <Label htmlFor="confirm-password">تأكيد كلمة المرور *</Label>
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
