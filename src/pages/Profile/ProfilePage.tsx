import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Badge,
  Info,
  PhotoCamera
} from '@mui/icons-material';
import { User, UserInformationRequest } from '../../types';
import { profileAPI } from '../../services/api';

interface ProfilePageProps {
  user: User | null;
  onUpdateProfile: (userData: UserInformationRequest) => Promise<void>;
  onUpdateAvatar?: (newAvatarUrl: string) => void; // Callback để cập nhật avatar trong App state
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile, onUpdateAvatar }) => {
  const [isEditing, setIsEditing] = useState(false); // State cho chế độ chỉnh sửa
  const [loading, setLoading] = useState(false); // State cho loading
  const [success, setSuccess] = useState(false); // State cho thông báo thành công
  const [error, setError] = useState(''); // State cho lỗi
  const [uploadingAvatar, setUploadingAvatar] = useState(false); // State cho upload avatar
  
  // Ref cho file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State cho form data - chỉ các field có thể update
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || ''
  });

  // Xử lý thay đổi input
  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  // Xử lý bắt đầu chỉnh sửa
  const handleStartEdit = () => {
    setIsEditing(true);
    setSuccess(false);
    setError('');
  };

  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || '',
      bio: user?.bio || ''
    });
    setError('');
  };

  // Xử lý lưu thông tin
  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý click vào avatar để chọn file
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Validate file trước khi upload
  const validateFile = (file: File): string | null => {
    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)';
    }

    // Kiểm tra kích thước file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Kích thước file không được vượt quá 5MB';
    }

    return null; // File hợp lệ
  };

  // Xử lý khi chọn file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Gọi API upload avatar với file
      const newAvatarUrl = await profileAPI.uploadAvatar(user.id, file);
      
      // Cập nhật avatar trong parent component nếu có callback
      if (onUpdateAvatar) {
        onUpdateAvatar(newAvatarUrl);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Upload avatar thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Vui lòng đăng nhập để xem thông tin hồ sơ.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Quản lý thông tin tài khoản của bạn
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Cập nhật thông tin thành công!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Card */}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Avatar Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user.avatar}
                alt={user.fullName}
                sx={{ 
                  width: 120, 
                  height: 120,
                  border: '4px solid',
                  borderColor: 'primary.main',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }
                }}
                onClick={handleAvatarClick}
              >
                {user.fullName?.charAt(0)}
              </Avatar>
              
              {/* Loading overlay cho upload avatar */}
              {uploadingAvatar && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={30} sx={{ color: 'white' }} />
                </Box>
              )}
              
              {/* Camera icon overlay */}
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <Divider sx={{ mb: 3 }} />

          {/* Profile Information */}
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Họ và tên</Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  variant="outlined"
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body1">
                    {user.fullName || 'Chưa cập nhật'}
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* Email */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Email</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body1" color="text.secondary">
                  {user.email || 'Chưa cập nhật'} (không thể thay đổi)
                </Typography>
              </Paper>
            </Grid>

            {/* Username */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Badge sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Tên đăng nhập</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body1" color="text.secondary">
                  {user.username} (không thể thay đổi)
                </Typography>
              </Paper>
            </Grid>

            {/* Join Date */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Info sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Ngày tham gia</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body1" color="text.secondary">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </Paper>
            </Grid>

            {/* Bio */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Info sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Giới thiệu</Typography>
              </Box>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange('bio')}
                  variant="outlined"
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                />
              ) : (
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  <Typography variant="body1">
                    {user.bio || 'Chưa có thông tin giới thiệu'}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Hủy
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleStartEdit}
                size="large"
              >
                Chỉnh sửa thông tin
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
