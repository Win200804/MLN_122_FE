import React, { useMemo, useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Button, LinearProgress, Chip, Stack, Divider, RadioGroup, FormControlLabel, Radio, Alert } from '@mui/material';

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const QuizPage: React.FC = () => {
  const questions: QuizQuestion[] = useMemo(() => ([
    {
      id: 1,
      question: 'Theo C. Mác, khi nào sản phẩm của lao động trở thành hàng hóa?',
      options: [
        'Khi có giá cao',
        'Khi được đưa ra trao đổi, mua bán trên thị trường',
        'Khi do máy móc tạo ra',
        'Khi có bao bì đẹp'
      ],
      correctIndex: 1,
      explanation: 'Hàng hóa là sản phẩm lao động được sản xuất ra để trao đổi, mua bán.'
    },
    {
      id: 2,
      question: 'Giá trị sử dụng của hàng hóa là gì?',
      options: [
        'Tỷ lệ đổi hàng hóa này lấy hàng hóa khác',
        'Công dụng thỏa mãn nhu cầu con người',
        'Lợi nhuận thu được',
        'Chi phí sản xuất'
      ],
      correctIndex: 1,
      explanation: 'Giá trị sử dụng là tính hữu ích, chỉ thực hiện trong sử dụng/tiêu dùng.'
    },
    {
      id: 3,
      question: 'Yếu tố nào quyết định độ lớn giá trị hàng hóa?',
      options: [
        'Giá trị sử dụng',
        'Thời gian lao động xã hội cần thiết',
        'Nhu cầu thị trường',
        'Giá trị tiền'
      ],
      correctIndex: 1,
      explanation: 'Giá trị do lao động trừu tượng kết tinh; độ lớn do thời gian lao động xã hội cần thiết.'
    },
    {
      id: 4,
      question: 'Lao động cụ thể tạo ra:',
      options: ['Giá trị', 'Giá trị sử dụng', 'Lợi nhuận', 'Tiền tệ'],
      correctIndex: 1,
      explanation: 'Lao động cụ thể với hình thức nghề nghiệp nhất định tạo ra giá trị sử dụng.'
    },
    {
      id: 5,
      question: 'Lao động trừu tượng là:',
      options: ['Hao phí sức lao động nói chung', 'Nghề nghiệp cụ thể', 'Máy móc làm việc', 'Tự nhiên ban tặng'],
      correctIndex: 0,
      explanation: 'Lao động trừu tượng là hao phí sức lao động người sản xuất xét như lao động nói chung.'
    },
    {
      id: 6,
      question: 'Tăng năng suất lao động ảnh hưởng thế nào đến lượng giá trị trong 1 đơn vị hàng hóa?',
      options: ['Tăng lên', 'Giảm xuống', 'Không đổi', 'Không liên quan'],
      correctIndex: 1,
      explanation: 'Năng suất tăng → thời gian cần thiết giảm → lượng giá trị trong 1 đơn vị giảm.'
    },
    {
      id: 7,
      question: 'Tiền thực hiện chức năng “thước đo giá trị” nghĩa là:',
      options: ['Phải có tiền mặt', 'Dùng để đo lường và biểu hiện giá trị hàng hóa', 'Chỉ dùng vàng', 'Chỉ dùng đô la'],
      correctIndex: 1,
      explanation: 'Giá trị hàng hóa được biểu hiện bằng tiền gọi là giá cả.'
    },
    {
      id: 8,
      question: 'Phương tiện lưu thông đòi hỏi điều gì?',
      options: ['Tiền mặt', 'Vàng', 'Không cần tiền', 'Chỉ chuyển khoản'],
      correctIndex: 0,
      explanation: 'Làm môi giới trao đổi cần tiền mặt (tiền đúc/giấy).'
    },
    {
      id: 9,
      question: 'Dịch vụ khác hàng hóa vật thể ở điểm nào?',
      options: ['Không có giá cả', 'Không cất trữ được, sản xuất-tiêu dùng đồng thời', 'Không do lao động tạo ra', 'Không thỏa mãn nhu cầu'],
      correctIndex: 1,
      explanation: 'Dịch vụ có giá trị sử dụng, nhưng sản xuất-tiêu dùng đồng thời, không cất trữ.'
    },
    {
      id: 10,
      question: 'Quyền sử dụng đất có giá cả chủ yếu do:',
      options: ['Thời gian lao động xã hội cần thiết', 'Cung - cầu, khan hiếm, đô thị hóa', 'Giá vàng', 'Chi phí in sổ đỏ'],
      correctIndex: 1,
      explanation: 'Không do lao động trực tiếp như hàng hóa thông thường; chịu chi phối khan hiếm/cung-cầu.'
    },
    {
      id: 11,
      question: 'Giá cả chứng khoán phản ánh chủ yếu:',
      options: ['Giá trị sử dụng', 'Lợi ích kỳ vọng và thông tin', 'Chi phí in ấn', 'Giá vàng'],
      correctIndex: 1,
      explanation: 'Là hàng hóa phái sinh gắn với chủ thể sản xuất; giá phản ánh kỳ vọng dòng tiền.'
    },
    {
      id: 12,
      question: 'Ví dụ nào cho thấy “giá trị trao đổi” biến động theo cung - cầu?',
      options: ['Điện thoại đời cũ giảm giá khi đời mới ra', 'Cà phê thơm ngon', 'Sách nhiều trang', 'Áo có màu đẹp'],
      correctIndex: 0,
      explanation: 'Cung tăng/nhu cầu chuyển dịch → tỷ lệ trao đổi (giá cả) thay đổi.'
    },
    {
      id: 13,
      question: 'Tăng cường độ lao động (khẩn trương hơn) trong ngắn hạn làm:',
      options: ['Giảm tổng giá trị xã hội', 'Tăng tổng sản lượng và tổng giá trị cộng gộp', 'Giảm giá trị đơn vị', 'Tăng giá trị đơn vị'],
      correctIndex: 1,
      explanation: 'Cường độ tăng → tổng sản lượng tăng; giá trị đơn vị không đổi nếu công nghệ không đổi.'
    },
    {
      id: 14,
      question: 'Thương hiệu có thể được định giá cao vì:',
      options: ['Không cần sản xuất thực', 'Kỳ vọng lợi ích và tích lũy danh tiếng trên nền hàng hóa/dịch vụ thực', 'Không do lao động', 'Do pháp luật cấm'],
      correctIndex: 1,
      explanation: 'Thương hiệu bền vững dựa trên hàng hóa/dịch vụ thực và kỳ vọng doanh thu.'
    },
    {
      id: 15,
      question: 'Tiền tệ thế giới là chức năng khi:',
      options: ['Dùng để đếm số', 'Thanh toán quốc tế giữa các quốc gia', 'Mua rau ở chợ', 'Trữ vàng trong két'],
      correctIndex: 1,
      explanation: 'Tiền dùng làm phương tiện mua bán, thanh toán quốc tế.'
    }
  ]), []);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const progress = ((current + 1) / questions.length) * 100;
  const score = submitted ? answers.reduce((acc, a, idx) => acc + (a === questions[idx].correctIndex ? 1 : 0), 0) : 0;

  const handleSelect = (index: number) => {
    if (submitted) return;
    const next = [...answers];
    next[current] = index;
    setAnswers(next);
  };

  const nextQuestion = () => setCurrent(Math.min(current + 1, questions.length - 1));
  const prevQuestion = () => setCurrent(Math.max(current - 1, 0));
  const handleSubmit = () => setSubmitted(true);
  const handleRestart = () => {
    setAnswers(Array(questions.length).fill(-1));
    setCurrent(0);
    setSubmitted(false);
  };

  const q = questions[current];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>Quiz Hàng hóa</Typography>
        <Typography variant="subtitle1" color="text.secondary">15 câu vận dụng về hàng hóa, lao động, giá trị, tiền tệ, dịch vụ</Typography>
      </Box>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 2 }} />

      <Card>
        <CardContent>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={`Câu ${current + 1}/${questions.length}`} color="primary" size="small" />
            {submitted && <Chip label={`Điểm: ${score}/${questions.length}`} color="secondary" size="small" />}
          </Stack>

          <Typography variant="h6" sx={{ mb: 2 }}>{q.question}</Typography>

          <RadioGroup value={answers[current]} onChange={(_, v) => handleSelect(parseInt(v, 10))}>
            {q.options.map((opt, idx) => {
              const selected = answers[current] === idx;
              const correct = q.correctIndex === idx;
              const showResult = submitted;
              const color = showResult ? (correct ? 'success' : (selected ? 'error' : 'default')) : 'default';
              return (
                <FormControlLabel key={idx} value={idx} control={<Radio color={color as any} />} label={opt} />
              );
            })}
          </RadioGroup>

          {submitted && (
            <>
              <Divider sx={{ my: 2 }} />
              <Alert severity="info">Giải thích: {q.explanation}</Alert>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={prevQuestion} disabled={current === 0}>Trước</Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!submitted ? (
                current === questions.length - 1 ? (
                  <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={answers.some(a => a === -1)}>Nộp bài</Button>
                ) : (
                  <Button variant="contained" onClick={nextQuestion}>Tiếp</Button>
                )
              ) : (
                <>
                  <Button variant="contained" onClick={nextQuestion} disabled={current === questions.length - 1}>Tiếp</Button>
                  <Button variant="contained" color="secondary" onClick={handleRestart}>Làm lại</Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QuizPage;


