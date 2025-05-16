
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Vision = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-yemen-black">رؤيتنا</h1>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-8">
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-yemen-red">رؤية المنصة</h2>
                  <p className="text-gray-700 leading-relaxed">
                    نسعى لنكون المنصة الرقمية الرائدة في خدمة الطلبة اليمنيين في العراق، من خلال تقديم خدمات إلكترونية متكاملة تلبي احتياجاتهم وتسهل إجراءاتهم الدراسية والإدارية، وبناء جسور التواصل بين الطلبة والجهات الرسمية بطريقة سلسة وآمنة.
                  </p>
                </section>
                
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4 text-yemen-blue">أهدافنا</h2>
                  <ul className="list-disc list-inside space-y-3 text-gray-700">
                    <li>تسهيل وتسريع الإجراءات الإدارية للطلبة اليمنيين في العراق</li>
                    <li>توفير منصة موحدة لكافة الخدمات التي يحتاجها الطالب اليمني</li>
                    <li>تقليل الوقت والجهد المبذول في معاملات توثيق وتصديق الشهادات</li>
                    <li>ضمان سلامة وأمان البيانات والوثائق الخاصة بالطلبة</li>
                    <li>تحسين تجربة الطالب اليمني خلال فترة دراسته في العراق</li>
                    <li>تعزيز التواصل بين الطلبة والجهات الرسمية المعنية</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-yemen-black">رسالتنا</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    تقديم حلول رقمية متكاملة للطلبة اليمنيين الدارسين في العراق تمكنهم من إنجاز إجراءاتهم الإدارية والأكاديمية بسهولة وكفاءة، والمساهمة في تحسين تجربتهم التعليمية من خلال تذليل العقبات البيروقراطية وتوفير المعلومات اللازمة في مكان واحد.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    نؤمن بأن الاستثمار في تعليم الشباب اليمني هو استثمار في مستقبل اليمن، ونسعى لأن نكون جزءاً من هذا المستقبل من خلال تمكين الطلبة وتسهيل رحلتهم التعليمية.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Vision;
