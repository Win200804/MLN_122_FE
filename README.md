# Ứng dụng Web: Lý luận Marx về Hàng hóa

Ứng dụng web React được thiết kế để giúp sinh viên và những người quan tâm tìm hiểu về lý thuyết kinh tế chính trị của Karl Marx, đặc biệt tập trung vào các khái niệm về hàng hóa và sản xuất hàng hóa.

## Tính năng chính

### 🏠 Trang chủ
- Giới thiệu tổng quan về ứng dụng
- Các card điều hướng đến các phần nội dung
- Trích dẫn nổi tiếng của Marx

### 📚 Lý thuyết Hàng hóa
- Khái niệm cơ bản về hàng hóa
- Giá trị sử dụng và giá trị trao đổi
- Lao động trừu tượng và lao động cụ thể
- Tiền tệ và hình thái giá trị

### 🏭 Sản xuất Hàng hóa
- Các yếu tố sản xuất
- Quá trình sản xuất theo Marx
- Quan hệ sản xuất
- Giá trị thặng dư và tích lũy tư bản

### 👤 Hồ sơ cá nhân
- Quản lý thông tin tài khoản
- Chỉnh sửa avatar, họ tên, email
- Cập nhật thông tin giới thiệu

### 🤖 Chat với AI
- Trò chuyện với AI về lý thuyết Marx
- Câu hỏi gợi ý
- Lịch sử chat
- Giao diện thân thiện

### 🔐 Hệ thống xác thực
- Đăng nhập/đăng xuất
- Quản lý phiên làm việc
- Bảo mật thông tin người dùng

## Công nghệ sử dụng

- **Frontend**: React 18 với TypeScript
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Build Tool**: Create React App
- **Styling**: Material-UI Theme System

## Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

### Chạy ứng dụng ở chế độ development
\`\`\`bash
npm start
\`\`\`

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

### Build cho production
\`\`\`bash
npm run build
\`\`\`

### Chạy tests
\`\`\`bash
npm test
\`\`\`

## Cấu trúc thư mục

\`\`\`
src/
├── components/          # Các component tái sử dụng
│   ├── Header/         # Header với navigation
│   └── Auth/           # Components xác thực
├── pages/              # Các trang chính
│   ├── Home/           # Trang chủ
│   ├── Theory/         # Trang lý thuyết
│   ├── Production/     # Trang sản xuất
│   ├── Profile/        # Trang hồ sơ
│   └── Chat/           # Trang chat AI
├── services/           # API services
├── types/              # TypeScript type definitions
├── App.tsx             # Component chính
└── index.tsx           # Entry point
\`\`\`

## API Mock

Hiện tại ứng dụng sử dụng mock API để demo. Các API endpoints bao gồm:

- **Auth API**: Đăng nhập, đăng xuất, lấy thông tin user
- **Profile API**: Cập nhật thông tin cá nhân
- **Theory API**: Lấy nội dung lý thuyết
- **Chat API**: Gửi tin nhắn và nhận phản hồi từ AI

## Tích hợp Backend

Để tích hợp với Spring Boot backend:

1. Thay thế các mock API trong `src/services/api.ts`
2. Cấu hình base URL cho API endpoints
3. Thêm interceptors cho authentication
4. Xử lý error handling từ backend

Ví dụ cấu hình axios:

\`\`\`typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});
\`\`\`

## Tính năng sắp tới

- [ ] Tích hợp với Spring Boot backend
- [ ] Hệ thống quiz về lý thuyết Marx
- [ ] Forum thảo luận
- [ ] Bookmark nội dung yêu thích
- [ ] Dark mode
- [ ] Đa ngôn ngữ (tiếng Anh)
- [ ] Progressive Web App (PWA)

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## Giấy phép

MIT License - xem file LICENSE để biết thêm chi tiết.

## Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub repository.
