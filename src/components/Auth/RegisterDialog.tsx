import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  PersonAdd as RegisterIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { RegisterRequest } from '../../types';

interface RegisterDialogProps {
  open: boolean;
  onClose: () => void;
  onRegister: (registerData: RegisterRequest) => Promise<void>;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ open, onClose, onRegister }) => {
  // State cho form data
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State cho UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho validation errors
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  // Xử lý thay đổi input
  const handleInputChange = (field: keyof RegisterRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Xóa error của field khi user bắt đầu nhập
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation form
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    // Validate username
    if (!formData.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 6) {
      errors.username = 'Tên đăng nhập phải có từ 6 ký tự trở lên';
    }

    // Validate fullName
    if (!formData.fullName.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Địa chỉ email không hợp lệ';
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      errors.password = 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onRegister(formData);
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      
      // Reset form sau 2 giây
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      // Hiển thị error message từ API hoặc fallback message
      const errorMessage = err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      
      // Nếu là lỗi validation từ backend, có thể xử lý thêm
      if (err.message?.includes('đã tồn tại') || err.message?.includes('already exists')) {
        // Có thể highlight field tương ứng
        console.log('Validation error detected:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đóng dialog
  const handleClose = () => {
    if (!loading) {
      setFormData({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
      setSuccess('');
      setFieldErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <RegisterIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" component="div">
          Đăng ký tài khoản
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tạo tài khoản mới để truy cập đầy đủ tính năng
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert 
                severity="error"
                sx={{ 
                  mb: 1,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                    lineHeight: 1.4
                  }
                }}
              >
                {error}
              </Alert>
            )}

            {success && (
              <Alert 
                severity="success"
                sx={{ 
                  mb: 1,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                    lineHeight: 1.4
                  }
                }}
              >
                {success}
              </Alert>
            )}
            
            <TextField
              autoFocus
              margin="dense"
              label="Tên đăng nhập"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.username}
              onChange={handleInputChange('username')}
              disabled={loading}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
              required
            />

            <TextField
              margin="dense"
              label="Họ và tên"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              disabled={loading}
              error={!!fieldErrors.fullName}
              helperText={fieldErrors.fullName}
              required
            />

            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={loading}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              required
            />
            
            <TextField
              margin="dense"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={loading}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="dense"
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              disabled={loading}
              error={!!fieldErrors.confirmPassword}
              helperText={fieldErrors.confirmPassword}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            color="inherit"
          >
            Hủy
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading || !!success}
            startIcon={loading ? <CircularProgress size={20} /> : <RegisterIcon />}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegisterDialog;

