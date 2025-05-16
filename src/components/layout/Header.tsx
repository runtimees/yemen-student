
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Briefcase, 
  BarChart2, 
  StarIcon,
  ExternalLink,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const openLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Open login modal if not authenticated and trying to access protected routes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('requiresAuth') === 'true' && !isAuthenticated) {
      openLogin();
    }
  }, [isAuthenticated]);

  return (
    <header className="bg-gradient-to-r from-yemen-black to-gray-900 text-white shadow-lg">
      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4">
              <div className="rounded-full overflow-hidden border-4 border-yemen-red shadow-lg transform hover:scale-105 transition-transform">
                <img 
                  src="/lovable-uploads/3f42ec74-bc6b-49c4-8f8c-3a5e6895dc36.png" 
                  alt="Yemen Student Platform Logo" 
                  className="h-16 w-16 object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl font-bold">منصة الطلبة اليمنيين في العراق</h1>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex space-x-3 mb-3 md:mb-0 md:mr-6">
              <Link to="/" className="p-2 hover:bg-yemen-blue rounded-full transition-colors tooltip-wrapper">
                <Home size={20} />
                <span className="tooltip">الرئيسية</span>
              </Link>
              <Link to="/services" className="p-2 hover:bg-yemen-blue rounded-full transition-colors tooltip-wrapper">
                <Briefcase size={20} />
                <span className="tooltip">خدماتنا</span>
              </Link>
              <Link to="/track" className="p-2 hover:bg-yemen-blue rounded-full transition-colors tooltip-wrapper">
                <BarChart2 size={20} />
                <span className="tooltip">تتبع طلباتك</span>
              </Link>
              <Link to="/vision" className="p-2 hover:bg-yemen-blue rounded-full transition-colors tooltip-wrapper">
                <StarIcon size={20} />
                <span className="tooltip">رؤيتنا</span>
              </Link>
              <Link to="/study-iraq" className="p-2 hover:bg-yemen-blue rounded-full transition-colors tooltip-wrapper">
                <ExternalLink size={20} />
                <span className="tooltip">منصة الدراسة</span>
              </Link>
            </div>
            
            <div className="flex space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-yemen-blue">
                      <AvatarFallback className="bg-yemen-blue text-white">
                        {user?.full_name_ar?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">{user?.full_name_ar}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-white border-yemen-red hover:bg-yemen-red flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span className="hidden md:inline">تسجيل الخروج</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="text-white border-yemen-red hover:bg-yemen-red flex items-center gap-2"
                    onClick={openLogin}
                  >
                    <LogIn size={18} />
                    <span className="hidden md:inline">تسجيل الدخول</span>
                  </Button>
                  <Button 
                    className="bg-yemen-red hover:bg-red-700 text-white flex items-center gap-2"
                    onClick={openSignup}
                  >
                    <UserPlus size={18} />
                    <span className="hidden md:inline">إنشاء حساب</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
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

      <style>{`
        .tooltip-wrapper {
          position: relative;
        }
        .tooltip {
          position: absolute;
          top: 100%;
          right: 50%;
          transform: translateX(50%);
          padding: 4px 8px;
          background-color: rgba(0, 0, 0, 0.8);
          color: white;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
          z-index: 10;
        }
        .tooltip-wrapper:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </header>
  );
};

export default Header;
