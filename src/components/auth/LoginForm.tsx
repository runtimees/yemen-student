
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

const LoginForm = ({ open, onOpenChange, onSwitchToSignup }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'تم تسجيل الدخول بنجاح',
      description: 'مرحبا بك في منصة الطلبة اليمنيين',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">تسجيل الدخول</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-yemen-red hover:bg-red-700">
            دخول
          </Button>
          <div className="text-center text-sm">
            ليس لديك حساب؟{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-yemen-blue hover:underline"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
