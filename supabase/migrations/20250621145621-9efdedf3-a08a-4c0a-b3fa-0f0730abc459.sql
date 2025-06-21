
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view files for their own requests" ON public.files;
DROP POLICY IF EXISTS "Users can upload files for their own requests" ON public.files;
DROP POLICY IF EXISTS "Admins can view all files" ON public.files;

-- Add RLS policies for the files table to allow admins to view all files
CREATE POLICY "Users can view files for their own requests" ON public.files
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.requests 
  WHERE requests.id = files.request_id 
  AND requests.user_id = auth.uid()
));

CREATE POLICY "Users can upload files for their own requests" ON public.files
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM public.requests 
  WHERE requests.id = files.request_id 
  AND requests.user_id = auth.uid()
));

CREATE POLICY "Admins can view all files" ON public.files
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id = auth.uid() 
  AND users.role = 'admin'
));

-- Enable RLS on files table if not already enabled
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
