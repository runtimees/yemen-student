-- Add admin policies for requests table to allow admins to manage all requests
CREATE POLICY "Allow admins to read all requests" ON requests
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

CREATE POLICY "Allow admins to update all requests" ON requests
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Add admin policies for files table to allow admins to view all files
CREATE POLICY "Allow admins to read all files" ON files
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ));