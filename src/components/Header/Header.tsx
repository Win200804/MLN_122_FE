import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box,
  IconButton
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Chat,
  Home,
  Book,
  Factory,
  PersonAdd
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onLogin, onLogout, onRegister }) => {
  const navigate = useNavigate(); // Hook để điều hướng
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State cho menu dropdown

  // Xác định tab hiện tại dựa trên đường dẫn
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/theory') return 1;
    if (path === '/production') return 2;
    if (path === '/chat') return 3;
    return 0;
  };

  // Xử lý thay đổi tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const routes = ['/', '/theory', '/production', '/chat'];
    navigate(routes[newValue]);
  };

  // Xử lý mở menu user
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Xử lý chuyển đến trang profile
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  // Xử lý logout
  const handleLogout = () => {
    onLogout();
    handleMenuClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#d32f2f' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
        {/* Logo và tiêu đề - Flex 1 */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.4rem',
              color: 'white'
            }}
          >
            Lý luận Marx về Hàng hóa
          </Typography>
        </Box>

        {/* Navigation Tabs - Flex 2 (chiếm không gian chính ở giữa) */}
        <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={getCurrentTab()}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ 
              '& .MuiTab-root': { 
                color: 'white',
                minWidth: 140,
                fontSize: '0.95rem',
                fontWeight: 500,
                padding: '12px 16px'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'white',
                height: 3
              }
            }}
          >
            <Tab 
              icon={<Home />} 
              label="TRANG CHỦ" 
              iconPosition="start"
            />
            <Tab 
              icon={<Book />} 
              label="LÝ THUYẾT" 
              iconPosition="start"
            />
            <Tab 
              icon={<Factory />} 
              label="SẢN XUẤT" 
              iconPosition="start"
            />
            <Tab 
              icon={<Chat />} 
              label="CHAT AI" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* User section - Flex 1 */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
                Xin chào, {user?.fullName || user?.username}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar 
                  src={user?.avatar} 
                  alt={user?.fullName}
                  sx={{ width: 36, height: 36 }}
                >
                  {user?.fullName?.charAt(0) || <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
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
                <MenuItem onClick={handleProfile}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Hồ sơ cá nhân
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={onLogin}
                startIcon={<AccountCircle />}
                sx={{ 
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  padding: '8px 16px'
                }}
              >
                Đăng nhập
              </Button>
              <Button 
                color="inherit" 
                onClick={onRegister}
                startIcon={<PersonAdd />}
                variant="outlined"
                sx={{ 
                  borderColor: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  padding: '8px 16px',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Đăng ký
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
