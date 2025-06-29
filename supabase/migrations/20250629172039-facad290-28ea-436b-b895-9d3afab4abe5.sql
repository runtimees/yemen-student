
-- Enable Row Level Security for the news table
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Allow admins to insert news
CREATE POLICY "Allow admins to insert news" ON public.news
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update news
CREATE POLICY "Allow admins to update news" ON public.news
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to delete news
CREATE POLICY "Allow admins to delete news" ON public.news
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow everyone to read active news
CREATE POLICY "Allow public to read active news" ON public.news
  FOR SELECT USING (is_active = true);

-- Allow admins to read all news (active and inactive)
CREATE POLICY "Allow admins to read all news" ON public.news
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
