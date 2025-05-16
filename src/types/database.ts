
/**
 * Database Types for Yemen Student Platform
 * This file contains TypeScript interfaces that reflect the database design.
 */

// User account types
export interface User {
  id: number;
  full_name_ar: string;
  full_name_en: string;
  email: string;
  password_hash: string;
  phone_number?: string;
  role: 'student' | 'admin';
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
  id: number;
  user_id: number;
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
  id: number;
  request_id: number;
  file_type: FileType;
  file_path: string;
  uploaded_at: string; // ISO date string
}

// News item for announcement slider
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string; // ISO date string
}

// Request tracking history
export interface RequestTracking {
  id: number;
  request_id: number;
  status: RequestStatus;
  update_note?: string;
  updated_by: number;
  updated_at: string; // ISO date string
}

// User session
export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string; // ISO date string
  created_at: string; // ISO date string
}

// User notifications
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string; // ISO date string
}

// Service feedback
export interface ServiceRating {
  id: number;
  request_id: number;
  user_id: number;
  rating: number; // 1-5
  comment?: string;
  rated_at: string; // ISO date string
}

// System audit logs
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';

export interface AuditLog {
  id: number;
  user_id: number;
  action_type: ActionType;
  target_table: string;
  target_id: number;
  description?: string;
  ip_address: string;
  created_at: string; // ISO date string
}

// User document storage
export type DocumentType = 'passport' | 'certificate' | 'photo' | 'other';

export interface UserDocument {
  id: number;
  user_id: number;
  document_type: DocumentType;
  file_path: string;
  uploaded_at: string; // ISO date string
}

// Admin roles and access
export type AdminRole = 'superadmin' | 'moderator' | 'support';

export interface Admin {
  id: number;
  user_id: number;
  role: AdminRole;
  assigned_services: ServiceType[];
  created_at: string; // ISO date string
}
