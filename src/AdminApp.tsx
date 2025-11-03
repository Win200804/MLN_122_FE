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

// Tạo theme riêng cho Admin theo tone màu nội thất
const adminTheme = createTheme({
  palette: {
    primary: {
      main: '#D2784D',
      light: '#D19F5D',
      dark: '#555555',
    },
    secondary: {
      main: '#6C91B7',
      light: '#93AECA',
      dark: '#456C92',
    },
    background: {
      default: '#EAE2DF',
    },
    text: {
      primary: '#555555',
    }
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
          <Box component="main" sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #EAE2DF 0%, #CFB79D 35%, #D19F5D 65%, #D2784D 100%)' }}>
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
