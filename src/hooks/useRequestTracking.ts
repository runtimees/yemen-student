
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

    try {
      // Clean the request number (trim whitespace and normalize case)
      const cleanRequestNumber = requestNumber.trim();
      console.log('Searching for request:', { 
        original: requestNumber, 
        cleaned: cleanRequestNumber,
        length: cleanRequestNumber.length 
      });

      // First, let's check if there are ANY requests in the database
      const { data: allRequestsCount, error: countError } = await supabase
        .from('requests')
        .select('id', { count: 'exact', head: true });

      console.log('Total requests in database:', { count: allRequestsCount, error: countError });

      if (countError) {
        console.error('Error counting requests:', countError);
        toast.error('حدث خطأ أثناء الاتصال بقاعدة البيانات');
        setIsLoading(false);
        return false;
      }

      // Get a sample of request numbers to debug
      const { data: sampleRequests, error: sampleError } = await supabase
        .from('requests')
        .select('request_number')
        .limit(5);

      console.log('Sample request numbers in database:', { 
        requests: sampleRequests,
        error: sampleError 
      });

      // Try exact match first
      let { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('request_number', cleanRequestNumber)
        .maybeSingle();

      console.log('Exact search result:', { data, error });

      // If exact match fails, try case-insensitive search
      if (!data && !error) {
        console.log('Trying case-insensitive search...');
        const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
          .from('requests')
          .select('*')
          .ilike('request_number', cleanRequestNumber)
          .maybeSingle();
        
        data = caseInsensitiveData;
        error = caseInsensitiveError;
        console.log('Case-insensitive search result:', { data, error });
      }

      // If still no result, try partial match
      if (!data && !error) {
        console.log('Trying partial match search...');
        const { data: partialData, error: partialError } = await supabase
          .from('requests')
          .select('*')
          .ilike('request_number', `%${cleanRequestNumber}%`)
          .maybeSingle();
        
        data = partialData;
        error = partialError;
        console.log('Partial search result:', { data, error });
      }

      if (error) {
        console.error('Error searching request:', error);
        toast.error('حدث خطأ أثناء البحث عن الطلب');
        setIsLoading(false);
        return false;
      }

      if (!data) {
        console.log('No request found with number:', cleanRequestNumber);
        
        // Show detailed message based on database state
        if (sampleRequests && sampleRequests.length === 0) {
          toast.error('قاعدة البيانات فارغة. لا توجد طلبات في النظام حالياً.');
        } else {
          toast.error(`لم يتم العثور على طلب بالرقم: ${cleanRequestNumber}. يرجى التأكد من صحة رقم الطلب.`);
        }
        
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
