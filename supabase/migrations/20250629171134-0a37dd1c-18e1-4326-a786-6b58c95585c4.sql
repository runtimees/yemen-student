
-- Create the news-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images', 
  'news-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Allow authenticated users to upload news images
CREATE POLICY "Allow authenticated users to upload news images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'news-images' AND 
    auth.role() = 'authenticated'
  );

-- Allow public read access to news images
CREATE POLICY "Allow public read access to news images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

-- Allow admins to delete news images
CREATE POLICY "Allow admins to delete news images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'news-images' AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update news images
CREATE POLICY "Allow admins to update news images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'news-images' AND 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
