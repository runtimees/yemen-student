
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name_ar: string
          full_name_en: string
          email: string
          phone_number: string | null
          role: 'student' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          full_name_ar: string
          full_name_en: string
          email: string
          phone_number?: string | null
          role?: 'student' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          full_name_ar?: string
          full_name_en?: string
          email?: string
          phone_number?: string | null
          role?: 'student' | 'admin'
          created_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          user_id: string
          service_type: string
          status: string
          request_number: string
          submission_date: string
          university_name: string | null
          major: string | null
          additional_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_type: string
          status?: string
          request_number: string
          submission_date: string
          university_name?: string | null
          major?: string | null
          additional_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_type?: string
          status?: string
          request_number?: string
          submission_date?: string
          university_name?: string | null
          major?: string | null
          additional_notes?: string | null
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          request_id: string
          file_type: string
          file_path: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          request_id: string
          file_type: string
          file_path: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          file_type?: string
          file_path?: string
          uploaded_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
