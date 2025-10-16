import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ExitToApp,
  Chat,
  Home,
  Book,
  Factory,
  PersonAdd,
  AccountCircle,
  Person as PersonIcon,
  ArrowDropDown
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
  
  // State cho user menu dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // Xác định tab hiện tại dựa trên đường dẫn
  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/theory') return 1;
    if (path === '/production') return 2;
    if (path === '/chat') return 3;
    // Nếu đang ở trang profile hoặc trang khác, không highlight tab nào
    if (path === '/profile') return false;
    return 0; // Default về trang chủ
  };

  // Xử lý thay đổi tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const routes = ['/', '/theory', '/production', '/chat'];
    navigate(routes[newValue]);
  };

  // Xử lý logout
  const handleLogout = () => {
    setAnchorEl(null); // Đóng menu trước khi logout
    onLogout();
  };

  // Xử lý mở user menu
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng user menu
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Xử lý chuyển đến trang profile
  const handleProfileClick = () => {
    setAnchorEl(null);
    navigate('/profile');
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
              {/* User Avatar */}
              <Avatar
                src={user?.avatar}
                alt={user?.fullName || user?.username}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1,
                  bgcolor: 'secondary.main'
                }}
              >
                {(user?.fullName || user?.username)?.charAt(0)}
              </Avatar>
              
              {/* User Menu Button */}
              <Button
                color="inherit"
                onClick={handleUserMenuClick}
                endIcon={<ArrowDropDown />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {user?.fullName || user?.username}
              </Button>

              {/* User Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Hồ sơ cá nhân</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToApp fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
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
