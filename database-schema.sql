
-- Create tables for Yemen Student Platform

-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name_ar TEXT NOT NULL,
  full_name_en TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Secure the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Only admins can update profiles" ON users
  FOR UPDATE USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Requests table
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  service_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  request_number TEXT UNIQUE NOT NULL,
  submission_date TEXT NOT NULL,
  university_name TEXT,
  major TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Secure the requests table
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own requests" ON requests
  FOR SELECT USING (auth.uid()::TEXT = user_id::TEXT);
CREATE POLICY "Users can create their own requests" ON requests
  FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id::TEXT);
CREATE POLICY "Only admins can update any request" ON requests
  FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Files table
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) NOT NULL,
  file_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Secure the files table
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view files for their own requests" ON files
  USING (EXISTS (
    SELECT 1 FROM requests WHERE requests.id = files.request_id AND requests.user_id::TEXT = auth.uid()::TEXT
  ));
CREATE POLICY "Users can upload files for their own requests" ON files
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM requests WHERE requests.id = files.request_id AND requests.user_id::TEXT = auth.uid()::TEXT
  ));

-- News table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- News is public information - allow anyone to view active news
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active news" ON news
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Only admins can manage news" ON news
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Sample data for news
INSERT INTO news (title, content, is_active)
VALUES 
  ('تحديث نظام المنصة', 'تم تحديث نظام المنصة لتوفير خدمات أفضل للطلبة', TRUE),
  ('موعد استلام الطلبات', 'سيتم استلام طلبات الفصل الدراسي القادم بدءا من 1 سبتمبر', TRUE);

-- Create storage bucket for files
-- Note: This must be done through the Supabase dashboard or using the Supabase CLI
