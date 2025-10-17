import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Factory,
  Group,
  TrendingUp,
  AccountBalance,
  Build,
  Person,
  AttachMoney,
  Timeline
} from '@mui/icons-material';

const ProductionPage: React.FC = () => {
  // Dữ liệu về quá trình sản xuất
  const productionSteps = [
    {
      label: 'Lực lượng Sản xuất',
      description: 'Con người và công cụ lao động',
      details: [
        'Người lao động với kỹ năng và kinh nghiệm',
        'Máy móc, thiết bị, công nghệ',
        'Nguyên liệu, vật liệu đầu vào',
        'Kiến thức khoa học và kỹ thuật'
      ]
    },
    {
      label: 'Quan hệ Sản xuất',
      description: 'Mối quan hệ giữa các chủ thể trong sản xuất',
      details: [
        'Quan hệ sở hữu tư liệu sản xuất',
        'Quan hệ phân phối sản phẩm',
        'Quan hệ trao đổi và tiêu dùng',
        'Vị thế của các giai cấp xã hội'
      ]
    },
    {
      label: 'Quá trình Sản xuất',
      description: 'Biến đổi nguyên liệu thành sản phẩm',
      details: [
        'Đầu vào: Nguyên liệu + Lao động + Tư liệu sản xuất',
        'Quá trình: Lao động tác động lên đối tượng lao động',
        'Đầu ra: Sản phẩm có giá trị sử dụng',
        'Tạo ra giá trị mới thông qua lao động'
      ]
    },
    {
      label: 'Phân phối Sản phẩm',
      description: 'Chia sẻ kết quả sản xuất',
      details: [
        'Tiền lương cho người lao động',
        'Lợi nhuận cho chủ tư bản',
        'Thuế cho nhà nước',
        'Tái đầu tư cho sản xuất tiếp theo'
      ]
    }
  ];

  // Dữ liệu về các yếu tố sản xuất
  const productionFactors = [
    {
      title: 'Tư liệu Sản xuất',
      icon: <Build sx={{ fontSize: 40 }} />,
      color: 'primary',
      items: [
        'Máy móc, thiết bị',
        'Nhà xưởng, kho bãi',
        'Công nghệ, bằng sáng chế',
        'Hệ thống thông tin'
      ]
    },
    {
      title: 'Lực lượng Lao động',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: 'secondary',
      items: [
        'Kỹ năng chuyên môn',
        'Kinh nghiệm làm việc',
        'Sức khỏe thể chất',
        'Trình độ học vấn'
      ]
    },
    {
      title: 'Đối tượng Lao động',
      icon: <Factory sx={{ fontSize: 40 }} />,
      color: 'success',
      items: [
        'Nguyên liệu thô',
        'Vật liệu bán thành phẩm',
        'Tài nguyên thiên nhiên',
        'Thông tin, dữ liệu'
      ]
    },
    {
      title: 'Tư bản',
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: 'warning',
      items: [
        'Tư bản cố định',
        'Tư bản lưu động',
        'Tư bản tiền tệ',
        'Tư bản hàng hóa'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Sản xuất Hàng hóa
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Quá trình sản xuất và các mối quan hệ sản xuất trong xã hội tư bản chủ nghĩa
        </Typography>
      </Box>

      {/* Quote */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: 'primary.light',
          color: 'white'
        }}
      >
        <Typography variant="h6" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
          "Trong quá trình sản xuất, con người không chỉ tác động lên thiên nhiên, 
          mà còn tác động lên nhau. Họ chỉ sản xuất được khi cộng tác với nhau 
          theo một cách thức nhất định và cùng nhau trao đổi hoạt động của mình."
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'right', mt: 2, fontWeight: 'bold' }}>
          - Karl Marx
        </Typography>
      </Paper>

      {/* Production Factors */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Các yếu tố Sản xuất
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {productionFactors.map((factor, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: `${factor.color}.main` }}>
                    {factor.icon}
                  </Avatar>
                }
                title={factor.title}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <List dense>
                  {factor.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex}>
                      <ListItemIcon>
                        <Timeline sx={{ color: `${factor.color}.main` }} />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Production Process */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Quá trình Sản xuất
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stepper orientation="vertical">
          {productionSteps.map((step, index) => (
            <Step key={index} active={true}>
              <StepLabel>
                <Typography variant="h6" color="primary">
                  {step.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <List dense>
                  {step.details.map((detail, detailIndex) => (
                    <ListItem key={detailIndex}>
                      <ListItemIcon>
                        <Group sx={{ color: 'secondary.main', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={detail} />
                    </ListItem>
                  ))}
                </List>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Key Concepts */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Khái niệm Quan trọng
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <TrendingUp />
                  </Avatar>
                }
                title="Giá trị Thặng dư"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Phần giá trị mà người lao động tạo ra vượt quá giá trị của sức lao động. 
                  Đây là nguồn gốc của lợi nhuận tư bản.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ví dụ: Công nhân làm 8 tiếng, nhưng chỉ cần 4 tiếng để tạo ra giá trị 
                  bằng tiền lương. 4 tiếng còn lại tạo ra giá trị thặng dư.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <AccountBalance />
                  </Avatar>
                }
                title="Tích lũy Tư bản"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Quá trình biến một phần giá trị thặng dư thành tư bản mới để 
                  mở rộng quy mô sản xuất.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tư bản gia tăng → Mở rộng sản xuất → Tạo thêm giá trị thặng dư → 
                  Tích lũy tiếp tục.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductionPage;
