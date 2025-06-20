
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { User, LogOut, Settings, Home, Star, BarChart3, Briefcase } from 'lucide-react';

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
    <TooltipProvider>
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Right side - Logo and title */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white">
                <img 
                  src="/lovable-uploads/57d4da83-eb7a-4fdc-9ebe-17764bf6e3d2.png" 
                  alt="شعار منصة نجد" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-bold">منصة الطلبة اليمنيين في العراق "نجد"</h1>
            </div>

            {/* Center - Navigation Icons with Tooltips */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/" className="hover:text-gray-300">
                    <Home className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>الصفحة الرئيسية</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/services" className="hover:text-gray-300">
                    <Briefcase className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>الخدمات</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/track" className="hover:text-gray-300">
                    <BarChart3 className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تتبع الطلبات</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/vision" className="hover:text-gray-300">
                    <Star className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>الرؤية والرسالة</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Left side - User info and auth buttons */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {userProfile ? (
                <>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Link to="/profile" className="flex items-center space-x-2 space-x-reverse hover:text-gray-300">
                      <Avatar className="w-8 h-8 border-2 border-gray-600">
                        <AvatarImage 
                          src={userProfile.profile_picture_url} 
                          alt={userProfile.full_name_ar}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-700 text-white text-sm">
                          {userProfile.full_name_ar?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{userProfile.full_name_ar}</span>
                    </Link>
                    
                    {userProfile.role === 'admin' && (
                      <Link to="/admin">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>

                  <Button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button onClick={() => setIsLoginOpen(true)} className="bg-red-600 hover:bg-red-700">
                    تسجيل الدخول
                  </Button>
                  <Button onClick={() => setIsSignupOpen(true)} className="bg-red-600 hover:bg-red-700">
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
    </TooltipProvider>
  );
};

export default Header;
