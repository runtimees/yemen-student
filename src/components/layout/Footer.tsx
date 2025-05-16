
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-yemen-black text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">منصة الطلبة اليمنيين</h3>
            <p className="text-sm">
              نحو تعليم عالٍ أسهل وأكثر تمكينًا للطلاب اليمنيين في العراق.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-yemen-red">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm hover:text-yemen-red">
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-sm hover:text-yemen-red">
                  تتبع طلباتك
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <address className="not-italic text-sm">
              <p>البريد الإلكتروني: info@yemeni-students.org</p>
              <p>الهاتف: +964 123 456 789</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} منصة الطلبة اليمنيين في العراق. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
