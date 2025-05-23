
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
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('request_number', requestNumber)
        .gte('created_at', `${submissionDate}T00:00:00`)
        .lt('created_at', `${submissionDate}T23:59:59`)
        .single();

      if (error) {
        console.error('Error fetching request:', error);
        toast.error('لم يتم العثور على طلب بالبيانات المدخلة');
        setIsLoading(false);
        return false;
      }

      if (!data) {
        toast.error('لم يتم العثور على طلب بالبيانات المدخلة');
        setIsLoading(false);
        return false;
      }

      const requestInfo = {
        request_number: data.request_number,
        status: data.status,
        service_type: data.service_type,
        admin_notes: data.admin_notes,
        submission_date: data.submission_date,
        created_at: data.created_at
      };

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
