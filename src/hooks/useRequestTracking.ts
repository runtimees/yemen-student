
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

      // Try to get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Current session:', { session: !!session, error: sessionError });

      // First check if there are any requests in the database
      const { count, error: countError } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true });

      console.log('Total requests in database:', { count, error: countError });

      if (count === 0) {
        console.log('Database appears to be empty');
        // Get a sample of requests to verify
        const { data: sampleData, error: sampleError } = await supabase
          .from('requests')
          .select('request_number')
          .limit(5);
        
        console.log('Sample requests:', { data: sampleData, error: sampleError });
      }

      // Try to get the current user session
      console.log('Trying RPC function first...');
      const { data: directData, error: directError } = await supabase
        .rpc('get_request_by_number', { search_number: cleanRequestNumber });

      console.log('RPC call result:', { data: directData, error: directError });

      // If RPC doesn't exist or fails, try direct table access
      if (directError && directError.message?.includes('function')) {
        console.log('RPC function not found, trying direct table access...');
        
        // Try exact match first
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
            const requestInfo = {
              request_number: caseInsensitiveData.request_number,
              status: caseInsensitiveData.status,
              service_type: caseInsensitiveData.service_type,
              admin_notes: caseInsensitiveData.admin_notes,
              submission_date: caseInsensitiveData.submission_date,
              created_at: caseInsensitiveData.created_at
            };

            setRequestData(requestInfo);
            setStatusTimeline(generateStatusTimeline(requestInfo));
            setIsLoading(false);
            return true;
          }

          // Try partial match search
          console.log('Trying partial match search...');
          const { data: partialData, error: partialError } = await supabase
            .from('requests')
            .select(`
              request_number,
              status,
              service_type,
              admin_notes,
              submission_date,
              created_at
            `)
            .ilike('request_number', `%${cleanRequestNumber}%`)
            .limit(1)
            .maybeSingle();

          console.log('Partial match search result:', { data: partialData, error: partialError });

          if (partialData) {
            const requestInfo = {
              request_number: partialData.request_number,
              status: partialData.status,
              service_type: partialData.service_type,
              admin_notes: partialData.admin_notes,
              submission_date: partialData.submission_date,
              created_at: partialData.created_at
            };

            setRequestData(requestInfo);
            setStatusTimeline(generateStatusTimeline(requestInfo));
            setIsLoading(false);
            return true;
          }

          if (count === 0) {
            toast.error('لا توجد طلبات في النظام حالياً');
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
      }

      // Handle RPC result with proper type assertion
      if (directData) {
        const typedData = directData as RequestData;
        const requestInfo = {
          request_number: typedData.request_number,
          status: typedData.status,
          service_type: typedData.service_type,
          admin_notes: typedData.admin_notes,
          submission_date: typedData.submission_date,
          created_at: typedData.created_at
        };

        setRequestData(requestInfo);
        setStatusTimeline(generateStatusTimeline(requestInfo));
        setIsLoading(false);
        return true;
      }

      toast.error(`لم يتم العثور على طلب بالرقم: ${cleanRequestNumber}. يرجى التأكد من صحة رقم الطلب.`);
      setIsLoading(false);
      return false;

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
