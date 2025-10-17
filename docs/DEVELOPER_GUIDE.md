# Hướng dẫn Phát triển - Ứng dụng Web Lý luận Marx về Hàng hóa

## Mục lục
1. [Thiết lập Môi trường](#thiết-lập-môi-trường)
2. [Cấu trúc Dự án](#cấu-trúc-dự-án)
3. [Quy trình Phát triển](#quy-trình-phát-triển)
4. [Coding Standards](#coding-standards)
5. [Testing](#testing)
6. [API Integration](#api-integration)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Thiết lập Môi trường

### Yêu cầu Hệ thống
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **Git**: Latest version
- **IDE**: VS Code (khuyến nghị)

### Cài đặt Dự án

#### 1. Clone Repository
```bash
git clone <repository-url>
cd FE_MLN122
```

#### 2. Cài đặt Dependencies
```bash
npm install
```

#### 3. Cấu hình Environment Variables
Tạo file `.env.local` trong thư mục root:
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080

# Development Settings
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

#### 4. Chạy Development Server
```bash
npm start
# hoặc
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### VS Code Extensions (Khuyến nghị)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## Cấu trúc Dự án

### Tổng quan Thư mục
```
FE_MLN122/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/                    # Source code
│   ├── components/         # Reusable components
│   │   ├── Auth/          # Authentication components
│   │   └── Header/        # Navigation header
│   ├── pages/             # Page components
│   │   ├── Home/          # Homepage
│   │   ├── Theory/        # Theory page
│   │   ├── Production/    # Production page
│   │   ├── Profile/       # User profile
│   │   └── Chat/          # AI chat
│   ├── services/          # API services
│   │   └── api.ts         # Main API client
│   ├── types/             # TypeScript definitions
│   │   └── index.ts       # Type definitions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
├── docs/                  # Documentation
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript config
└── README.md              # Project overview
```

### Component Architecture

#### 1. Component Types
```typescript
// Functional Component với TypeScript
interface ComponentProps {
  prop1: string;
  prop2?: number;
  onAction: () => void;
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2, onAction }) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};

export default Component;
```

#### 2. Page Components
- Đặt trong thư mục `src/pages/`
- Mỗi page có thư mục riêng
- Export default component
- Sử dụng Container layout

#### 3. Reusable Components
- Đặt trong thư mục `src/components/`
- Nhóm theo chức năng
- Có PropTypes/TypeScript interfaces
- Có documentation

## Quy trình Phát triển

### 1. Git Workflow

#### Branch Strategy
```bash
main                    # Production branch
├── develop            # Development branch
├── feature/xyz        # Feature branches
├── bugfix/abc         # Bug fix branches
└── hotfix/urgent      # Hotfix branches
```

#### Commit Convention
```bash
# Format: type(scope): description

feat(auth): add login functionality
fix(chat): resolve message display issue
docs(readme): update installation guide
style(header): improve responsive design
refactor(api): optimize error handling
test(auth): add login component tests
```

#### Pull Request Process
1. Tạo feature branch từ `develop`
2. Implement feature với tests
3. Tạo Pull Request với description chi tiết
4. Code review từ team members
5. Merge sau khi approved và tests pass

### 2. Development Workflow

#### Daily Development
```bash
# 1. Pull latest changes
git pull origin develop

# 2. Create feature branch
git checkout -b feature/new-feature

# 3. Develop & commit
git add .
git commit -m "feat(feature): implement new feature"

# 4. Push & create PR
git push origin feature/new-feature
```

#### Testing Before Commit
```bash
# Run linting
npm run lint

# Run tests
npm test

# Build check
npm run build
```

## Coding Standards

### 1. TypeScript Guidelines

#### Type Definitions
```typescript
// Interfaces cho props
interface UserProps {
  id: string;
  name: string;
  email?: string;
}

// Union types
type Status = 'loading' | 'success' | 'error';

// Generic types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### Component Typing
```typescript
// Props interface
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

// Component with proper typing
const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size = 'medium', 
  onClick, 
  children 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### 2. React Best Practices

#### Hooks Usage
```typescript
// useState với proper typing
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState<boolean>(false);

// useEffect với cleanup
useEffect(() => {
  const subscription = subscribeToData();
  
  return () => {
    subscription.unsubscribe();
  };
}, [dependency]);

// Custom hooks
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = useCallback((credentials: LoginCredentials) => {
    // Login logic
  }, []);
  
  return { isAuthenticated, login };
};
```

#### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import { User } from '../types';

// 2. Types/Interfaces
interface ComponentProps {
  // props definition
}

// 3. Component
const Component: React.FC<ComponentProps> = (props) => {
  // 4. State
  const [state, setState] = useState();
  
  // 5. Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 6. Handlers
  const handleAction = () => {
    // handler logic
  };
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default Component;
```

### 3. Styling Guidelines

#### Material-UI Usage
```typescript
// Theme customization
const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
  },
});

// Component styling
const StyledComponent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1),
  },
}));

// Inline styles với sx prop
<Box 
  sx={{ 
    p: 2, 
    bgcolor: 'background.paper',
    '&:hover': {
      bgcolor: 'action.hover',
    }
  }}
>
  Content
</Box>
```

### 4. File Naming Conventions
```
PascalCase:     Components (Button.tsx, UserProfile.tsx)
camelCase:      Functions, variables (handleClick, userData)
kebab-case:     Files, folders (user-profile, api-client)
UPPER_CASE:     Constants (API_BASE_URL, MAX_RETRY_COUNT)
```

## Testing

### 1. Testing Setup

#### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

#### Test Utilities
```typescript
// src/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import theme from '../theme';

const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 2. Component Testing

#### Unit Tests
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '../test-utils';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant class', () => {
    render(<Button variant="primary">Primary Button</Button>);
    expect(screen.getByText('Primary Button')).toHaveClass('btn-primary');
  });
});
```

#### Integration Tests
```typescript
// LoginFlow.test.tsx
import { render, screen, fireEvent, waitFor } from '../test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake-token', user: { id: '1', name: 'Test User' } }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('user can login successfully', async () => {
  render(<App />);
  
  fireEvent.click(screen.getByText('Đăng nhập'));
  
  fireEvent.change(screen.getByLabelText('Tên đăng nhập'), {
    target: { value: 'testuser' }
  });
  fireEvent.change(screen.getByLabelText('Mật khẩu'), {
    target: { value: 'password' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }));
  
  await waitFor(() => {
    expect(screen.getByText('Xin chào, Test User')).toBeInTheDocument();
  });
});
```

### 3. API Testing

#### Mock API Responses
```typescript
// __mocks__/api.ts
export const authAPI = {
  login: jest.fn().mockResolvedValue({
    user: { id: '1', username: 'testuser', email: 'test@example.com' },
    token: 'fake-token'
  }),
  logout: jest.fn().mockResolvedValue(undefined),
  getCurrentUser: jest.fn().mockResolvedValue({
    id: '1',
    username: 'testuser',
    email: 'test@example.com'
  })
};
```

### 4. Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="login"
```

## API Integration

### 1. API Client Setup

#### Axios Configuration
```typescript
// services/api.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

### 2. API Service Pattern

#### Service Implementation
```typescript
// services/authService.ts
import { apiClient } from './api';
import { User, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      
      if (response.data.status === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Đăng nhập thất bại');
    }
  },

  async register(userData: RegisterRequest): Promise<string> {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  }
};
```

### 3. Error Handling

#### Global Error Handler
```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    return new ApiError(
      error.response.data?.message || 'Server error',
      error.response.status,
      error.response.data?.code
    );
  } else if (error.request) {
    // Request made but no response
    return new ApiError('Network error', 0, 'NETWORK_ERROR');
  } else {
    // Something else happened
    return new ApiError(error.message || 'Unknown error');
  }
};
```

### 4. React Query Integration (Optional)

#### Setup React Query
```typescript
// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { authService } from '../services/authService';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation(authService.login, {
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData('currentUser', data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
};

export const useCurrentUser = () => {
  return useQuery(
    'currentUser',
    authService.getCurrentUser,
    {
      enabled: !!localStorage.getItem('auth_token'),
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};
```

## Deployment

### 1. Build Process

#### Production Build
```bash
# Create optimized build
npm run build

# Test build locally
npx serve -s build
```

#### Build Optimization
```javascript
// webpack.config.js (if ejected)
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

### 2. Environment Configuration

#### Environment Files
```bash
# .env.development
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.production.com
REACT_APP_ENV=production
```

#### Environment Usage
```typescript
// config/environment.ts
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  environment: process.env.REACT_APP_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
```

### 3. Deployment Platforms

#### Netlify Deployment
```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  REACT_APP_API_URL = "https://api.production.com"
```

#### Vercel Deployment
```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4. CI/CD Pipeline

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_API_URL: ${{ secrets.API_URL }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### 1. Common Development Issues

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### TypeScript Errors
```bash
# Restart TypeScript service in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Check TypeScript configuration
npx tsc --noEmit
```

#### Build Errors
```bash
# Check for unused imports
npm run lint

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### 2. Runtime Issues

#### Authentication Issues
```typescript
// Debug authentication state
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user_email'));

// Clear authentication data
localStorage.removeItem('auth_token');
localStorage.removeItem('user_email');
localStorage.removeItem('user_id');
localStorage.removeItem('user_role');
```

#### API Connection Issues
```typescript
// Test API connectivity
const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    console.log('API Status:', response.status);
  } catch (error) {
    console.error('API Connection Error:', error);
  }
};
```

### 3. Performance Issues

#### Bundle Size Optimization
```bash
# Analyze bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Check for duplicate dependencies
npm ls --depth=0
```

#### Memory Leaks
```typescript
// Check for memory leaks in useEffect
useEffect(() => {
  const subscription = subscribe();
  
  // Always cleanup
  return () => {
    subscription.unsubscribe();
  };
}, []);

// Use AbortController for fetch requests
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error);
      }
    });
  
  return () => {
    controller.abort();
  };
}, []);
```

### 4. Debug Tools

#### React Developer Tools
- Install React DevTools browser extension
- Use Profiler tab for performance analysis
- Inspect component props and state

#### Network Debugging
```typescript
// Log all API requests
apiClient.interceptors.request.use(request => {
  console.log('Starting Request:', request.url, request.data);
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

## Contributing

### 1. Code Review Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] TypeScript types are properly defined
- [ ] Components are properly documented
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed

### 2. Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

### 3. Release Process
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Tag release
7. Deploy to production

---

*Happy coding! 🚀*
