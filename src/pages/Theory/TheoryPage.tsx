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
  ListItemText,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import {
  ExpandMore,
  Circle,
  TrendingUp,
  SwapHoriz,
  AccountBalance,
  Image as ImageIcon
} from '@mui/icons-material';

const TheoryPage: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('panel1'); // State cho accordion

  // Xử lý thay đổi accordion
  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Dữ liệu nội dung lý thuyết với hình ảnh và ví dụ cụ thể
  const theoryContent = [
    {
      id: 'panel1',
      title: 'Khái niệm và Thuộc tính của Hàng hóa',
      category: 'Cơ bản',
      icon: <Circle />,
      image: '/assets/images/goods-overview.jpg',
      content: {
        definition: 'Hàng hóa là sản phẩm của lao động, có thể thỏa mãn nhu cầu nào đó của con người thông qua trao đổi, mua bán. Sản phẩm của lao động là hàng hóa khi được đưa ra nhằm mục đích trao đổi, mua bán trên thị trường. Hàng hóa có thể ở dạng vật thể hoặc phi vật thể.',
        subsections: [
          {
            title: 'Giá trị sử dụng của hàng hóa',
            description: 'Giá trị sử dụng của hàng hóa là công dụng của sản phẩm, có thể thỏa mãn nhu cầu nào đó của con người. Nhu cầu đó có thể là nhu cầu vật chất hoặc nhu cầu tinh thần; có thể là nhu cầu cho tiêu dùng cá nhân, có thể là nhu cầu cho sản xuất.',
            details: [
              'Giá trị sử dụng chỉ được thực hiện trong việc sử dụng hay tiêu dùng',
              'Nền sản xuất càng phát triển, khoa học - công nghệ càng hiện đại, càng giúp con người phát hiện thêm các giá trị sử dụng của sản phẩm',
              'Giá trị sử dụng của hàng hóa là giá trị sử dụng nhằm đáp ứng yêu cầu của người mua',
              'Người sản xuất phải chú ý hoàn thiện giá trị sử dụng của hàng hóa do mình sản xuất ra sao cho ngày càng đáp ứng nhu cầu khắt khe và tinh tế hơn của người mua'
            ],
            examples: [
              'Chiếc điện thoại: Giá trị sử dụng là liên lạc, truy cập internet, giải trí, chụp ảnh',
              'Cuốn sách giáo khoa: Giá trị sử dụng là cung cấp tri thức, hỗ trợ học tập',
              'Kg gạo: Giá trị sử dụng là cung cấp dinh dưỡng, thỏa mãn nhu cầu ăn uống',
              'Dịch vụ tư vấn: Giá trị sử dụng là cung cấp kiến thức chuyên môn, giải pháp cho vấn đề'
            ]
          },
          {
            title: 'Giá trị của hàng hóa',
            description: 'Để nhận biết được thuộc tính giá trị của hàng hóa, cần xét trong mối quan hệ trao đổi. Ví dụ, có một quan hệ trao đổi: xA = yB. Ở đây, số lượng X đơn vị hàng hóa A được trao đổi lấy số lượng y đơn vị hàng hóa B. Tỷ lệ trao đổi giữa các giá trị sử dụng khác nhau này được gọi là giá trị trao đổi.',
            details: [
              'Các hàng hóa trao đổi được với nhau vì giữa chúng có một điểm chung: đều là sản phẩm của lao động',
              'Một lượng lao động bằng nhau đã hao phí để tạo ra số lượng các giá trị sử dụng trong quan hệ trao đổi đó',
              'Giá trị là lao động xã hội của người sản xuất hàng hóa kết tinh trong hàng hóa',
              'Giá trị hàng hóa biểu hiện mối quan hệ kinh tế giữa những người sản xuất, trao đổi hàng hóa và là phạm trù có tính lịch sử',
              'Giá trị trao đổi là hình thức biểu hiện ra bên ngoài của giá trị; giá trị là nội dung, là cơ sở của trao đổi'
            ],
            examples: [
              'Ví dụ trao đổi: 1 con gà = 10 kg gạo. Điều này có nghĩa là lượng lao động để nuôi 1 con gà bằng lượng lao động để trồng 10 kg gạo',
              'Giá trị của một chiếc áo được đo bằng thời gian lao động xã hội cần thiết để may ra chiếc áo đó',
              'Khi trao đổi, người ta ngầm so sánh lao động đã hao phí ẩn giấu trong hàng hóa với nhau'
            ]
          }
        ],
        keyPoints: [
          'Hàng hóa phải là sản phẩm của lao động con người',
          'Hàng hóa được sản xuất để trao đổi, không phải để tự tiêu dùng',
          'Hàng hóa có hai thuộc tính cơ bản: giá trị sử dụng và giá trị',
          'Hàng hóa có thể ở dạng vật thể hoặc phi vật thể'
        ],
        examples: [
          'Hàng hóa vật thể: Áo quần, thực phẩm, điện thoại, xe máy',
          'Hàng hóa phi vật thể: Dịch vụ tư vấn, phần mềm, bản quyền, dịch vụ giáo dục',
          'Hàng hóa cá nhân: Khi được một người tiêu dùng rồi thì người khác không thể dùng được nữa (kem, áo quần)',
          'Hàng hóa công cộng: Khi một người dùng rồi, những người khác vẫn còn dùng được (bầu không khí trong sạch, quốc phòng)'
        ]
      }
    },
    {
      id: 'panel2',
      title: 'Giá trị Sử dụng và Giá trị Trao đổi',
      category: 'Cơ bản',
      icon: <SwapHoriz />,
      image: '/assets/images/trao-doi.jpg',
      content: {
        definition: 'Mỗi hàng hóa đều có hai mặt: giá trị sử dụng (tính hữu ích) và giá trị trao đổi (khả năng đổi lấy hàng hóa khác).',
        subsections: [
          {
            title: 'Giá trị sử dụng',
            description: 'Khả năng thỏa mãn nhu cầu của con người; chỉ được thực hiện trong sử dụng/tiêu dùng.',
            details: [
              'Thay đổi theo trình độ công nghệ và văn hóa',
              'Tồn tại khách quan ở sản phẩm, không phụ thuộc giá cả',
              'Là cơ sở vật chất của trao đổi'
            ],
            examples: [
              'Điện thoại: liên lạc, làm việc, giải trí',
              'Phần mềm: tự động hóa quy trình'
            ]
          },
          {
            title: 'Giá trị trao đổi',
            description: 'Tỷ lệ mà tại đó một hàng hóa trao đổi với hàng hóa khác; hình thức biểu hiện ra bên ngoài của giá trị.',
            details: [
              'Quy định bởi thời gian lao động xã hội cần thiết',
              'Bị tác động bởi cung - cầu, cạnh tranh, giá trị tiền'
            ],
            examples: [
              '1 áo = 2 kg cà phê (tại thời điểm/địa điểm cụ thể)',
              'Điện thoại đời cũ giảm giá khi đời mới ra'
            ]
          }
        ],
        keyPoints: [
          'Giá trị sử dụng: tính hữu ích, thực hiện khi tiêu dùng',
          'Giá trị trao đổi: quan hệ tỷ lệ giữa hàng hóa',
          'Không có giá trị sử dụng thì không thể có giá trị trao đổi'
        ],
        examples: [
          'Điện thoại: hữu ích cao → giá trị trao đổi lớn',
          'Sách hiếm: hữu ích cho nhóm nhỏ nhưng giá trao đổi cao'
        ]
      }
    },
    {
      id: 'panel3',
      title: 'Tính hai mặt của Lao động sản xuất Hàng hóa',
      category: 'Nâng cao',
      icon: <TrendingUp />,
      image: '/assets/images/tinh_2_mat.jpg',
      content: {
        definition: 'Cùng một hoạt động lao động nhưng có hai mặt: lao động cụ thể tạo ra giá trị sử dụng; lao động trừu tượng tạo ra giá trị.',
        subsections: [
          {
            title: 'Lao động cụ thể',
            description: 'Lao động có ích dưới hình thức nghề nghiệp nhất định (mục đích, đối tượng, công cụ, phương pháp, kết quả riêng).',
            details: [
              'Tạo ra giá trị sử dụng',
              'Phản ánh tính tư nhân của người sản xuất',
              'Đa dạng theo phân công lao động'
            ],
            examples: [
              'Thợ may may áo; thợ mộc đóng bàn',
              'Nông dân trồng lúa; kỹ sư thiết kế mạch'
            ]
          },
          {
            title: 'Lao động trừu tượng',
            description: 'Hao phí sức lao động nói chung, không xét hình thức cụ thể.',
            details: [
              'Tạo ra giá trị của hàng hóa',
              'So sánh và trao đổi các giá trị sử dụng khác nhau',
              'Quyết định bởi thời gian lao động xã hội cần thiết'
            ],
            examples: [
              'Giờ công để sản xuất 1 áo = giá trị chiếc áo',
              'Hai sản phẩm khác trao đổi được khi hao phí lao động xã hội bằng nhau'
            ]
          },
          {
            title: 'Mâu thuẫn và hệ quả',
            description: 'Sản phẩm lệch nhu cầu xã hội hoặc hao phí cá biệt > mức xã hội → khó bán, khủng hoảng tiềm ẩn.',
            details: [
              'Giảm hao phí cá biệt bằng tối ưu quy trình/công nghệ',
              'Nghiên cứu nhu cầu để đảm bảo phù hợp thị trường'
            ],
            examples: [
              'Mẫu mã lỗi thời khó bán dù chi phí cao',
              'Tối ưu công nghệ rút ngắn thời gian lao động'
            ]
          }
        ],
        keyPoints: [
          'Cụ thể → giá trị sử dụng; trừu tượng → giá trị',
          'Tư nhân (cụ thể) và xã hội (trừu tượng) thống nhất',
          'Mâu thuẫn xuất hiện khi lệch nhu cầu/hao phí cá biệt cao'
        ],
        examples: [
          'Dev viết tính năng (cụ thể) → giờ công (trừu tượng)',
          'Nông dân trồng lúa (cụ thể) → thời gian lao động (trừu tượng)'
        ]
      }
    },
    {
      id: 'panel4',
      title: 'Tiền tệ: nguồn gốc và chức năng',
      category: 'Nâng cao',
      icon: <AccountBalance />,
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=400&fit=crop',
      content: {
        definition: 'Tiền là hàng hóa đặc biệt, kết quả phát triển của sản xuất và trao đổi; là đương lượng chung và hình thái biểu hiện giá trị.',
        subsections: [
          {
            title: 'Từ hình thái giá trị → tiền tệ',
            description: 'Giản đơn/ngẫu nhiên → đầy đủ/mở rộng → chung → tiền tệ (vàng/bạc → tiền tín dụng/điện tử).'
          },
          {
            title: 'Chức năng của tiền',
            description: '5 chức năng trong lưu thông hàng hóa.',
            details: [
              'Thước đo giá trị: biểu hiện giá trị bằng tiền (giá cả)',
              'Phương tiện lưu thông: môi giới trao đổi',
              'Phương tiện cất trữ: dự trữ giá trị',
              'Phương tiện thanh toán: trả nợ, tín dụng',
              'Tiền tệ thế giới: thanh toán quốc tế'
            ]
          }
        ],
        keyPoints: [
          'Giá cả là hình thức tiền tệ của giá trị',
          'Giá cả biến động do giá trị, giá trị tiền, cung - cầu'
        ],
        examples: [
          'Thanh toán không tiền mặt: thẻ, ví điện tử',
          'Tiền số: phương tiện thanh toán theo quy ước'
        ]
      }
    },

    {
      id: 'panel5',
      title: 'Dịch vụ và Quan hệ trao đổi ngày nay',
      category: 'Mở rộng',
      icon: <ImageIcon />,
      image: '/assets/images/trao_doi_dv.jpg',
      content: {
        definition: 'Dịch vụ là hàng hóa vô hình; một số yếu tố phái sinh (quyền sử dụng đất, thương hiệu, chứng khoán) có giá cả, trao đổi được nhưng không tạo giá trị theo cách của hàng hóa thông thường.',
        subsections: [
          { title: 'Dịch vụ', description: 'Sản xuất và tiêu dùng đồng thời; giá trị do lao động dịch vụ tạo.', details: ['Logistics, giáo dục, y tế, SaaS', 'Vai trò tăng mạnh nhờ công nghệ'] },
          { title: 'Quyền sử dụng đất', description: 'Giá cả chịu ảnh hưởng cung - cầu, khan hiếm, đô thị hóa.', details: ['Thực chất chuyển giao quyền dùng', 'Tiền trong giao dịch là phương tiện thanh toán'] },
          { title: 'Thương hiệu & nhân sự tài năng', description: 'Giá cao do kỳ vọng lợi ích, khan hiếm.', details: ['Dựa trên hàng hóa/dịch vụ thực', 'Chuyển nhượng là mua sức lao động với kỳ vọng doanh thu'] },
          { title: 'Chứng khoán, chứng quyền', description: 'Phái sinh gắn với chủ thể sản xuất thực.', details: ['Không thể làm giàu toàn xã hội chỉ bằng mua bán chứng khoán', 'Cần nền sản xuất thực làm cơ sở'] }
        ],
        keyPoints: [
          'Phân biệt giá trị (lao động kết tinh) với của cải/tiền',
          'Yếu tố phái sinh có giá cả nhưng không tạo giá trị như hàng hóa vật thể',
          'Dịch vụ: hàng hóa vô hình, sản xuất-tiêu dùng đồng thời'
        ],
        examples: [
          'Thu phí bản quyền phần mềm',
          'Giá đất tăng do quy hoạch/khan hiếm'
        ]
      }
    }
    ,
    // Nội dung bổ sung theo yêu cầu: Đất đai có phải là hàng hóa?
    {
      id: 'panel6',
      title: 'Đất đai có phải là hàng hóa không?',
      category: 'Mở rộng',
      icon: <ImageIcon />,
      image: '/assets/images/dat_dai.jpg',
      content: {
        definition: 'Theo lý luận Mác, để là hàng hóa, vật đó phải do lao động tạo ra. Bản thân đất là sản phẩm tự nhiên nên không phải hàng hóa; con người không “sản xuất” ra đất, mà chỉ khai thác, cải tạo, sử dụng. Tuy nhiên, quyền sử dụng đất do lao động xã hội xác lập và quản lý lại trở thành một hàng hóa đặc biệt.',
        subsections: [
          {
            title: 'Kết luận chính',
            description: 'Phân biệt đất tự nhiên và quyền sử dụng đất.',
            details: [
              'Đất (tự nhiên) không do lao động tạo ra → không phải hàng hóa',
              'Quyền sử dụng đất mang đủ hai thuộc tính hàng hóa: giá trị sử dụng (khả năng khai thác, canh tác, xây dựng) và giá trị trao đổi (mua bán, cho thuê, chuyển nhượng)'
            ],
            examples: [
              'Giá quyền sử dụng đất được định giá bằng tiền và giao dịch trên thị trường',
              'Cho thuê đất thu lợi như tài sản'
            ]
          }
        ],
        table: {
          columns: ['Yếu tố', 'Là hàng hóa?', 'Giải thích'],
          rows: [
            ['Đất (tự nhiên)', 'Không', 'Không do lao động tạo ra'],
            ['Quyền sử dụng đất', 'Có', 'Có giá trị và có thể trao đổi']
          ]
        },
        keyPoints: [
          'Đất tự nhiên không phải hàng hóa theo nghĩa mác-xít',
          'Quyền sử dụng đất là hàng hóa đặc biệt với đầy đủ hai thuộc tính'
        ],
        examples: [
          'Mua bán/cho thuê/ chuyển nhượng quyền sử dụng đất'
        ]
      }
    },

    // Nội dung bổ sung: Dịch vụ – hàng hóa vô hình và một số hàng hóa đặc biệt
    {
      id: 'panel7',
      title: 'Dịch vụ – Một loại hàng hóa vô hình',
      category: 'Mở rộng',
      icon: <ImageIcon />,
      image: '/assets/images/dich_vu.jpg',
      content: {
        definition: 'Mọi sản phẩm của lao động nếu thỏa mãn nhu cầu thông qua trao đổi đều là hàng hóa, không bắt buộc phải “sờ thấy”. Dịch vụ (dạy học, khám bệnh, vận chuyển, biểu diễn nghệ thuật, phần mềm như dịch vụ...) không tạo vật chất cụ thể nhưng vẫn có giá trị sử dụng và giá trị do hao phí sức lao động xã hội.',
        subsections: [
          {
            title: 'Thuộc tính của dịch vụ',
            details: [
              'Có giá trị sử dụng: giúp người khác đạt mục tiêu, thỏa mãn nhu cầu',
              'Có giá trị: do hao phí sức lao động xã hội (bác sĩ, giáo viên, tài xế...)',
              'Sản xuất và tiêu dùng diễn ra đồng thời, không cất trữ được'
            ],
            examples: [
              'Cắt tóc: bạn mua lao động và kỹ năng của thợ; có giá trị sử dụng và giá trị',
              'Tư vấn pháp lý, bảo trì phần mềm, logistics'
            ]
          }
        ],
        table: {
          columns: ['Loại hàng hóa đặc biệt', 'Vì sao được xem là hàng hóa', 'Đặc điểm'],
          rows: [
            ['Quyền sử dụng đất đai', 'Quyền khai thác/sử dụng/chuyển nhượng do lao động xã hội xác lập', 'Có giá trị trao đổi; mua – bán – thuê – cho thuê'],
            ['Thương hiệu (danh tiếng)', 'Giá trị tinh thần, uy tín hình thành từ lao động tập thể và chất lượng sản phẩm', 'Vô hình nhưng có giá trị kinh tế lớn'],
            ['Chứng khoán, chứng quyền, giấy tờ có giá', 'Công cụ tài chính đại diện cho giá trị và quyền lợi', 'Giá biến động theo cung – cầu, cạnh tranh']
          ]
        },
        keyPoints: [
          'Hàng hóa có hai thuộc tính phản ánh lao động xã hội',
          'Sản xuất hàng hóa gắn với phân công lao động',
          'Dịch vụ và hàng hóa đặc biệt mở rộng khái niệm từ vật chất sang phi vật chất'
        ],
        examples: [
          'Mua vé xem biểu diễn (dịch vụ), chuyển nhượng thương hiệu, mua cổ phiếu'
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
                backgroundColor: 'grey.50',
                '&:hover': { backgroundColor: 'grey.100' },
                '&.Mui-expanded': { backgroundColor: 'grey.100' }
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
                  variant="outlined"
                  color={section.category === 'Cơ bản' ? 'primary' : (section.category === 'Nâng cao' ? 'secondary' : 'default')}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Card variant="outlined">
                <CardContent>
                  {/* Image */}
                  {section.image && (
                    <Paper elevation={1} sx={{ overflow: 'hidden', borderRadius: 2, mb: 3 }}>
                      <Box sx={{ width: '100%' }}>
                        <img
                          src={(section as any).image}
                          alt={section.title}
                          loading="lazy"
                          style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', maxHeight: 440, margin: '0 auto' }}
                        />
                      </Box>
                    </Paper>
                  )}

                  {/* Definition */}
                  <Typography variant="h6" gutterBottom color="primary">
                    Định nghĩa:
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', pl: 2 }}>
                    {section.content.definition}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Subsections */}
                  {(section as any).content.subsections && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Phân tích chi tiết:
                      </Typography>
                      <Grid container spacing={2}>
                        {(section as any).content.subsections.map((sub: any, idx: number) => (
                          <Grid item xs={12} md={6} key={idx}>
                            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                {sub.title}
                              </Typography>
                              {sub.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {sub.description}
                                </Typography>
                              )}
                              {sub.details && sub.details.length > 0 && (
                                <List dense>
                                  {sub.details.map((d: string, i: number) => (
                                    <ListItem key={i}>
                                      <ListItemIcon>
                                        <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                                      </ListItemIcon>
                                      <ListItemText primary={d} />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                              {sub.examples && sub.examples.length > 0 && (
                                <>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    Ví dụ:
                                  </Typography>
                                  <List dense>
                                    {sub.examples.map((ex: string, i: number) => (
                                      <ListItem key={i}>
                                        <ListItemIcon>
                                          <Circle sx={{ fontSize: 8, color: 'secondary.main' }} />
                                        </ListItemIcon>
                                        <ListItemText primary={ex} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                      {/* Giữ giao diện thông thoáng: bỏ divider dư thừa sau lưới chi tiết */}
                    </Box>
                  )}
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

                  {/* Optional table */}
                  {(section as any).content.table && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom color="primary">
                        Bảng tóm tắt:
                      </Typography>
                      <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {(section as any).content.table.columns.map((col: string, i: number) => (
                                <TableCell key={i} sx={{ fontWeight: 700 }}>{col}</TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(section as any).content.table.rows.map((row: string[], r: number) => (
                              <TableRow key={r}>
                                {row.map((cell: string, c: number) => (
                                  <TableCell key={c}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    </>
                  )}
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
