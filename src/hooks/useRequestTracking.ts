
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

      // If still no result, try a broader search to see if any similar requests exist
      if (!data && !error) {
        console.log('Trying broader search for debugging...');
        const { data: allRequests, error: allError } = await supabase
          .from('requests')
          .select('request_number')
          .limit(10);
        
        console.log('Sample requests in database:', allRequests);
        console.log('Search term comparison:', {
          searchTerm: cleanRequestNumber,
          searchTermBytes: Array.from(cleanRequestNumber).map(c => c.charCodeAt(0)),
          sampleFromDB: allRequests?.[0]?.request_number,
          sampleBytes: allRequests?.[0]?.request_number ? Array.from(allRequests[0].request_number).map(c => c.charCodeAt(0)) : []
        });
      }

      if (error) {
        console.error('Error searching request:', error);
        toast.error('حدث خطأ أثناء البحث عن الطلب');
        setIsLoading(false);
        return false;
      }

      if (!data) {
        console.log('No request found with number:', cleanRequestNumber);
        toast.error('لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من صحة رقم الطلب.');
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
