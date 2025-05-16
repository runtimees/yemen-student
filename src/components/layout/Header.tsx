
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="bg-yemen-black text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-2">
            <img 
              src="/lovable-uploads/3f42ec74-bc6b-49c4-8f8c-3a5e6895dc36.png" 
              alt="Yemen Student Platform Logo" 
              className="h-14 w-auto"
            />
          </div>
          <h1 className="text-xl font-bold">منصة الطلبة اليمنيين في العراق</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-white border-yemen-red hover:bg-yemen-red">
            تسجيل الدخول
          </Button>
          <Button className="bg-yemen-red hover:bg-red-700 text-white">
            إنشاء حساب
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
