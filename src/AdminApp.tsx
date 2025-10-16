import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Snackbar, Alert } from '@mui/material';

// Admin Components
import AdminHeader from './components/Admin/AdminHeader';

// Admin Pages
import AdminPage from './pages/Admin/AdminPage';

// Services and Types
import { authAPI } from './services/api';
import { AuthState } from './types';

// Tạo theme riêng cho Admin
const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Màu xanh chủ đạo cho admin
      light: '#63a4ff',
      dark: '#004ba0',
    },
    secondary: {
      main: '#ff9800', // Màu cam phụ
      light: '#ffc947',
      dark: '#c66900',
    },
    background: {
      default: '#f8f9fa',
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
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

interface AdminAppProps {
  authState: AuthState;
  onLogout: () => void;
  onSwitchToUser: () => void;
}

const AdminApp: React.FC<AdminAppProps> = ({ authState, onLogout, onSwitchToUser }) => {
  // State cho success notifications
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!authState.isAuthenticated || !authState.user) {
      onSwitchToUser();
      return;
    }
    
    if (authState.user.role !== 'ADMIN') {
      onSwitchToUser();
      return;
    }
  }, [authState, onSwitchToUser]);

  // Xử lý đóng success snackbar
  const handleCloseSuccessSnackbar = () => {
    setShowSuccessSnackbar(false);
  };

  // Nếu không phải admin, không render gì
  if (!authState.isAuthenticated || !authState.user || authState.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Admin Header */}
          <AdminHeader
            user={authState.user}
            onLogout={onLogout}
          />

          {/* Main Admin Content */}
          <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
            <Routes>
              {/* Default route to admin dashboard */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="/admin" element={<AdminPage user={authState.user} />} />
              {/* Catch all other routes and redirect to admin */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Box>

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

export default AdminApp;
