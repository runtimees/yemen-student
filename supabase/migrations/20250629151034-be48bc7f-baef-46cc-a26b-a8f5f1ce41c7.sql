
-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'user-uploads', true);

-- Create policy to allow authenticated users to upload their own files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow public read access to uploaded files
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'user-uploads');

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
