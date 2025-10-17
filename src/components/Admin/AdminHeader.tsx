import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ExitToApp,
  Dashboard as DashboardIcon,
  AdminPanelSettings,
  Home as HomeIcon,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { adminAPI } from '../../services/api';

interface AdminHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [adminAvatar, setAdminAvatar] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Load admin avatar khi component mount
  useEffect(() => {
    const loadAdminAvatar = async () => {
      try {
        const avatarUrl = await adminAPI.getAdminAvatar();
        setAdminAvatar(avatarUrl);
      } catch (error) {
        console.error('Failed to load admin avatar:', error);
        setAdminAvatar(''); // Fallback to initials
      }
    };

    loadAdminAvatar();
  }, []);

  // Xử lý mở menu user
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Xử lý logout
  const handleLogout = () => {
    handleMenuClose();
    onLogout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
        {/* Logo và tiêu đề admin */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <AdminPanelSettings sx={{ fontSize: '2rem', color: 'white' }} />
          <Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.4rem',
                color: 'white',
                lineHeight: 1.2
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.85rem'
              }}
            >
              Hệ thống quản lý Marx Theory App
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', gap: 1, mr: 3 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Dashboard
          </Button>
        </Box>

        {/* User section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
              {user?.fullName || user?.username}
            </Typography>
            <Chip 
              label="ADMIN" 
              size="small" 
              sx={{ 
                backgroundColor: '#ff9800',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem'
              }} 
            />
          </Box>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="admin-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
            sx={{ p: 0.5 }}
          >
            {adminAvatar ? (
              <Box
                component="img"
                src={adminAvatar}
                alt={user?.fullName || user?.username}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                  }
                }}
                onError={() => {
                  console.error('Admin avatar failed to load');
                  setAdminAvatar(''); // Fallback to Avatar with initials
                }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  bgcolor: 'secondary.main',
                  '&:hover': {
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                  }
                }}
              >
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || <AccountCircle />}
              </Avatar>
            )}
          </IconButton>
          
          <Menu
            id="admin-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;