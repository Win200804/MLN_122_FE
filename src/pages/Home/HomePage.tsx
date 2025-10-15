import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Paper
} from '@mui/material';
import {
  Book,
  Factory,
  TrendingUp,
  Psychology
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  // Dữ liệu các card giới thiệu
  const introCards = [
    {
      icon: <Book sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Lý thuyết Hàng hóa',
      description: 'Tìm hiểu về khái niệm hàng hóa, giá trị sử dụng và giá trị trao đổi trong tư tưởng Marx',
      action: () => navigate('/theory')
    },
    {
      icon: <Factory sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Sản xuất Hàng hóa',
      description: 'Khám phá quá trình sản xuất hàng hóa và mối quan hệ sản xuất trong xã hội tư bản',
      action: () => navigate('/production')
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Giá trị Thặng dư',
      description: 'Hiểu về nguồn gốc của lợi nhuận và cách thức tích lũy tư bản',
      action: () => navigate('/theory')
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Chat với AI',
      description: 'Thảo luận và đặt câu hỏi về lý thuyết Marx với trợ lý AI thông minh',
      action: () => navigate('/chat')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #d32f2f, #f57c00)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Lý luận Marx về Hàng hóa
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}
        >
          Khám phá những tư tưởng cơ bản của Karl Marx về hàng hóa, 
          sản xuất và mối quan hệ kinh tế trong xã hội tư bản chủ nghĩa
        </Typography>
      </Box>

      {/* Quote Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 6, 
          backgroundColor: '#f5f5f5',
          borderLeft: '5px solid #d32f2f'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontStyle: 'italic',
            textAlign: 'center',
            color: 'text.primary'
          }}
        >
          "Hàng hóa, trước hết, là một vật bên ngoài, một vật bằng các tính chất của nó 
          thỏa mãn những nhu cầu nào đó của con người."
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'right', 
            mt: 2,
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          - Karl Marx, Tư bản, Tập I
        </Typography>
      </Paper>

      {/* Cards Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {introCards.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={card.action}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {card.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    card.action();
                  }}
                >
                  Tìm hiểu thêm
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* About Section */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Về ứng dụng này
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}
        >
          Ứng dụng này được thiết kế để giúp sinh viên và những người quan tâm 
          hiểu rõ hơn về lý thuyết kinh tế chính trị của Karl Marx, đặc biệt là 
          những khái niệm cơ bản về hàng hóa, giá trị và quá trình sản xuất. 
          Thông qua giao diện thân thiện và tính năng chat AI, bạn có thể 
          học tập một cách hiệu quả và tương tác.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
