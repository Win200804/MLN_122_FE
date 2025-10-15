import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

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

  // State cho dialogs
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

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
      
      setLoginDialogOpen(false);
    } catch (error) {
      throw new Error('Login failed');
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
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (registerData: RegisterRequest) => {
    try {
      await authAPI.register(registerData);
      setRegisterDialogOpen(false);
      // Có thể hiển thị thông báo thành công ở đây
    } catch (error) {
      throw error; // Để RegisterDialog xử lý error
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
    } catch (error) {
      throw new Error('Profile update failed');
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
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
