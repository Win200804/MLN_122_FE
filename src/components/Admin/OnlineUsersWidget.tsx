import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import {
  People as PeopleIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Circle as CircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { OnlineUserResponse, OnlineUserDetail } from '../../types';
import { adminAPI } from '../../services/api';
import webSocketService from '../../services/websocket';

interface OnlineUsersWidgetProps {
  className?: string;
}

const OnlineUsersWidget: React.FC<OnlineUsersWidgetProps> = ({ className }) => {
  // State management
  const [onlineData, setOnlineData] = useState<OnlineUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [retryCount, setRetryCount] = useState(0);

  // Load initial data
  useEffect(() => {
    loadOnlineUsers();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    // Set up WebSocket callbacks
    webSocketService.setOnlineCountCallback((data: OnlineUserResponse) => {
      console.log('WebSocket online count update:', data);
      setOnlineData(prevData => ({
        ...data,
        onlineUsers: prevData?.onlineUsers || data.onlineUsers
      }));
      setLastRefresh(new Date());
    });

    webSocketService.setOnlineDetailsCallback((data: OnlineUserResponse) => {
      console.log('WebSocket online details update:', data);
      setOnlineData(data);
      setLastRefresh(new Date());
    });

    webSocketService.setConnectionStatusCallback((connected: boolean) => {
      setWsConnected(connected);
      if (connected) {
        console.log('WebSocket connected, requesting initial data');
        // Request initial data when connected
        setTimeout(() => {
          webSocketService.refreshOnlineCount();
        }, 500);
      }
    });

    // Connect WebSocket
    webSocketService.connect();

    // Cleanup on unmount
    return () => {
      webSocketService.clearCallbacks();
      webSocketService.disconnect();
    };
  }, []);

  // Load online users data
  const loadOnlineUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setRetryCount(0);
      
      const data = await adminAPI.getOnlineUsers();
      setOnlineData(data);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error('Error loading online users:', err);
      
      // Hiển thị thông báo retry nếu có
      if (err.message?.includes('attempt')) {
        setRetryCount(prev => prev + 1);
      }
      
      // Nếu là lỗi Access Denied
      if (err.message?.includes('Không có quyền truy cập')) {
        setError('🚫 Phiên đăng nhập đã hết hạn hoặc không có quyền Admin. Sẽ tự động đăng xuất...');
        // Auto logout sau 3 giây
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_role');
          window.location.href = '/';
        }, 3000);
      }
      // Nếu là lỗi 500, hiển thị thông báo cụ thể
      else if (err.message?.includes('Lỗi server')) {
        setError('⚠️ Server đang gặp sự cố. Đã thử kết nối lại nhưng vẫn lỗi. Vui lòng thử lại sau.');
      }
      // Nếu là lỗi network, hiển thị thông báo nhẹ nhàng hơn
      else if (err.message?.includes('Backend không có sẵn')) {
        setError('Backend đang offline. Hiển thị dữ liệu mặc định.');
        setOnlineData({
          totalOnlineUsers: 0,
          lastUpdated: new Date().toISOString(),
          onlineUsers: []
        });
      } else {
        setError(err.message || 'Không thể tải dữ liệu user online');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load detailed online users data
  const loadOnlineUsersDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      setRetryCount(0);
      
      const data = await adminAPI.getOnlineUsersDetails();
      setOnlineData(data);
      setLastRefresh(new Date());
      setShowDetails(true);
    } catch (err: any) {
      console.error('Error loading online users details:', err);
      
      // Hiển thị thông báo retry nếu có
      if (err.message?.includes('attempt')) {
        setRetryCount(prev => prev + 1);
      }
      
      // Nếu là lỗi Access Denied
      if (err.message?.includes('Không có quyền truy cập')) {
        setError('🚫 Phiên đăng nhập đã hết hạn hoặc không có quyền Admin. Sẽ tự động đăng xuất...');
        // Auto logout sau 3 giây
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_role');
          window.location.href = '/';
        }, 3000);
      }
      // Nếu là lỗi 500, hiển thị thông báo cụ thể
      else if (err.message?.includes('Lỗi server')) {
        setError('⚠️ Server đang gặp sự cố khi lấy chi tiết. Đã thử kết nối lại nhưng vẫn lỗi. Vui lòng thử lại sau.');
      }
      // Nếu là lỗi network, hiển thị thông báo nhẹ nhàng hơn
      else if (err.message?.includes('Backend không có sẵn')) {
        setError('Backend đang offline. Hiển thị dữ liệu mặc định.');
        setOnlineData({
          totalOnlineUsers: 0,
          lastUpdated: new Date().toISOString(),
          onlineUsers: []
        });
        setShowDetails(true);
      } else {
        setError(err.message || 'Không thể tải chi tiết user online');
      }
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    if (wsConnected) {
      // Use WebSocket for refresh if connected
      if (showDetails) {
        webSocketService.requestOnlineDetails();
      } else {
        webSocketService.refreshOnlineCount();
      }
    } else {
      // Fallback to REST API
      if (showDetails) {
        loadOnlineUsersDetails();
      } else {
        loadOnlineUsers();
      }
    }
  };

  // Toggle details view
  const handleToggleDetails = () => {
    if (!showDetails) {
      loadOnlineUsersDetails();
    } else {
      setShowDetails(false);
      loadOnlineUsers();
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  // Format date
  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  // Chip trạng thái: luôn hiển thị Online và dùng màu xanh dương (secondary)

  if (loading && !onlineData) {
    return (
      <Card className={className}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              icon={<CircleIcon sx={{ 
                color: '#4caf50',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                  '50%': {
                    opacity: 0.6,
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                }
              }} />} 
              label="Online"
              sx={{
                backgroundColor: 'white !important',
                color: '#4caf50 !important',
                fontWeight: 600,
                border: '2px solid #4caf50 !important',
                '& .MuiChip-icon': {
                  color: '#4caf50 !important',
                },
                '&.MuiChip-root': {
                  border: '2px solid #4caf50 !important',
                },
                '& .MuiChip-root': {
                  border: '2px solid #4caf50 !important',
                }
              }}
              size="small"
            />
            
            {/* WebSocket Connection Status */}
            <Tooltip title={wsConnected ? 'WebSocket kết nối' : 'WebSocket ngắt kết nối'}>
              <Chip 
                icon={<CircleIcon />}
                label="WS"
                size="small"
                color={wsConnected ? 'success' : 'default'}
                variant={wsConnected ? 'filled' : 'outlined'}
                sx={{ 
                  fontSize: '0.75rem',
                  height: '24px',
                  '& .MuiChip-icon': {
                    fontSize: '12px'
                  }
                }}
              />
            </Tooltip>
          </Box>
          
          <Box display="flex" gap={1}>
            <Tooltip title={showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}>
              <IconButton onClick={handleToggleDetails} disabled={loading}>
                {showDetails ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Làm mới">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert 
            severity={
              error.includes('Backend đang offline') ? 'warning' : 
              error.includes('Server đang gặp sự cố') ? 'warning' : 'error'
            } 
            sx={{ mb: 2 }}
            action={
              error.includes('Server đang gặp sự cố') && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={showDetails ? loadOnlineUsersDetails : loadOnlineUsers}
                  disabled={loading}
                >
                  Thử lại
                </Button>
              )
            }
          >
            {error}
            {error.includes('Backend đang offline') && (
              <Box sx={{ mt: 1, fontSize: '0.875rem', opacity: 0.8 }}>
                💡 Tip: Đảm bảo Spring Boot backend đang chạy trên port 8080
              </Box>
            )}
            {retryCount > 0 && (
              <Box sx={{ mt: 1, fontSize: '0.875rem', opacity: 0.8 }}>
                🔄 Đã thử {retryCount} lần
              </Box>
            )}
          </Alert>
        )}

        {/* Main Content */}
        {onlineData && (
          <>
            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Box 
                  textAlign="center" 
                  p={3} 
                  bgcolor="#4caf50" 
                  color="white" 
                  borderRadius={2}
                  sx={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    animation: 'pulse-bg 3s ease-in-out infinite alternate',
                    '@keyframes pulse-bg': {
                      from: {
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                      },
                      to: {
                        boxShadow: '0 8px 30px rgba(76, 175, 80, 0.5)',
                      },
                    },
                  }}
                >
                  <Typography variant="h2" component="div" fontWeight="bold">
                    {onlineData.totalOnlineUsers}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    User đang online
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  textAlign="center" 
                  p={3} 
                  bgcolor="grey.50" 
                  borderRadius={2}
                  border="1px solid"
                  borderColor="grey.200"
                >
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                    <AccessTimeIcon fontSize="small" color="primary" />
                    <Typography variant="body1" fontWeight="medium">
                      Cập nhật lần cuối
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {formatTime(lastRefresh.toISOString())}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Detailed View */}
            {showDetails && onlineData.onlineUsers && (
              <>
                <Typography variant="h6" gutterBottom>
                  Chi tiết User Online ({onlineData.onlineUsers.length})
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thời gian login</TableCell>
                        <TableCell>Hoạt động cuối</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {onlineData.onlineUsers.map((user: OnlineUserDetail) => (
                        <TableRow key={user.accountId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {user.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.accountId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              size="small" 
                              color={user.role === 'ADMIN' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<CircleIcon />}
                              label={'Online'}
                              color="secondary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDateTime(user.loginTime)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDateTime(user.lastActivity)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {/* Simple View */}
            {!showDetails && (
              <Box textAlign="center" py={2}>
                <Typography variant="body1" color="text.secondary">
                  Click vào biểu tượng mắt để xem chi tiết user online
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={handleToggleDetails}
                  sx={{ mt: 1 }}
                  disabled={loading}
                >
                  Xem chi tiết
                </Button>
              </Box>
            )}
          </>
        )}

        {/* Loading Overlay */}
        {loading && onlineData && (
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bgcolor="rgba(255, 255, 255, 0.7)"
            zIndex={1}
          >
            <CircularProgress size={24} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineUsersWidget;
