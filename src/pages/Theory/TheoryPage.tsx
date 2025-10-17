import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ExpandMore,
  Circle,
  TrendingUp,
  SwapHoriz,
  AccountBalance
} from '@mui/icons-material';

const TheoryPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1'); // State cho accordion

  // Xử lý thay đổi accordion
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Dữ liệu nội dung lý thuyết
  const theoryContent = [
    {
      id: 'panel1',
      title: 'Khái niệm Hàng hóa',
      category: 'Cơ bản',
      icon: <Circle />,
      content: {
        definition: 'Hàng hóa là sản phẩm lao động được sản xuất ra không phải để tự tiêu dùng mà để trao đổi.',
        keyPoints: [
          'Hàng hóa phải là sản phẩm của lao động con người',
          'Hàng hóa được sản xuất để trao đổi, không phải để tự tiêu dùng',
          'Hàng hóa có hai thuộc tính cơ bản: giá trị sử dụng và giá trị trao đổi',
          'Hàng hóa xuất hiện khi có sự phân công lao động xã hội'
        ],
        examples: [
          'Một chiếc áo được may để bán tại cửa hàng',
          'Gạo được nông dân sản xuất để đem ra chợ',
          'Phần mềm được phát triển để bán cho khách hàng'
        ]
      }
    },
    {
      id: 'panel2',
      title: 'Giá trị Sử dụng và Giá trị Trao đổi',
      category: 'Cơ bản',
      icon: <SwapHoriz />,
      content: {
        definition: 'Mỗi hàng hóa đều có hai mặt: giá trị sử dụng (tính hữu ích) và giá trị trao đổi (khả năng đổi lấy hàng hóa khác).',
        keyPoints: [
          'Giá trị sử dụng: Khả năng thỏa mãn nhu cầu nào đó của con người',
          'Giá trị trao đổi: Tỷ lệ mà hàng hóa này có thể trao đổi với hàng hóa khác',
          'Giá trị sử dụng là cơ sở vật chất của giá trị trao đổi',
          'Không có giá trị sử dụng thì không thể có giá trị trao đổi'
        ],
        examples: [
          'Chiếc điện thoại: Giá trị sử dụng là liên lạc, giải trí; Giá trị trao đổi là 10 triệu đồng',
          'Cuốn sách: Giá trị sử dụng là tri thức; Giá trị trao đổi là 100.000 đồng',
          'Kg gạo: Giá trị sử dụng là dinh dưỡng; Giá trị trao đổi là 25.000 đồng'
        ]
      }
    },
    {
      id: 'panel3',
      title: 'Lao động Trừu tượng và Lao động Cụ thể',
      category: 'Nâng cao',
      icon: <TrendingUp />,
      content: {
        definition: 'Lao động tạo ra hàng hóa có hai mặt: lao động cụ thể tạo ra giá trị sử dụng, lao động trừu tượng tạo ra giá trị.',
        keyPoints: [
          'Lao động cụ thể: Lao động với tính chất cụ thể, tạo ra giá trị sử dụng',
          'Lao động trừu tượng: Lao động xét về mặt tiêu hao sức lao động nói chung',
          'Lao động trừu tượng là cơ sở của giá trị hàng hóa',
          'Thời gian lao động xã hội cần thiết quyết định độ lớn giá trị'
        ],
        examples: [
          'Thợ may áo (lao động cụ thể) và tiêu hao sức lao động (lao động trừu tượng)',
          'Nông dân trồng lúa (cụ thể) và thời gian lao động bỏ ra (trừu tượng)',
          'Lập trình viên code (cụ thể) và giờ công lao động (trừu tượng)'
        ]
      }
    },
    {
      id: 'panel4',
      title: 'Tiền tệ và Hình thái Giá trị',
      category: 'Nâng cao',
      icon: <AccountBalance />,
      content: {
        definition: 'Tiền tệ là hàng hóa đặc biệt đóng vai trò đo lường giá trị của tất cả hàng hóa khác.',
        keyPoints: [
          'Hình thái giá trị đơn giản: A = B (1 con cừu = 20 kg lúa)',
          'Hình thái giá trị mở rộng: A = B, C, D... (1 con cừu = 20kg lúa = 2 cái rìu...)',
          'Hình thái giá trị chung: A, B, C = D (tất cả hàng hóa đều biểu hiện giá trị qua 1 hàng hóa)',
          'Hình thái tiền tệ: Vàng, bạc trở thành đương lượng chung'
        ],
        examples: [
          'Thời kỳ đầu: Đổi trực tiếp hàng lấy hàng',
          'Sau này: Dùng vàng, bạc làm tiền',
          'Hiện tại: Tiền giấy, tiền điện tử'
        ]
      }
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
          Lý thuyết về Hàng hóa
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Những khái niệm cơ bản trong tư tưởng kinh tế của Karl Marx
        </Typography>
      </Box>

      {/* Theory Content */}
      <Box sx={{ mb: 4 }}>
        {theoryContent.map((section) => (
          <Accordion
            key={section.id}
            expanded={expanded === section.id}
            onChange={handleChange(section.id)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
              sx={{ 
                backgroundColor: expanded === section.id ? 'primary.light' : 'grey.50',
                '&:hover': { backgroundColor: 'primary.light' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>
                  {section.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3">
                    {section.title}
                  </Typography>
                </Box>
                <Chip 
                  label={section.category} 
                  size="small" 
                  color={section.category === 'Cơ bản' ? 'primary' : 'secondary'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Card variant="outlined">
                <CardContent>
                  {/* Definition */}
                  <Typography variant="h6" gutterBottom color="primary">
                    Định nghĩa:
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', pl: 2 }}>
                    {section.content.definition}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Key Points */}
                  <Typography variant="h6" gutterBottom color="primary">
                    Điểm chính:
                  </Typography>
                  <List dense>
                    {section.content.keyPoints.map((point, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                        </ListItemIcon>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  {/* Examples */}
                  <Typography variant="h6" gutterBottom color="primary">
                    Ví dụ:
                  </Typography>
                  <List dense>
                    {section.content.examples.map((example, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Circle sx={{ fontSize: 8, color: 'secondary.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={example}
                          sx={{ '& .MuiListItemText-primary': { fontStyle: 'italic' } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default TheoryPage;
