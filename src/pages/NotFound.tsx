
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-5xl font-bold mb-4 text-yemen-red">404</h1>
        <p className="text-xl text-gray-600 mb-6">عذراً، الصفحة المطلوبة غير موجودة</p>
        <p className="text-gray-500 mb-6">
          الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة حالياً.
        </p>
        <Link to="/" className="bg-yemen-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
