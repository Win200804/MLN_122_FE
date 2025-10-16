import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  Breadcrumbs,
  Link,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  AdminPanelSettings as AdminIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { User, ListAccountResponse } from '../../types';
import { adminAPI } from '../../services/api';
import OnlineUsersWidget from '../../components/Admin/OnlineUsersWidget';

interface AdminPageProps {
  user: User | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState<ListAccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: 'block' | 'activate' | null;
    user: ListAccountResponse | null;
  }>({
    open: false,
    action: null,
    user: null
  });

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    loadUsers();
  }, [user, navigate]);

  // Load all users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usersData = await adminAPI.getAllUsers();
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error loading users:', err);
      
      // Xử lý lỗi cụ thể
      if (err.message?.includes('Không có quyền truy cập Admin')) {
        setError('🚫 Phiên đăng nhập đã hết hạn hoặc không có quyền Admin. Vui lòng đăng nhập lại.');
        // Auto logout sau 3 giây
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          localStorage.removeItem('user_role');
          window.location.href = '/';
        }, 3000);
      } else if (err.message?.includes('Lỗi server nội bộ')) {
        setError('⚠️ Server đang gặp sự cố khi tải danh sách người dùng. Hệ thống đã thử kết nối lại nhưng vẫn lỗi. Vui lòng thử lại sau vài phút.');
      } else {
        setError(err.message || 'Không thể tải danh sách người dùng');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle user action (block/activate)
  const handleUserAction = async (userId: string, action: 'block' | 'activate') => {
    try {
      setActionLoading(userId);
      
      if (action === 'block') {
        await adminAPI.blockUser(userId);
      } else {
        await adminAPI.activeUser(userId);
      }
      
      // Reload users list
      await loadUsers();
      
      // Close confirm dialog
      setConfirmDialog({ open: false, action: null, user: null });
    } catch (err: any) {
      console.error(`Error ${action} user:`, err);
      setError(err.message || `Không thể ${action === 'block' ? 'chặn' : 'kích hoạt'} người dùng`);
    } finally {
      setActionLoading(null);
    }
  };

  // Open confirmation dialog
  const openConfirmDialog = (user: ListAccountResponse, action: 'block' | 'activate') => {
    setConfirmDialog({
      open: true,
      action,
      user
    });
  };

  // Close confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, action: null, user: null });
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  // Get user status - active = true nghĩa là không bị block
  const getUserStatus = (active: boolean) => {
    return active ? 'Hoạt động' : 'Bị chặn';
  };

  // Get status color - active = true nghĩa là không bị block
  const getStatusColor = (active: boolean) => {
    return active ? 'success' : 'error';
  };

  // Count statistics - active = true nghĩa là không bị block
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.active).length; // active = true = không bị block
  const blockedUsers = users.filter(u => !u.active).length; // active = false = bị block
  const adminUsers = users.filter(u => u.role === 'ADMIN').length;

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Bạn không có quyền truy cập trang này.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="/" 
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="inherit" />
          Trang chủ
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AdminIcon fontSize="inherit" />
          Admin Dashboard
        </Box>
      </Breadcrumbs>

      {/* Page Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <DashboardIcon color="primary" fontSize="large" />
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quản lý hệ thống và theo dõi người dùng
          </Typography>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert 
          severity={error.includes('Server đang gặp sự cố') ? 'warning' : 'error'} 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
          action={
            <Box display="flex" gap={1}>
              {error.includes('Server đang gặp sự cố') && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={loadUsers}
                  disabled={loading}
                >
                  Thử lại
                </Button>
              )}
            </Box>
          }
        >
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <PeopleIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    {totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng số user
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircleIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    {activeUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User hoạt động
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <BlockIcon color="error" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    {blockedUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User bị chặn
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <AdminIcon color="warning" fontSize="large" />
                <Box>
                  <Typography variant="h4" component="div">
                    {adminUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Admin
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Online Users Widget */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <OnlineUsersWidget />
        </Grid>
      </Grid>

      {/* Users Management Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Quản lý Người dùng
            </Typography>
            <Button 
              variant="outlined" 
              onClick={loadUsers}
              disabled={loading}
            >
              Làm mới
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="center">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((userData) => (
                    <TableRow key={userData.id}>
                      <TableCell>
                        {userData.avatarUrl ? (
                          <Box
                            component="img"
                            src={userData.avatarUrl}
                            alt={userData.fullName}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1px solid #e0e0e0'
                            }}
                            onError={(e) => {
                              console.error('Image failed to load for:', userData.username);
                              // Fallback to Avatar with initials
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40,
                            display: userData.avatarUrl ? 'none' : 'flex',
                            bgcolor: 'primary.main'
                          }}
                        >
                          {userData.fullName?.charAt(0) || userData.username?.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {userData.username}
                        </Typography>
                      </TableCell>
                      <TableCell>{userData.fullName}</TableCell>
                      <TableCell>
                        <Chip 
                          label={userData.role} 
                          size="small" 
                          color={userData.role === 'ADMIN' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getUserStatus(userData.active)}
                          color={getStatusColor(userData.active)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(userData.created)}</TableCell>
                      <TableCell align="center">
                        {userData.role !== 'ADMIN' && (
                          <Box display="flex" gap={1} justifyContent="center">
                            {userData.active ? (
                              // active = true nghĩa là user đang hoạt động, có thể chặn
                              <Tooltip title="Chặn người dùng">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => openConfirmDialog(userData, 'block')}
                                  disabled={actionLoading === userData.id}
                                >
                                  {actionLoading === userData.id ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <BlockIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            ) : (
                              // active = false nghĩa là user bị chặn, có thể kích hoạt lại
                              <Tooltip title="Kích hoạt người dùng">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() => openConfirmDialog(userData, 'activate')}
                                  disabled={actionLoading === userData.id}
                                >
                                  {actionLoading === userData.id ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <CheckCircleIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                        {userData.role === 'ADMIN' && (
                          <Chip 
                            icon={<WarningIcon />}
                            label="Không thể thao tác" 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={closeConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Xác nhận {confirmDialog.action === 'block' ? 'chặn' : 'kích hoạt'} người dùng
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Bạn có chắc chắn muốn {confirmDialog.action === 'block' ? 'chặn' : 'kích hoạt'} người dùng{' '}
            <strong>{confirmDialog.user?.username}</strong> không?
            {confirmDialog.action === 'block' && (
              <Box sx={{ mt: 1, color: 'error.main' }}>
                ⚠️ Người dùng sẽ bị đăng xuất và không thể đăng nhập lại (active = false).
              </Box>
            )}
            {confirmDialog.action === 'activate' && (
              <Box sx={{ mt: 1, color: 'success.main' }}>
                ✅ Người dùng sẽ có thể đăng nhập lại (active = true).
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (confirmDialog.user && confirmDialog.action) {
                handleUserAction(confirmDialog.user.id, confirmDialog.action);
              }
            }}
            color={confirmDialog.action === 'block' ? 'error' : 'success'}
            variant="contained"
            disabled={!!actionLoading}
          >
            {confirmDialog.action === 'block' ? 'Chặn' : 'Kích hoạt'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
