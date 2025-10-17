// API services tích hợp với Spring Boot backend
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  ChatMessage, 
  TheoryContent,
  ResponseDto,
  RegisterRequest,
  LoginRequest,
  AccountResponse,
  UserInformationResponse,
  UserInformationRequest,
  ChatMessageRequestDto,
  OnlineUserResponse,
  ListAccountResponse
} from '../types';

// Cấu hình base URL - thay đổi theo môi trường
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Tăng timeout để tránh timeout errors
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache', // Tránh cache issues
  },
  // Thêm withCredentials nếu cần CORS cookies
  withCredentials: false,
});

// Request interceptor để thêm JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    
    // Debug logging cho tất cả admin requests
    if (config.url?.includes('/api/admin/')) {
      console.log('🔍 Admin API Request Debug:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        headers: config.headers,
        timestamp: new Date().toISOString()
      });
    }
    
    if (token) {
      // Thêm Authorization header với proper format
      config.headers = config.headers || {};
      
      // Đảm bảo token không có "Bearer " prefix duplicate
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      config.headers['Authorization'] = `Bearer ${cleanToken}`;
      
      // Debug logging cho admin requests
      if (config.url?.includes('/api/admin/')) {
        console.log('🔑 Authorization Header Debug:', {
          originalToken: token.substring(0, 30) + '...',
          cleanToken: cleanToken.substring(0, 30) + '...',
          authHeader: config.headers['Authorization'].substring(0, 30) + '...',
          hasBearer: config.headers['Authorization'].startsWith('Bearer '),
          tokenLength: cleanToken.length
        });
      }
      
      // Debug logging cho upload requests
      if (config.url?.includes('uploadAvatar')) {
        console.log('Request interceptor - Adding Authorization header for upload');
        console.log('Request URL:', config.url);
        console.log('Request method:', config.method);
        console.log('Request headers:', config.headers);
        console.log('Request data type:', typeof config.data);
        console.log('Request data:', config.data instanceof FormData ? 'FormData object' : config.data);
      }
    } else {
      console.warn('⚠️ Request interceptor - No token found in localStorage for:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Debug logging cho admin responses
    if (response.config.url?.includes('/api/admin/')) {
      console.log('✅ Admin API Response Debug:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        dataStatus: response.data?.status,
        dataMessage: response.data?.message,
        timestamp: new Date().toISOString()
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging cho admin APIs
    if (error.config?.url?.includes('/api/admin/')) {
      console.error('❌ Admin API Error Debug:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        errorMessage: error.message,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      });
    }
    
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      console.warn('🔐 Token expired or invalid, redirecting to login');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      window.location.href = '/';
    }
    
    // Xử lý lỗi 500 với "Access Denied" - có thể là lỗi authorization
    if (error.response?.status === 500 && 
        error.response?.data?.message?.includes('Access Denied')) {
      console.error('🚫 Access Denied Error - Possible authorization issue:', {
        url: error.config?.url,
        responseData: error.response.data,
        currentRole: localStorage.getItem('user_role'),
        tokenExists: !!localStorage.getItem('auth_token')
      });
      
      // Có thể token không có quyền admin hoặc đã hết hạn
      // Thử decode token để kiểm tra
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Date.now() / 1000;
          
          console.error('🔍 Token Analysis for Access Denied:', {
            isExpired: payload.exp < now,
            roles: payload.roles || payload.authorities || payload.role,
            sub: payload.sub,
            exp: payload.exp,
            currentTime: now
          });
          
          // Nếu token hết hạn, redirect về login
          if (payload.exp < now) {
            console.warn('🔐 Token expired, redirecting to login');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_role');
            window.location.href = '/';
            return Promise.reject(error);
          }
        } catch (tokenError) {
          console.error('❌ Cannot decode token:', tokenError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Helper function để chuyển đổi UserInformationResponse thành User
const mapUserInformationToUser = (userInfo: UserInformationResponse, email?: string, role?: string): User => {
  // Debug avatar URL từ user API
  console.log('User API - Raw userInfo:', userInfo.username, 'Raw avatarUrl:', userInfo.avatarUrl);
  
  // Build full avatar URL nếu cần
  let fullAvatarUrl = userInfo.avatarUrl;
  if (userInfo.avatarUrl) {
    if (userInfo.avatarUrl.startsWith('http')) {
      // URL đã là full URL (Cloudinary, etc.)
      fullAvatarUrl = userInfo.avatarUrl;
      console.log('User API - Using external URL:', fullAvatarUrl);
    } else {
      // Relative path, build với API base URL
      fullAvatarUrl = `${API_BASE_URL}${userInfo.avatarUrl.startsWith('/') ? '' : '/'}${userInfo.avatarUrl}`;
      console.log('User API - Built local avatar URL:', fullAvatarUrl);
    }
  } else {
    console.log('User API - No avatar URL for user:', userInfo.username);
  }
  
  return {
    id: userInfo.accountId,
    username: userInfo.username,
    email: email || '', // Email không có trong UserInformationResponse
    fullName: userInfo.fullName,
    avatar: fullAvatarUrl,
    bio: userInfo.bio,
    role: role,
    createdAt: userInfo.createdAt,
  };
};

// Helper function để retry API calls
const retryApiCall = async <T>(
  apiCall: () => Promise<T>, 
  maxRetries: number = 2, 
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      
      // Chỉ retry cho lỗi 500 hoặc network errors
      const shouldRetry = 
        error.response?.status === 500 || 
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK';
        
      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`API call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }
  
  throw lastError;
};

// Helper function để lấy error message từ backend
const getErrorMessage = (error: any, defaultMessage: string): string => {
  // Debug logging chỉ trong development
  if (process.env.NODE_ENV === 'development') {
    console.log('API Error Debug:', {
      error: error,
      response: error.response,
      data: error.response?.data,
      status: error.response?.status,
      code: error.code
    });
  }
  
  // Ưu tiên tuyệt đối message từ backend - kiểm tra nhiều path có thể
  if (error.response?.data) {
    const data = error.response.data;
    
    // Kiểm tra các field có thể chứa error message
    if (data.message && typeof data.message === 'string' && data.message.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Using backend message:', data.message);
      }
      return data.message.trim();
    }
    
    if (data.error && typeof data.error === 'string' && data.error.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Using backend error:', data.error);
      }
      return data.error.trim();
    }
    
    if (data.detail && typeof data.detail === 'string' && data.detail.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Using backend detail:', data.detail);
      }
      return data.detail.trim();
    }
    
    if (data.msg && typeof data.msg === 'string' && data.msg.trim()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Using backend msg:', data.msg);
      }
      return data.msg.trim();
    }
  }
  
  // Chỉ xử lý network errors khi không có message từ backend
  if (error.code) {
    switch (error.code) {
      case 'ERR_NETWORK':
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
      case 'ECONNABORTED':
        return 'Kết nối quá chậm. Vui lòng thử lại.';
      case 'ERR_CANCELED':
        return 'Yêu cầu đã bị hủy.';
    }
  }
  
  // Fallback message
  if (process.env.NODE_ENV === 'development') {
    console.log('Using default message:', defaultMessage);
  }
  return defaultMessage;
};

// Auth API
export const authAPI = {
  // Đăng ký tài khoản mới
  register: async (registerData: RegisterRequest): Promise<string> => {
    try {
      const response = await apiClient.post<ResponseDto<string>>('/api/auth/register', registerData);
      
      // Kiểm tra response status từ backend
      if (response.data.status !== 200 && response.data.status !== 201) {
        // Tạo error object giống như axios error để getErrorMessage có thể xử lý
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Đăng ký thất bại');
        throw new Error(errorMessage);
      }
      
      return response.data.data;
    } catch (error: any) {
      // Nếu error đã có message từ backend (từ logic trên), sử dụng trực tiếp
      if (error.message && error.message !== 'Đăng ký thất bại. Vui lòng thử lại.') {
        throw error;
      }
      
      // Nếu không, sử dụng getErrorMessage để xử lý error từ axios
      const errorMessage = getErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.');
      throw new Error(errorMessage);
    }
  },

  // Đăng nhập
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const loginRequest: LoginRequest = { username, password };
      const response = await apiClient.post<ResponseDto<AccountResponse>>('/api/auth/login', loginRequest);
      
      // Kiểm tra response status từ backend
      if (response.data.status !== 200) {
        // Tạo error object giống như axios error để getErrorMessage có thể xử lý
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Đăng nhập thất bại');
        throw new Error(errorMessage);
      }
      
      const accountData = response.data.data;
      
      // Lưu token tạm thời để có thể gọi getUserInformation
      const tempToken = accountData.token;
      
      try {
        // Gọi getUserInformation để lấy thông tin đầy đủ
        const userInfoResponse = await apiClient.get<ResponseDto<UserInformationResponse>>('/api/user-info', {
          headers: {
            'Authorization': `Bearer ${tempToken}`
          }
        });
        
        if (userInfoResponse.data.status === 200) {
          const userInfo = userInfoResponse.data.data;
          const user: User = {
            id: userInfo.accountId,
            username: userInfo.username,
            email: accountData.email, // Lấy email từ AccountResponse
            fullName: userInfo.fullName,
            avatar: userInfo.avatarUrl,
            bio: userInfo.bio,
            role: accountData.role,
            createdAt: userInfo.createdAt,
          };

          return {
            user,
            token: accountData.token
          };
        }
      } catch (userInfoError) {
        // Nếu không lấy được user info, tạo user cơ bản từ AccountResponse
        console.warn('Could not fetch user info, using basic account data');
      }
      
      // Fallback: tạo User object cơ bản từ AccountResponse
      const user: User = {
        id: accountData.id,
        username: accountData.userName,
        email: accountData.email,
        fullName: accountData.userName,
        role: accountData.role,
        createdAt: new Date().toISOString(),
      };

      return {
        user,
        token: accountData.token
      };
    } catch (error: any) {
      // Nếu error đã có message từ backend (từ logic trên), sử dụng trực tiếp
      if (error.message && error.message !== 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.') {
        throw error;
      }
      
      // Nếu không, sử dụng getErrorMessage để xử lý error từ axios
      const errorMessage = getErrorMessage(error, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      throw new Error(errorMessage);
    }
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await apiClient.post('/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      // Vẫn xóa token local dù API call thất bại
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<ResponseDto<UserInformationResponse>>('/api/user-info');
      
      // Kiểm tra response status từ backend
      if (response.data.status !== 200) {
        // Tạo error object giống như axios error để getErrorMessage có thể xử lý
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể lấy thông tin người dùng');
        throw new Error(errorMessage);
      }
      
      // Lấy email và role từ localStorage nếu có
      const savedEmail = localStorage.getItem('user_email');
      const savedRole = localStorage.getItem('user_role');
      
      return mapUserInformationToUser(response.data.data, savedEmail || undefined, savedRole || undefined);
    } catch (error: any) {
      // Nếu error đã có message từ backend (từ logic trên), sử dụng trực tiếp
      if (error.message && error.message !== 'Không thể lấy thông tin người dùng.') {
        throw error;
      }
      
      // Nếu không, sử dụng getErrorMessage để xử lý error từ axios
      const errorMessage = getErrorMessage(error, 'Không thể lấy thông tin người dùng.');
      throw new Error(errorMessage);
    }
  }
};

// Profile API
export const profileAPI = {
  updateProfile: async (userData: UserInformationRequest): Promise<User> => {
    try {
      const response = await apiClient.put<ResponseDto<UserInformationResponse>>('/api/user-info', userData);
      
      // Kiểm tra response status từ backend
      if (response.data.status !== 200) {
        // Tạo error object giống như axios error để getErrorMessage có thể xử lý
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Cập nhật thông tin thất bại');
        throw new Error(errorMessage);
      }
      
      // Lấy email và role từ localStorage
      const savedEmail = localStorage.getItem('user_email');
      const savedRole = localStorage.getItem('user_role');
      
      return mapUserInformationToUser(response.data.data, savedEmail || undefined, savedRole || undefined);
    } catch (error: any) {
      // Nếu error đã có message từ backend (từ logic trên), sử dụng trực tiếp
      if (error.message && error.message !== 'Cập nhật thông tin thất bại. Vui lòng thử lại.') {
        throw error;
      }
      
      // Nếu không, sử dụng getErrorMessage để xử lý error từ axios
      const errorMessage = getErrorMessage(error, 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
      throw new Error(errorMessage);
    }
  },

  // Upload avatar với MultipartFile
  uploadAvatar: async (userId: string, file: File): Promise<string> => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('auth_token');
      
      console.log('Upload avatar - Token exists:', !!token);
      console.log('Upload avatar - Token value:', token ? `${token.substring(0, 20)}...` : 'null');
      console.log('Upload avatar - Account ID:', userId);
      console.log('Upload avatar - File:', file.name, file.type, file.size);
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
      }

      // Tạo FormData với key "file" để match @RequestPart("file")
      const formData = new FormData();
      formData.append('file', file);

      console.log('Upload avatar - FormData prepared');
      
      // Tạo axios instance riêng cho upload để tránh conflict với default headers
      const uploadClient = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        // Không set default Content-Type
      });

      console.log('Upload avatar - Using dedicated upload client');
      
      const response = await uploadClient.post<ResponseDto<string>>(
        `/api/user-info/uploadAvatar/${userId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Browser sẽ tự động set Content-Type: multipart/form-data với boundary
          }
        }
      );

      console.log('Upload avatar - Response status:', response.status);
      console.log('Upload avatar response:', response.data);

      // Kiểm tra response status từ backend
      if (response.data.status !== 201) {
        // Tạo error object giống như axios error để getErrorMessage có thể xử lý
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Upload avatar thất bại');
        throw new Error(errorMessage);
      }
      
      return response.data.data; // Trả về URL avatar mới
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      console.error('Error response:', error.response);
      
      // Nếu error đã có message từ backend (từ logic trên), sử dụng trực tiếp
      if (error.message && error.message !== 'Upload avatar thất bại. Vui lòng thử lại.') {
        throw error;
      }
      
      // Xử lý một số trường hợp đặc biệt cho upload trước khi dùng getErrorMessage
      if (error.response?.status === 413 && !error.response?.data?.message) {
        throw new Error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      }
      
      if (error.response?.status === 415 && !error.response?.data?.message) {
        throw new Error('Định dạng file không được hỗ trợ. Vui lòng chọn file ảnh (JPG, PNG, GIF).');
      }
      
      // Sử dụng getErrorMessage để lấy message từ backend hoặc fallback
      const errorMessage = getErrorMessage(error, 'Upload avatar thất bại. Vui lòng thử lại.');
      throw new Error(errorMessage);
    }
  }
};

// Mock data cho Theory Content (giữ nguyên vì chưa có API backend)
const mockTheoryContent: TheoryContent[] = [
  {
    id: '1',
    title: 'Khái niệm về Hàng hóa',
    content: 'Hàng hóa là sản phẩm lao động được sản xuất ra để trao đổi...',
    category: 'commodity',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Giá trị sử dụng và Giá trị trao đổi',
    content: 'Mỗi hàng hóa đều có hai thuộc tính cơ bản...',
    category: 'commodity',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Theory Content API (vẫn dùng mock data)
export const theoryAPI = {
  getContent: async (): Promise<TheoryContent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockTheoryContent);
      }, 500);
    });
  }
};

// Debug utilities
export const debugUtils = {
  // Kiểm tra localStorage
  checkLocalStorage: () => {
    console.log('📦 LocalStorage Debug:', {
      auth_token: localStorage.getItem('auth_token') ? 'exists' : 'missing',
      user_email: localStorage.getItem('user_email'),
      user_id: localStorage.getItem('user_id'),
      user_role: localStorage.getItem('user_role'),
      allKeys: Object.keys(localStorage)
    });
  },
  
  // Kiểm tra token validity
  checkTokenValidity: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('❌ No token found');
      return false;
    }
    
    try {
      // Decode JWT payload (không verify signature)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      console.log('🔐 Token Debug:', {
        hasToken: true,
        tokenLength: token.length,
        tokenPreview: `${token.substring(0, 20)}...`,
        fullToken: token, // Log full token để debug
        payload: {
          sub: payload.sub,
          exp: payload.exp,
          iat: payload.iat,
          roles: payload.roles || payload.authorities,
          role: payload.role, // Check single role field
          scope: payload.scope,
          // Log all payload fields
          allFields: Object.keys(payload)
        },
        isExpired: payload.exp < now,
        expiresIn: Math.round((payload.exp - now) / 60) + ' minutes'
      });
      
      return payload.exp >= now;
    } catch (error) {
      console.error('❌ Token decode error:', error);
      return false;
    }
  }
};

// Test function để debug API connectivity
export const testAdminAPI = async () => {
  console.log('🧪 Testing Admin API connectivity...');
  console.log('Current URL:', window.location.href);
  console.log('API Base URL:', API_BASE_URL);
  
  // Check localStorage and token
  debugUtils.checkLocalStorage();
  const tokenValid = debugUtils.checkTokenValidity();
  
  if (!tokenValid) {
    console.error('❌ Token is invalid or expired, stopping test');
    return;
  }
  
  try {
    // Test basic connectivity
    console.log('1. Testing basic API connectivity...');
    const healthCheck = await apiClient.get('/actuator/health').catch(() => null);
    console.log('Health check result:', healthCheck?.status || 'Failed');
    
    // Test admin endpoints
    console.log('2. Testing admin endpoints...');
    
    // Test each endpoint individually
    const endpoints = [
      '/api/admin/user',
      '/api/admin/online-users',
      '/api/admin/online-users/details'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing ${endpoint}...`);
        const response = await apiClient.get(endpoint);
        console.log(`✅ ${endpoint}: Status ${response.status}, Data status: ${response.data?.status}`);
        
        // Log response data structure
        if (response.data?.data) {
          console.log(`📊 ${endpoint} data structure:`, {
            dataType: Array.isArray(response.data.data) ? 'array' : typeof response.data.data,
            dataLength: Array.isArray(response.data.data) ? response.data.data.length : 'N/A',
            firstItem: Array.isArray(response.data.data) && response.data.data.length > 0 ? 
              Object.keys(response.data.data[0]) : 'N/A'
          });
        }
      } catch (error: any) {
        console.error(`❌ ${endpoint}: ${error.response?.status || error.code} - ${error.message}`);
        if (error.response?.data) {
          console.error(`Response data:`, error.response.data);
        }
      }
    }
    
  } catch (error) {
    console.error('🚨 Test failed:', error);
  }
};

// Admin API - tích hợp với Spring Boot backend
export const adminAPI = {
  // Lấy danh sách tất cả user (chỉ admin)
  getAllUsers: async (): Promise<ListAccountResponse[]> => {
    try {
      const response = await retryApiCall(() => 
        apiClient.get<ResponseDto<ListAccountResponse[]>>('/api/admin/user')
      );
      
      if (response.data.status !== 200) {
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể lấy danh sách người dùng');
        throw new Error(errorMessage);
      }
      
      // Map backend response to frontend interface
      const mappedUsers: ListAccountResponse[] = response.data.data.map((user: any) => {
        // Debug avatar URL từ backend
        console.log('Admin API - Raw user data:', user.username, 'Raw avatarUrl:', user.avatarUrl);
        
        // Build full avatar URL nếu cần
        let fullAvatarUrl = user.avatarUrl;
        if (user.avatarUrl) {
          if (user.avatarUrl.startsWith('http')) {
            // URL đã là full URL (Cloudinary, etc.)
            fullAvatarUrl = user.avatarUrl;
            console.log('Admin API - Using external URL:', fullAvatarUrl);
          } else {
            // Relative path, build với API base URL
            fullAvatarUrl = `${API_BASE_URL}${user.avatarUrl.startsWith('/') ? '' : '/'}${user.avatarUrl}`;
            console.log('Admin API - Built local avatar URL:', fullAvatarUrl);
          }
        } else {
          console.log('Admin API - No avatar URL for user:', user.username);
        }
        
        return {
          id: user.id,
          username: user.username,
          email: user.email || '',
          fullName: user.fullName,
          role: user.role,
          active: user.active,
          avatarUrl: fullAvatarUrl,
          created: user.created, // Map "created" field
          updated: user.updated  // Map "updated" field
        };
      });
      
      return mappedUsers;
    } catch (error: any) {
      console.error('getAllUsers error:', error);
      
      // Xử lý lỗi 500 từ backend
      if (error.response?.status === 500) {
        console.error('Backend Internal Server Error (500):', error.response.data);
        
        // Xử lý cụ thể lỗi Access Denied
        if (error.response.data?.message?.includes('Access Denied')) {
          throw new Error('🚫 Không có quyền truy cập Admin. Vui lòng đăng nhập lại với tài khoản Admin.');
        }
        
        const errorMessage = getErrorMessage(error, 'Lỗi server nội bộ. Vui lòng thử lại sau.');
        throw new Error(errorMessage);
      }
      
      if (error.message && error.message !== 'Không thể lấy danh sách người dùng.') {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error, 'Không thể lấy danh sách người dùng.');
      throw new Error(errorMessage);
    }
  },

  // Lấy số lượng user online hiện tại
  getOnlineUsers: async (): Promise<OnlineUserResponse> => {
    try {
      const response = await retryApiCall(() => 
        apiClient.get<ResponseDto<OnlineUserResponse>>('/api/admin/online-users')
      );
      
      if (response.data.status !== 200) {
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể lấy thông tin user online');
        throw new Error(errorMessage);
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('getOnlineUsers error:', error);
      
      // Xử lý lỗi 500 từ backend
      if (error.response?.status === 500) {
        console.error('Backend Internal Server Error (500) for online users:', error.response.data);
        
        // Xử lý cụ thể lỗi Access Denied
        if (error.response.data?.message?.includes('Access Denied')) {
          throw new Error('🚫 Không có quyền truy cập thông tin user online. Vui lòng đăng nhập lại với tài khoản Admin.');
        }
        
        const errorMessage = getErrorMessage(error, 'Lỗi server khi lấy thông tin user online. Vui lòng thử lại sau.');
        throw new Error(errorMessage);
      }
      
      // Fallback data khi backend không có sẵn
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.warn('Backend không có sẵn, sử dụng mock data');
        return {
          totalOnlineUsers: 0,
          lastUpdated: new Date().toISOString(),
          onlineUsers: []
        };
      }
      
      if (error.message && error.message !== 'Không thể lấy thông tin user online.') {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error, 'Không thể lấy thông tin user online.');
      throw new Error(errorMessage);
    }
  },

  // Lấy thông tin chi tiết user online
  getOnlineUsersDetails: async (): Promise<OnlineUserResponse> => {
    try {
      const response = await retryApiCall(() => 
        apiClient.get<ResponseDto<OnlineUserResponse>>('/api/admin/online-users/details')
      );
      
      if (response.data.status !== 200) {
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể lấy chi tiết user online');
        throw new Error(errorMessage);
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('getOnlineUsersDetails error:', error);
      
      // Xử lý lỗi 500 từ backend
      if (error.response?.status === 500) {
        console.error('Backend Internal Server Error (500) for online users details:', error.response.data);
        
        // Xử lý cụ thể lỗi Access Denied
        if (error.response.data?.message?.includes('Access Denied')) {
          throw new Error('🚫 Không có quyền truy cập chi tiết user online. Vui lòng đăng nhập lại với tài khoản Admin.');
        }
        
        const errorMessage = getErrorMessage(error, 'Lỗi server khi lấy chi tiết user online. Vui lòng thử lại sau.');
        throw new Error(errorMessage);
      }
      
      // Fallback data khi backend không có sẵn
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.response?.status === 404) {
        console.warn('Backend không có sẵn, sử dụng mock data');
        return {
          totalOnlineUsers: 0,
          lastUpdated: new Date().toISOString(),
          onlineUsers: []
        };
      }
      
      if (error.message && error.message !== 'Không thể lấy chi tiết user online.') {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error, 'Không thể lấy chi tiết user online.');
      throw new Error(errorMessage);
    }
  },

  // Block user (chỉ admin)
  blockUser: async (userId: string): Promise<void> => {
    try {
      const response = await apiClient.put<ResponseDto<void>>(`/api/admin/block-user/${userId}`);
      
      if (response.data.status !== 200) {
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể chặn người dùng');
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      if (error.message && error.message !== 'Không thể chặn người dùng.') {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error, 'Không thể chặn người dùng.');
      throw new Error(errorMessage);
    }
  },

  // Active user (chỉ admin)
  activeUser: async (userId: string): Promise<void> => {
    try {
      const response = await apiClient.put<ResponseDto<void>>(`/api/admin/active-user/${userId}`);
      
      if (response.data.status !== 200) {
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể kích hoạt người dùng');
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      if (error.message && error.message !== 'Không thể kích hoạt người dùng.') {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error, 'Không thể kích hoạt người dùng.');
      throw new Error(errorMessage);
    }
  },

  // Lấy avatar URL cho admin
  getAdminAvatar: async (): Promise<string> => {
    try {
      const response = await apiClient.get<ResponseDto<string>>('/api/admin/getAvatar');
      
      if (response.data.status !== 200) {
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể lấy avatar admin');
        throw new Error(errorMessage);
      }
      
      // Build full URL nếu cần
      let avatarUrl = response.data.data;
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        avatarUrl = `${API_BASE_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
      }
      
      return avatarUrl;
    } catch (error: any) {
      if (error.message && error.message !== 'Không thể lấy avatar admin.') {
        throw error;
      }
      
      const errorMessage = getErrorMessage(error, 'Không thể lấy avatar admin.');
      throw new Error(errorMessage);
    }
  }
};

// Chat API - tích hợp với Spring Boot backend
export const chatAPI = {
  sendMessage: async (message: string, userId?: string): Promise<ChatMessage> => {
    try {
      // Lấy user ID từ localStorage hoặc tham số
      // User ID được lưu trong localStorage khi login thành công
      let currentUserId = userId;
      
      if (!currentUserId) {
        // Thử lấy từ localStorage (có thể được lưu khi login)
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
          currentUserId = storedUserId;
        } else {
          // Fallback: lấy từ user info hiện tại
          try {
            const userInfo = await authAPI.getCurrentUser();
            currentUserId = userInfo.id;
          } catch (error) {
            throw new Error('Không thể xác định người dùng hiện tại');
          }
        }
      }

      // Tạo request DTO theo format backend
      const chatRequest: ChatMessageRequestDto = {
        senderId: parseInt(currentUserId),
        message: message.trim()
      };

      // Gọi API backend
      const response = await apiClient.post<ResponseDto<any>>('/api/chat-messages', chatRequest);
      
      // Kiểm tra response status từ backend
      if (response.data.status !== 200) {
        // Tạo error object giống như axios error để getErrorMessage có thể xử lý
        const backendError = {
          response: {
            data: response.data,
            status: response.status
          }
        };
        const errorMessage = getErrorMessage(backendError, 'Không thể gửi tin nhắn');
        throw new Error(errorMessage);
      }
      
      // Xử lý response data khi status === 200 - đảm bảo chỉ lấy string content
      let aiContent = '';
      
      if (typeof response.data.data === 'string') {
        console.log('Response is string:', response.data.data);
        aiContent = response.data.data;
      } else if (response.data.data && typeof response.data.data === 'object') {
        console.log('Response is object, parsing...');
        
        // Xử lý cấu trúc response từ AI API (Google Gemini format)
        if (response.data.data.candidates && Array.isArray(response.data.data.candidates)) {
          console.log('Found candidates array:', response.data.data.candidates);
          const firstCandidate = response.data.data.candidates[0];
          if (firstCandidate && firstCandidate.content && firstCandidate.content.parts && Array.isArray(firstCandidate.content.parts)) {
            const firstPart = firstCandidate.content.parts[0];
            if (firstPart && firstPart.text) {
              aiContent = firstPart.text;
              console.log('Extracted text:', aiContent);
            }
          }
        }
        
        // Fallback: thử lấy các field phổ biến khác
        if (!aiContent) {
          console.log('Trying fallback fields...');
          
          // Xử lý cấu trúc backend thực tế: chatAI có content trực tiếp
          if (response.data.data.chatAI && response.data.data.chatAI.content) {
            if (typeof response.data.data.chatAI.content === 'string') {
              try {
                const parsedContent = JSON.parse(response.data.data.chatAI.content);
                if (parsedContent.candidates && Array.isArray(parsedContent.candidates)) {
                  const firstCandidate = parsedContent.candidates[0];
                  if (firstCandidate && firstCandidate.content && firstCandidate.content.parts && Array.isArray(firstCandidate.content.parts)) {
                    const firstPart = firstCandidate.content.parts[0];
                    if (firstPart && firstPart.text) {
                      aiContent = firstPart.text;
                    }
                  }
                }
              } catch (parseError) {
                aiContent = response.data.data.chatAI.content;
              }
            } else if (typeof response.data.data.chatAI.content === 'object') {
              const contentObj = response.data.data.chatAI.content;
              if (contentObj.candidates && Array.isArray(contentObj.candidates)) {
                const firstCandidate = contentObj.candidates[0];
                if (firstCandidate && firstCandidate.content && firstCandidate.content.parts && Array.isArray(firstCandidate.content.parts)) {
                  const firstPart = firstCandidate.content.parts[0];
                  if (firstPart && firstPart.text) {
                    aiContent = firstPart.text;
                  }
                }
              } else if (contentObj.text) {
                aiContent = contentObj.text;
              } else if (contentObj.message) {
                aiContent = contentObj.message;
              }
            }
          }
          
          // Các fallback khác
          if (!aiContent) {
            aiContent = response.data.data.content || 
                       response.data.data.message || 
                       response.data.data.response ||
                       response.data.data.text ||
                       '';
          }
        }
        
        // Nếu vẫn không có content, hiển thị thông báo lỗi
        if (!aiContent) {
          aiContent = 'Xin lỗi, tôi không thể tạo phản hồi cho câu hỏi này. Vui lòng thử lại.';
        }
      } else {
        console.log('Response is neither string nor object');
        aiContent = `Phản hồi AI cho: "${message}"`;
      }
      
      // Trả về ChatMessage format cho frontend
      return {
        id: Date.now().toString(),
        content: aiContent,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Chat API Error:', error);
      
      // Nếu error đã có message từ backend (từ logic trên), sử dụng trực tiếp
      if (error.message && error.message !== 'Không thể gửi tin nhắn. Vui lòng thử lại sau.') {
        throw error;
      }
      
      // Sử dụng getErrorMessage để xử lý lỗi thống nhất
      const errorMessage = getErrorMessage(error, 'Không thể gửi tin nhắn. Vui lòng thử lại sau.');
      throw new Error(errorMessage);
    }
  }
};
