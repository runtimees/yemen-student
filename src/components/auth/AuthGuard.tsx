
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Short timeout to allow the auth state to be checked
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        // Save the current location the user was trying to access
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        // Redirect to homepage with query param
        navigate(`/?requiresAuth=true&returnTo=${returnUrl}`);
      }
      setIsChecking(false);
    }, 200); // Increased timeout for better auth state detection

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, navigate, location]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-yemen-blue" />
          <div className="text-2xl text-yemen-blue">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This will not render as the user will be redirected
  }

  return <>{children}</>;
};

export default AuthGuard;
