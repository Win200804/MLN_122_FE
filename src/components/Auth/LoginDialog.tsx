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
  Login as LoginIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<void>;
  onOpenRegister?: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin, onOpenRegister }) => {
  const [username, setUsername] = useState(''); // State cho username
  const [password, setPassword] = useState(''); // State cho password
  const [loading, setLoading] = useState(false); // State cho loading
  const [error, setError] = useState(''); // State cho error message
  const [showPassword, setShowPassword] = useState(false); // State cho hiển thị password

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onLogin(username, password);
      // Reset form sau khi login thành công
      setUsername('');
      setPassword('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đóng dialog
  const handleClose = () => {
    if (!loading) {
      setUsername('');
      setPassword('');
      setError('');
      setShowPassword(false);
      onClose();
    }
  };

  // Xử lý chuyển sang register
  const handleOpenRegister = () => {
    handleClose();
    if (onOpenRegister) {
      onOpenRegister();
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
        <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" component="div">
          Đăng nhập
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Đăng nhập để truy cập đầy đủ tính năng
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
            
            <TextField
              autoFocus
              margin="dense"
              label="Tên đăng nhập"
              type="text"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            
            <TextField
              margin="dense"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
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

            {onOpenRegister && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Chưa có tài khoản?{' '}
                  <Button 
                    variant="text" 
                    size="small" 
                    onClick={handleOpenRegister}
                    disabled={loading}
                    sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                  >
                    Đăng ký ngay
                  </Button>
                </Typography>
              </Box>
            )}
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
