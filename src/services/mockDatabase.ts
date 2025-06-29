import { User, Request, NewsItem } from '@/types/database';

// Mock data with string UUIDs
const mockUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    full_name_ar: "أحمد محمد علي",
    full_name_en: "Ahmed Mohammed Ali",
    email: "ahmed@example.com",
    password_hash: "hashed_password",
    phone_number: "+964123456789",
    role: "student",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    full_name_ar: "فاطمة حسن",
    full_name_en: "Fatima Hassan",
    email: "fatima@example.com",
    password_hash: "hashed_password",
    phone_number: "+964987654321",
    role: "student",
    created_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    full_name_ar: "عبد الله محمود",
    full_name_en: "Abdullah Mahmoud",
    email: "abdullah@example.com",
    password_hash: "hashed_password",
    phone_number: "+964555123456",
    role: "admin",
    created_at: "2024-01-03T00:00:00Z"
  }
];

const mockRequests: Request[] = [
  {
    id: "750e8400-e29b-41d4-a716-446655440000",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    service_type: "certificate_authentication",
    status: "under_review",
    request_number: "REQ-2024-0001",
    submission_date: "2024-01-15",
    university_name: "جامعة بغداد",
    major: "هندسة الحاسوب",
    created_at: "2024-01-15T10:00:00Z"
  }
];

const mockNews: NewsItem[] = [
  {
    id: "850e8400-e29b-41d4-a716-446655440000",
    title: "مرحباً بكم في منصة الطلبة اليمنيين",
    content: "نحن سعداء لخدمتكم وتقديم أفضل الخدمات للطلبة اليمنيين في العراق",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  }
];

export const mockDatabase = {
  users: {
    findByEmail: async (email: string): Promise<User | null> => {
      const user = mockUsers.find(u => u.email === email);
      return user || null;
    },
    
    create: async (userData: Omit<User, 'id' | 'created_at'>): Promise<User> => {
      const newUser: User = {
        id: `550e8400-e29b-41d4-a716-${Date.now().toString().padStart(12, '0')}`,
        ...userData,
        created_at: new Date().toISOString()
      };
      mockUsers.push(newUser);
      return newUser;
    },
    
    findById: async (id: string): Promise<User | null> => {
      const user = mockUsers.find(u => u.id === id);
      return user || null;
    }
  },
  
  requests: {
    findByUserId: async (userId: string): Promise<Request[]> => {
      return mockRequests.filter(r => r.user_id === userId);
    },
    
    create: async (requestData: Omit<Request, 'id' | 'created_at'>): Promise<Request> => {
      const newRequest: Request = {
        id: `750e8400-e29b-41d4-a716-${Date.now().toString().padStart(12, '0')}`,
        ...requestData,
        created_at: new Date().toISOString()
      };
      mockRequests.push(newRequest);
      return newRequest;
    },
    
    findByNumber: async (requestNumber: string): Promise<Request | null> => {
      const request = mockRequests.find(r => r.request_number === requestNumber);
      return request || null;
    }
  },
  
  news: {
    getActive: async (): Promise<NewsItem[]> => {
      return mockNews.filter(n => n.is_active);
    }
  }
};
