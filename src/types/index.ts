// Định nghĩa các types cho ứng dụng

// Response wrapper từ backend
export interface ResponseDto<T> {
  status: number;
  message: string;
  data: T;
}

// Request types
export interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInformationRequest {
  fullName: string;
  bio?: string;
}

// Chat message request DTO để gửi lên backend
export interface ChatMessageRequestDto {
  senderId: number;
  message: string;
}

// Response types từ backend
export interface AccountResponse {
  id: string;
  email: string;
  userName: string;
  role: string;
  token: string;
  isActive: boolean;
}

export interface UserInformationResponse {
  username: string;
  accountId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// Frontend types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface TheoryContent {
  id: string;
  title: string;
  content: string;
  category: 'commodity' | 'production' | 'value';
  createdAt: string;
}

// Admin types
export interface OnlineUserResponse {
  totalOnlineUsers: number;
  lastUpdated: string;
  onlineUsers?: OnlineUserDetail[];
}

export interface OnlineUserDetail {
  accountId: string;
  username: string;
  role: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean; // Giữ nguyên isActive cho OnlineUserDetail vì đây là trạng thái hoạt động real-time
}

export interface ListAccountResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  active: boolean; // Backend trả về field "active" chứ không phải "isActive"
  avatarUrl?: string; // Thêm avatar URL
  created: string; // Backend trả về "created" chứ không phải "createdAt"
  updated?: string; // Thêm field updated
}
