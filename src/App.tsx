import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Snackbar, Alert } from '@mui/material';

// Components
import Header from './components/Header/Header';
import LoginDialog from './components/Auth/LoginDialog';
import RegisterDialog from './components/Auth/RegisterDialog';

// Pages
import HomePage from './pages/Home/HomePage';
import TheoryPage from './pages/Theory/TheoryPage';
import ProductionPage from './pages/Production/ProductionPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ChatPage from './pages/Chat/ChatPage';

// Admin App
import AdminApp from './AdminApp';

// Services and Types
import { authAPI, profileAPI } from './services/api';
import { AuthState, RegisterRequest, UserInformationRequest } from './types';

// Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Màu đỏ chủ đạo
      light: '#ff6659',
      dark: '#9a0007',
    },
    secondary: {
      main: '#1976d2', // Màu xanh phụ
      light: '#63a4ff',
      dark: '#004ba0',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Không viết hoa tự động
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const App: React.FC = () => {
  // State quản lý authentication
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  // State quản lý chế độ admin
  const [isAdminMode, setIsAdminMode] = useState(false);

  // State cho dialogs
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  // State cho success notifications
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Kiểm tra authentication khi load app
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Simulate getting user from token
      authAPI.getCurrentUser()
        .then(user => {
          setAuthState({
            isAuthenticated: true,
            user,
            token
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
        });
    }
  }, []);

  // Xử lý đăng nhập
  const handleLogin = async (username: string, password: string) => {
    try {
      const { user, token } = await authAPI.login(username, password);
      
      // Lưu token, email, role và user ID vào localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_id', user.id);
      if (user.role) {
        localStorage.setItem('user_role', user.role);
      }
      
      // Cập nhật state
      setAuthState({
        isAuthenticated: true,
        user,
        token
      });
      
      // Kiểm tra nếu là admin thì chuyển sang admin mode
      if (user.role === 'ADMIN') {
        setIsAdminMode(true);
      }
      
      setLoginDialogOpen(false);
      
      // Chỉ hiển thị thông báo thành công cho user thường, không hiển thị cho admin
      if (user.role !== 'ADMIN') {
        setSuccessMessage(`Chào mừng ${user.fullName || user.username}! Đăng nhập thành công.`);
        setShowSuccessSnackbar(true);
      }
    } catch (error: any) {
      // Ném lại error với message từ API service để LoginDialog hiển thị
      throw error;
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      
      // Xóa tất cả thông tin user khỏi localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_id');
      
      // Reset state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null
      });
      
      // Reset admin mode
      setIsAdminMode(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (registerData: RegisterRequest) => {
    try {
      await authAPI.register(registerData);
      setRegisterDialogOpen(false);
      
      // Hiển thị thông báo thành công
      setSuccessMessage('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
      setShowSuccessSnackbar(true);
    } catch (error: any) {
      // Ném lại error với message từ API service để RegisterDialog hiển thị
      throw error;
    }
  };

  // Xử lý cập nhật profile
  const handleUpdateProfile = async (userData: UserInformationRequest) => {
    try {
      const updatedUser = await profileAPI.updateProfile(userData);
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    } catch (error: any) {
      // Ném lại error với message từ API service
      throw error;
    }
  };

  // Xử lý cập nhật avatar
  const handleUpdateAvatar = (newAvatarUrl: string) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        avatar: newAvatarUrl
      } : null
    }));
  };

  // Xử lý mở login dialog
  const handleOpenLogin = () => {
    setLoginDialogOpen(true);
  };

  // Xử lý đóng login dialog
  const handleCloseLogin = () => {
    setLoginDialogOpen(false);
  };

  // Xử lý mở register dialog
  const handleOpenRegister = () => {
    setRegisterDialogOpen(true);
  };

  // Xử lý đóng register dialog
  const handleCloseRegister = () => {
    setRegisterDialogOpen(false);
  };

  // Xử lý chuyển từ login sang register
  const handleSwitchToRegister = () => {
    setLoginDialogOpen(false);
    setRegisterDialogOpen(true);
  };

  // Xử lý chuyển sang chế độ user
  const handleSwitchToUser = () => {
    setIsAdminMode(false);
  };

  // Xử lý đóng success snackbar
  const handleCloseSuccessSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  // Nếu là admin và đang ở admin mode, hiển thị AdminApp
  if (isAdminMode && authState.isAuthenticated && authState.user?.role === 'ADMIN') {
    return (
      <AdminApp 
        authState={authState}
        onLogout={handleLogout}
        onSwitchToUser={handleSwitchToUser}
      />
    );
  }

  // Hiển thị app thường cho user
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Header */}
          <Header
            isAuthenticated={authState.isAuthenticated}
            user={authState.user}
            onLogin={handleOpenLogin}
            onLogout={handleLogout}
            onRegister={handleOpenRegister}
          />

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/theory" element={<TheoryPage />} />
              <Route path="/production" element={<ProductionPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProfilePage 
                    user={authState.user}
                    onUpdateProfile={handleUpdateProfile}
                    onUpdateAvatar={handleUpdateAvatar}
                  />
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ChatPage 
                    user={authState.user}
                    isAuthenticated={authState.isAuthenticated}
                  />
                } 
              />
              {/* Redirect admin routes to user interface */}
              <Route path="/admin" element={<HomePage />} />
            </Routes>
          </Box>

          {/* Login Dialog */}
          <LoginDialog
            open={loginDialogOpen}
            onClose={handleCloseLogin}
            onLogin={handleLogin}
            onOpenRegister={handleSwitchToRegister}
          />

          {/* Register Dialog */}
          <RegisterDialog
            open={registerDialogOpen}
            onClose={handleCloseRegister}
            onRegister={handleRegister}
          />

          {/* Success Notification Snackbar */}
          <Snackbar
            open={showSuccessSnackbar}
            autoHideDuration={4000}
            onClose={handleCloseSuccessSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSuccessSnackbar} 
              severity="success" 
              sx={{ width: '100%' }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
