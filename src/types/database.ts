
/**
 * Database Types for Yemen Student Platform
 * This file contains TypeScript interfaces that reflect the database design.
 */

// User account types - Updated to match Supabase schema
export interface User {
  id: string; // Changed from number to string (UUID)
  full_name_ar: string;
  full_name_en: string;
  email: string;
  password_hash: string; // Keep for compatibility but not used in Supabase queries
  phone_number?: string;
  role: 'student' | 'admin';
  profile_picture_url?: string;
  created_at: string; // ISO date string
}

// Service request types
export type ServiceType = 
  'certificate_authentication' | 
  'certificate_documentation' | 
  'ministry_authentication' | 
  'passport_renewal' | 
  'visa_request';

export type RequestStatus = 
  'submitted' | 
  'under_review' | 
  'processing' | 
  'approved' | 
  'rejected';

export interface Request {
  id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  service_type: ServiceType;
  status: RequestStatus;
  request_number: string;
  submission_date: string; // ISO date string
  university_name?: string;
  major?: string;
  additional_notes?: string;
  created_at: string; // ISO date string
}

// File upload types
export type FileType = 'passport' | 'certificate' | 'visa_request' | 'other';

export interface UploadedFile {
  id: string; // Changed from number to string (UUID)
  request_id: string; // Changed from number to string (UUID)
  file_type: FileType;
  file_path: string;
  uploaded_at: string; // ISO date string
}

// News item for announcement slider
export interface NewsItem {
  id: string; // Already string to handle UUIDs properly
  title: string;
  content: string;
  is_active: boolean;
  created_at: string; // ISO date string
  image_url?: string; // Added image_url field as optional
}

// Student Library Document types
export type LibraryCategory = 'Medical' | 'Engineering' | 'IT';
export type StudentCountry = 'Iraq' | 'Yemen';

export interface StudentLibraryDocument {
  id: string; // Changed from number to string (UUID)
  title: string;
  description?: string;
  file_url: string;
  category: LibraryCategory;
  country: StudentCountry;
  uploaded_by_admin_id?: string; // Changed from number to string (UUID)
  upload_date: string; // ISO date string
  created_at: string; // ISO date string
}

// Request tracking history
export interface RequestTracking {
  id: string; // Changed from number to string (UUID)
  request_id: string; // Changed from number to string (UUID)
  status: RequestStatus;
  update_note?: string;
  updated_by: string; // Changed from number to string (UUID)
  updated_at: string; // ISO date string
}

// User session
export interface Session {
  id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  session_token: string;
  expires_at: string; // ISO date string
  created_at: string; // ISO date string
}

// User notifications
export interface Notification {
  id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  title: string;
  message: string;
  is_read: boolean;
  created_at: string; // ISO date string
}

// Service feedback
export interface ServiceRating {
  id: string; // Changed from number to string (UUID)
  request_id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  rating: number; // 1-5
  comment?: string;
  rated_at: string; // ISO date string
}

// System audit logs
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

export interface AuditLog {
  id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  action_type: ActionType;
  target_table: string;
  target_id: string; // Changed from number to string (UUID)
  description?: string;
  ip_address: string;
  created_at: string; // ISO date string
}

// User document storage
export type DocumentType = 'passport' | 'certificate' | 'photo' | 'other';

export interface UserDocument {
  id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  document_type: DocumentType;
  file_path: string;
  uploaded_at: string; // ISO date string
}

// Admin roles and access
export type AdminRole = 'superadmin' | 'moderator' | 'support';

export interface Admin {
  id: string; // Changed from number to string (UUID)
  user_id: string; // Changed from number to string (UUID)
  role: AdminRole;
  assigned_services: ServiceType[];
  created_at: string; // ISO date string
}
