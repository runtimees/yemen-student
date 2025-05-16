import { User, Request, ServiceType, UploadedFile, NewsItem } from '@/types/database';

// Mock user data
const users: User[] = [
  {
    id: 1,
    full_name_ar: 'محمد علي',
    full_name_en: 'Mohammed Ali',
    email: 'user@example.com',
    password_hash: 'password123', // This would be hashed in production
    role: 'student',
    created_at: new Date().toISOString()
  }
];

// Mock requests
const requests: Request[] = [
  {
    id: 1,
    user_id: 1,
    service_type: 'certificate_authentication',
    status: 'under_review',
    request_number: 'REQ-2023-001',
    submission_date: '2023-05-15',
    university_name: 'جامعة بغداد',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 1,
    service_type: 'passport_renewal',
    status: 'submitted',
    request_number: 'REQ-2023-002',
    submission_date: '2023-05-20',
    created_at: new Date().toISOString()
  }
];

// Mock files
const uploadedFiles: UploadedFile[] = [
  {
    id: 1,
    request_id: 1,
    file_type: 'certificate',
    file_path: '/uploads/certificate_1.pdf',
    uploaded_at: new Date().toISOString()
  },
  {
    id: 2,
    request_id: 2,
    file_type: 'passport',
    file_path: '/uploads/passport_1.jpg',
    uploaded_at: new Date().toISOString()
  }
];

// Mock news
const news: NewsItem[] = [
  {
    id: 1,
    title: 'تحديث نظام المنصة',
    content: 'تم تحديث نظام المنصة لتوفير خدمات أفضل للطلبة',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'موعد استلام الطلبات',
    content: 'سيتم استلام طلبات الفصل الدراسي القادم بدءا من 1 سبتمبر',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Mock database service
export const mockDatabase = {
  // User operations
  getUserByEmail: (email: string) => {
    return users.find(user => user.email === email) || null;
  },
  
  createUser: (userData: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...userData,
      id: users.length + 1,
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  // Request operations
  getRequestsByUserId: (userId: number) => {
    return requests.filter(request => request.user_id === userId);
  },
  
  getRequestByNumber: (requestNumber: string) => {
    return requests.find(request => request.request_number === requestNumber) || null;
  },
  
  createRequest: (requestData: Omit<Request, 'id' | 'created_at'>) => {
    const newRequest: Request = {
      ...requestData,
      id: requests.length + 1,
      created_at: new Date().toISOString()
    };
    requests.push(newRequest);
    return newRequest;
  },

  // File operations
  getFilesByRequestId: (requestId: number) => {
    return uploadedFiles.filter(file => file.request_id === requestId);
  },
  
  uploadFile: (fileData: Omit<UploadedFile, 'id' | 'uploaded_at'>) => {
    const newFile: UploadedFile = {
      ...fileData,
      id: uploadedFiles.length + 1,
      uploaded_at: new Date().toISOString()
    };
    uploadedFiles.push(newFile);
    return newFile;
  },

  // News operations
  getActiveNews: () => {
    return news.filter(item => item.is_active);
  }
};

export default mockDatabase;
