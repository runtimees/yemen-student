
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { generateStatusTimeline } from '@/utils/requestUtils';

interface RequestData {
  request_number: string;
  status: string;
  service_type: string;
  admin_notes: string | null;
  submission_date: string;
  created_at: string;
}

interface StatusTimelineItem {
  status: string;
  date: string;
  complete: boolean;
}

export const useRequestTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [statusTimeline, setStatusTimeline] = useState<StatusTimelineItem[]>([]);

  const fetchRequestData = async (requestNumber: string, submissionDate: string): Promise<boolean> => {
    if (!requestNumber || !submissionDate) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return false;
    }

    setIsLoading(true);

    try {
      console.log('Searching for request:', { requestNumber, submissionDate });

      // First try to find by request number only
      const { data: allRequests, error: searchError } = await supabase
        .from('requests')
        .select('*')
        .eq('request_number', requestNumber);

      if (searchError) {
        console.error('Error searching requests:', searchError);
        toast.error('حدث خطأ أثناء البحث عن الطلب');
        setIsLoading(false);
        return false;
      }

      console.log('Found requests:', allRequests);

      if (!allRequests || allRequests.length === 0) {
        toast.error('لم يتم العثور على طلب بهذا الرقم');
        setIsLoading(false);
        return false;
      }

      // Filter by date on the client side for more flexibility
      const targetDate = new Date(submissionDate);
      const matchingRequest = allRequests.find(request => {
        const requestDate = new Date(request.created_at);
        const requestDateString = requestDate.toISOString().split('T')[0];
        const targetDateString = targetDate.toISOString().split('T')[0];
        
        console.log('Comparing dates:', { requestDateString, targetDateString });
        return requestDateString === targetDateString;
      });

      if (!matchingRequest) {
        toast.error('لم يتم العثور على طلب بالبيانات المدخلة - تأكد من تاريخ التقديم');
        setIsLoading(false);
        return false;
      }

      const requestInfo = {
        request_number: matchingRequest.request_number,
        status: matchingRequest.status,
        service_type: matchingRequest.service_type,
        admin_notes: matchingRequest.admin_notes,
        submission_date: matchingRequest.submission_date,
        created_at: matchingRequest.created_at
      };

      console.log('Request found:', requestInfo);

      setRequestData(requestInfo);
      setStatusTimeline(generateStatusTimeline(requestInfo));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('حدث خطأ أثناء البحث عن الطلب');
      setIsLoading(false);
      return false;
    }
  };

  return {
    isLoading,
    requestData,
    statusTimeline,
    fetchRequestData
  };
};
