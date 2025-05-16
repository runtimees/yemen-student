
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceForm from "./pages/ServiceForm";
import TrackRequests from "./pages/TrackRequests";
import Vision from "./pages/Vision";
import StudyIraq from "./pages/StudyIraq";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={
              <AuthGuard>
                <Services />
              </AuthGuard>
            } />
            <Route path="/service-form/:serviceId" element={
              <AuthGuard>
                <ServiceForm />
              </AuthGuard>
            } />
            <Route path="/track" element={
              <AuthGuard>
                <TrackRequests />
              </AuthGuard>
            } />
            <Route path="/vision" element={<Vision />} />
            <Route path="/study-iraq" element={<StudyIraq />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
