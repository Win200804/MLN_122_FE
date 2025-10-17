import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Psychology,
  Clear
} from '@mui/icons-material';
import { ChatMessage } from '../../types';
import { chatAPI } from '../../services/api';

interface ChatPageProps {
  user: any;
  isAuthenticated: boolean;
}

const ChatPage: React.FC<ChatPageProps> = ({ user, isAuthenticated }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // State cho tin nhắn
  const [inputMessage, setInputMessage] = useState(''); // State cho input
  const [loading, setLoading] = useState(false); // State cho loading
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref để scroll xuống cuối

  // Scroll xuống cuối khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Tin nhắn chào mừng khi load trang
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: `Xin chào ${user?.fullName || user?.username}! Tôi là trợ lý AI chuyên về lý thuyết Marx. Bạn có thể hỏi tôi về hàng hóa, giá trị, sản xuất, hoặc bất kỳ khái niệm nào trong tư tưởng kinh tế chính trị của Marx. Hãy bắt đầu cuộc trò chuyện!`,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [isAuthenticated, user, messages.length]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // Thêm tin nhắn của user
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Gọi API để lấy phản hồi từ AI với user ID
      const aiResponse = await chatAPI.sendMessage(userMessage.content, user?.id);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Tạo error message với thông tin chi tiết hơn
      let errorContent = 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
      
      if (error.message) {
        errorContent = error.message;
      }
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        content: errorContent,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhấn Enter
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Xử lý xóa lịch sử chat
  const handleClearChat = () => {
    setMessages([]);
  };

  // Các câu hỏi gợi ý
  const suggestedQuestions = [
    'Hàng hóa là gì?',
    'Giải thích về giá trị sử dụng và giá trị trao đổi',
    'Lao động trừu tượng khác gì với lao động cụ thể?',
    'Giá trị thặng dư được tạo ra như thế nào?',
    'Vai trò của tiền tệ trong nền kinh tế?'
  ];

  // Định dạng thời gian
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Vui lòng đăng nhập để sử dụng tính năng chat với AI.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          <Psychology sx={{ mr: 1, fontSize: 'inherit' }} />
          Chat với AI Marx
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Trò chuyện với trợ lý AI về lý thuyết kinh tế chính trị
        </Typography>
      </Box>

      {/* Chat Container */}
      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100% - 120px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Messages Area */}
        <Box 
          sx={{ 
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: '#fafafa'
          }}
        >
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SmartToy sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Chưa có tin nhắn nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy bắt đầu cuộc trò chuyện với AI!
              </Typography>
            </Box>
          )}

          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  maxWidth: '80%',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                    mx: 1,
                    width: 32,
                    height: 32
                  }}
                >
                  {message.sender === 'user' ? <Person /> : <SmartToy />}
                </Avatar>
                
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? 'primary.light' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 1, 
                      opacity: 0.7,
                      textAlign: 'right'
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 1, width: 32, height: 32 }}>
                  <SmartToy />
                </Avatar>
                <Paper elevation={1} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      AI đang suy nghĩ...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Câu hỏi gợi ý:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestedQuestions.map((question, index) => (
                <Chip
                  key={index}
                  label={question}
                  variant="outlined"
                  size="small"
                  onClick={() => setInputMessage(question)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        {/* Input Area */}
        <Box sx={{ p: 2, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi về lý thuyết Marx..."
              variant="outlined"
              size="small"
              disabled={loading}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || loading}
              sx={{ mb: 0.5 }}
            >
              <Send />
            </IconButton>
            {messages.length > 0 && (
              <IconButton
                color="secondary"
                onClick={handleClearChat}
                disabled={loading}
                sx={{ mb: 0.5 }}
                title="Xóa lịch sử chat"
              >
                <Clear />
              </IconButton>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage;
