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
  ChatMessageRequestDto
} from '../types';

// Cấu hình base URL - thay đổi theo môi trường
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Thêm Authorization header
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
      
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
      console.warn('Request interceptor - No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Helper function để chuyển đổi UserInformationResponse thành User
const mapUserInformationToUser = (userInfo: UserInformationResponse, email?: string, role?: string): User => {
  return {
    id: userInfo.accountId,
    username: userInfo.username,
    email: email || '', // Email không có trong UserInformationResponse
    fullName: userInfo.fullName,
    avatar: userInfo.avatarUrl,
    bio: userInfo.bio,
    role: role,
    createdAt: userInfo.createdAt,
  };
};

// Auth API
export const authAPI = {
  // Đăng ký tài khoản mới
  register: async (registerData: RegisterRequest): Promise<string> => {
    try {
      const response = await apiClient.post<ResponseDto<string>>('/api/auth/register', registerData);
      
      if (response.data.status === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Đăng ký thất bại. Vui lòng thử lại.');
    }
  },

  // Đăng nhập
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    try {
      const loginRequest: LoginRequest = { username, password };
      const response = await apiClient.post<ResponseDto<AccountResponse>>('/api/auth/login', loginRequest);
      
      if (response.data.status === 200) {
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
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
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
      
      if (response.data.status === 200) {
        // Lấy email và role từ localStorage nếu có
        const savedEmail = localStorage.getItem('user_email');
        const savedRole = localStorage.getItem('user_role');
        
        return mapUserInformationToUser(response.data.data, savedEmail || undefined, savedRole || undefined);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Không thể lấy thông tin người dùng.');
    }
  }
};

// Profile API
export const profileAPI = {
  updateProfile: async (userData: UserInformationRequest): Promise<User> => {
    try {
      const response = await apiClient.put<ResponseDto<UserInformationResponse>>('/api/user-info', userData);
      
      if (response.data.status === 200) {
        // Lấy email và role từ localStorage
        const savedEmail = localStorage.getItem('user_email');
        const savedRole = localStorage.getItem('user_role');
        
        return mapUserInformationToUser(response.data.data, savedEmail || undefined, savedRole || undefined);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Cập nhật thông tin thất bại. Vui lòng thử lại.');
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

      if (response.data.status === 201) {
        return response.data.data; // Trả về URL avatar mới
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 403) {
        throw new Error('Không có quyền upload avatar. Vui lòng đăng nhập lại.');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy endpoint upload avatar.');
      }
      
      if (error.response?.status === 413) {
        throw new Error('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      }
      
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || 'Upload avatar thất bại. Vui lòng thử lại.');
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
      
      if (response.data.status === 200) {
        // Xử lý response data - đảm bảo chỉ lấy string content
        
        // Xử lý response data - đảm bảo chỉ lấy string content
        let aiContent = '';
        
        if (typeof response.data.data === 'string') {
          console.log('Response is string:', response.data.data);
          aiContent = response.data.data;
        } else if (response.data.data && typeof response.data.data === 'object') {
          console.log('Response is object, parsing...');
          
          // Xử lý cấu trúc response từ AI API (Google Gemini format)
          if (response.data.data.candidates && Array.isArray(response.data.data.candidates)) {
            console.log('Found candidates array:', response.data.data.candidates);
            // Lấy text từ candidates[0].content.parts[0].text
            const firstCandidate = response.data.data.candidates[0];
            console.log('First candidate:', firstCandidate);
            
            if (firstCandidate && firstCandidate.content && firstCandidate.content.parts && Array.isArray(firstCandidate.content.parts)) {
              const firstPart = firstCandidate.content.parts[0];
              console.log('First part:', firstPart);
              
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
            if (response.data.data.chatAI) {
              console.log('Found chatAI object:', response.data.data.chatAI);
              console.log('chatAI keys:', Object.keys(response.data.data.chatAI));
              console.log('chatAI.content type:', typeof response.data.data.chatAI.content);
              console.log('chatAI.content value:', response.data.data.chatAI.content);
              
              // Kiểm tra chatAI.content - có thể là string hoặc object
              if (response.data.data.chatAI.content) {
                if (typeof response.data.data.chatAI.content === 'string') {
                  // Nếu content là string, thử parse JSON trước
                  try {
                    const parsedContent = JSON.parse(response.data.data.chatAI.content);
                    console.log('Parsed JSON from chatAI.content:', parsedContent);
                    
                    // Nếu parse thành công, xử lý như object
                    if (parsedContent.candidates && Array.isArray(parsedContent.candidates)) {
                      const firstCandidate = parsedContent.candidates[0];
                      if (firstCandidate && firstCandidate.content && firstCandidate.content.parts && Array.isArray(firstCandidate.content.parts)) {
                        const firstPart = firstCandidate.content.parts[0];
                        if (firstPart && firstPart.text) {
                          aiContent = firstPart.text;
                          console.log('Successfully extracted text from parsed JSON:', aiContent);
                        }
                      }
                    }
                  } catch (parseError) {
                    // Nếu không parse được JSON, sử dụng string trực tiếp
                    aiContent = response.data.data.chatAI.content;
                    console.log('Using raw string from chatAI.content:', aiContent);
                  }
                } else if (typeof response.data.data.chatAI.content === 'object') {
                  // Nếu content là object, thử parse theo các cấu trúc có thể
                  const contentObj = response.data.data.chatAI.content;
                  console.log('chatAI.content object keys:', Object.keys(contentObj));
                  
                  // Thử lấy từ candidates nếu có
                  if (contentObj.candidates && Array.isArray(contentObj.candidates)) {
                    const firstCandidate = contentObj.candidates[0];
                    if (firstCandidate && firstCandidate.content && firstCandidate.content.parts && Array.isArray(firstCandidate.content.parts)) {
                      const firstPart = firstCandidate.content.parts[0];
                      if (firstPart && firstPart.text) {
                        aiContent = firstPart.text;
                        console.log('Successfully extracted text from chatAI.content.candidates:', aiContent);
                      }
                    }
                  }
                  // Thử lấy từ text field trực tiếp
                  else if (contentObj.text) {
                    aiContent = contentObj.text;
                    console.log('Successfully extracted text from chatAI.content.text:', aiContent);
                  }
                  // Thử lấy từ message field
                  else if (contentObj.message) {
                    aiContent = contentObj.message;
                    console.log('Successfully extracted text from chatAI.content.message:', aiContent);
                  }
                }
              }
            }
            
            // Thử parse theo cấu trúc khác có thể có
            if (!aiContent && response.data.data.content && response.data.data.content.parts && Array.isArray(response.data.data.content.parts)) {
              const firstPart = response.data.data.content.parts[0];
              if (firstPart && firstPart.text) {
                aiContent = firstPart.text;
                console.log('Found text in content.parts:', aiContent);
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
            
            console.log('Fallback result:', aiContent);
          }
          
          // Nếu vẫn không có content, hiển thị thông báo lỗi thay vì JSON
          if (!aiContent) {
            console.log('No content found, using default message');
            aiContent = 'Xin lỗi, tôi không thể tạo phản hồi cho câu hỏi này. Vui lòng thử lại.';
          }
        } else {
          console.log('Response is neither string nor object');
          aiContent = `Phản hồi AI cho: "${message}"`;
        }
        
        // Đã extract thành công AI content
        
        // Trả về ChatMessage format cho frontend
        return {
          id: Date.now().toString(),
          content: aiContent,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.data.message || 'Lỗi từ server');
      }
    } catch (error: any) {
      console.error('Chat API Error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Fallback error message
      throw new Error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
    }
  }
};
