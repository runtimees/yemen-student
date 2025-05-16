
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Short timeout to allow the auth state to be checked
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        toast({
          title: "تسجيل الدخول مطلوب",
          description: "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
          variant: "destructive",
        });
        navigate('/');
      }
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, navigate]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-2xl text-yemen-blue">جاري التحميل...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This will not render as the user will be redirected
  }

  return <>{children}</>;
};

export default AuthGuard;
