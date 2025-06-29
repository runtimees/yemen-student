
-- Enable Row Level Security for the student_library_documents table
ALTER TABLE public.student_library_documents ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert library documents
CREATE POLICY "Allow admins to insert library documents" ON public.student_library_documents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update library documents
CREATE POLICY "Allow admins to update library documents" ON public.student_library_documents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to delete library documents
CREATE POLICY "Allow admins to delete library documents" ON public.student_library_documents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow everyone to read library documents (public access)
CREATE POLICY "Allow public to read library documents" ON public.student_library_documents
  FOR SELECT USING (true);

-- Allow admins to read all library documents
CREATE POLICY "Allow admins to read all library documents" ON public.student_library_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
