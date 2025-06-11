
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-yemen-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ط</span>
            </div>
            <span className="font-bold text-xl text-gray-900">منصة الطلبة اليمنيين</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-yemen-blue transition-colors">
              الرئيسية
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-yemen-blue transition-colors">
              الخدمات
            </Link>
            {userProfile && (
              <Link to="/track" className="text-gray-700 hover:text-yemen-blue transition-colors">
                تتبع الطلبات
              </Link>
            )}
            <Link to="/vision" className="text-gray-700 hover:text-yemen-blue transition-colors">
              الرؤية والرسالة
            </Link>
            <Link to="/study-iraq" className="text-gray-700 hover:text-yemen-blue transition-colors">
              الدراسة في العراق
            </Link>
            <Link to="/movement-guides" className="text-gray-700 hover:text-yemen-blue transition-colors">
              أدلة الحركة
            </Link>
            <Link to="/student-library" className="text-gray-700 hover:text-yemen-blue transition-colors">
              مكتبة الطلبة
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {userProfile ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                {userProfile.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      لوحة التحكم
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {userProfile.full_name_ar}
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button onClick={() => setIsLoginOpen(true)} variant="outline">
                  تسجيل الدخول
                </Button>
                <Button onClick={() => setIsSignupOpen(true)} className="bg-yemen-red hover:bg-red-700">
                  إنشاء حساب
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginForm
        open={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSwitchToSignup={switchToSignup}
      />

      <SignupForm
        open={isSignupOpen}
        onOpenChange={setIsSignupOpen}
        onSwitchToLogin={switchToLogin}
      />
    </header>
  );
};

export default Header;
