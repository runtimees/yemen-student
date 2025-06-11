
-- Create a storage bucket for news images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images', 
  'news-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create a storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence-files', 
  'evidence-files', 
  true, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
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

-- Allow authenticated users to upload evidence files
CREATE POLICY "Allow authenticated users to upload evidence files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'evidence-files' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to read their own evidence files
CREATE POLICY "Allow users to read evidence files" ON storage.objects
  FOR SELECT USING (bucket_id = 'evidence-files');

-- Allow admins to delete news images
CREATE POLICY "Allow admins to delete news images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'news-images' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update news images
CREATE POLICY "Allow admins to update news images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'news-images' AND 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
