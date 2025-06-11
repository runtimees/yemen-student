
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

  const fetchRequestData = async (requestNumber: string): Promise<boolean> => {
    if (!requestNumber) {
      toast.error('يرجى إدخال رقم الطلب');
      return false;
    }

    setIsLoading(true);
    // Clear previous data to ensure fresh fetch
    setRequestData(null);
    setStatusTimeline([]);

    try {
      // Clean the request number (trim whitespace and normalize case)
      const cleanRequestNumber = requestNumber.trim();
      console.log('Searching for request:', { 
        original: requestNumber, 
        cleaned: cleanRequestNumber,
        length: cleanRequestNumber.length 
      });

      // Force fresh data by disabling cache and ensuring we get the latest data
      const { data, error } = await supabase
        .from('requests')
        .select(`
          request_number,
          status,
          service_type,
          admin_notes,
          submission_date,
          created_at
        `)
        .eq('request_number', cleanRequestNumber)
        .maybeSingle();

      console.log('Direct table query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        if (error.message.includes('RLS')) {
          toast.error('خطأ في صلاحيات الوصول. يرجى المحاولة مرة أخرى.');
        } else {
          toast.error('حدث خطأ أثناء البحث عن الطلب');
        }
        setIsLoading(false);
        return false;
      }

      if (!data) {
        // Try case-insensitive search
        console.log('Trying case-insensitive search...');
        const { data: caseInsensitiveData, error: caseError } = await supabase
          .from('requests')
          .select(`
            request_number,
            status,
            service_type,
            admin_notes,
            submission_date,
            created_at
          `)
          .ilike('request_number', cleanRequestNumber)
          .maybeSingle();

        console.log('Case-insensitive search result:', { data: caseInsensitiveData, error: caseError });

        if (caseInsensitiveData) {
          const requestInfo: RequestData = {
            request_number: caseInsensitiveData.request_number,
            status: caseInsensitiveData.status,
            service_type: caseInsensitiveData.service_type,
            admin_notes: caseInsensitiveData.admin_notes,
            submission_date: caseInsensitiveData.submission_date,
            created_at: caseInsensitiveData.created_at
          };

          console.log('Setting request data:', requestInfo);
          setRequestData(requestInfo);
          setStatusTimeline(generateStatusTimeline(requestInfo));
          setIsLoading(false);
          return true;
        }

        toast.error(`لم يتم العثور على طلب بالرقم: ${cleanRequestNumber}. يرجى التأكد من صحة رقم الطلب.`);
        setIsLoading(false);
        return false;
      }

      const requestInfo: RequestData = {
        request_number: data.request_number,
        status: data.status,
        service_type: data.service_type,
        admin_notes: data.admin_notes,
        submission_date: data.submission_date,
        created_at: data.created_at
      };

      console.log('Request found and setting data:', requestInfo);
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
