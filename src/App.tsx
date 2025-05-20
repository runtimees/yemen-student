
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import TrackRequests from '@/pages/TrackRequests';
import Vision from '@/pages/Vision';
import StudyIraq from '@/pages/StudyIraq';
import NotFound from '@/pages/NotFound';
import ServiceForm from '@/pages/ServiceForm';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/auth/AuthGuard';

function App() {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/track" element={<AuthGuard><TrackRequests /></AuthGuard>} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/study-iraq" element={<StudyIraq />} />
          <Route path="/service/:serviceType" element={<AuthGuard><ServiceForm /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
      <SonnerToaster position="top-center" richColors closeButton />
    </div>
  );
}

export default App;
