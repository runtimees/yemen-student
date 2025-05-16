
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'خطأ',
        description: 'كلمات المرور غير متطابقة',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'تم إنشاء الحساب بنجاح',
      description: 'يمكنك الآن تسجيل الدخول للاستفادة من خدمات المنصة',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
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
            />
          </div>
          <Button type="submit" className="w-full bg-yemen-red hover:bg-red-700">
            إنشاء حساب
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
