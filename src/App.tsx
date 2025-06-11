
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import TrackRequests from '@/pages/TrackRequests';
import Vision from '@/pages/Vision';
import StudyIraq from '@/pages/StudyIraq';
import MovementGuides from '@/pages/MovementGuides';
import StudentLibrary from '@/pages/StudentLibrary';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import ServiceForm from '@/pages/ServiceForm';
import AdminDashboard from '@/pages/admin/Dashboard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/auth/AuthGuard';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/track" element={<AuthGuard><TrackRequests /></AuthGuard>} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/study-iraq" element={<StudyIraq />} />
            <Route path="/movement-guides" element={<MovementGuides />} />
            <Route path="/student-library" element={<StudentLibrary />} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="/service/:serviceType" element={<AuthGuard><ServiceForm /></AuthGuard>} />
            <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
      </div>
    </AuthProvider>
  );
}

export default App;
