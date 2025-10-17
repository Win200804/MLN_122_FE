// WebSocket service cho admin real-time features
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { OnlineUserResponse } from '../types';

class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 giây
  
  // Callbacks cho các events
  private onlineCountCallback: ((data: OnlineUserResponse) => void) | null = null;
  private onlineDetailsCallback: ((data: OnlineUserResponse) => void) | null = null;
  private connectionStatusCallback: ((connected: boolean) => void) | null = null;

  constructor() {
    this.setupClient();
  }

  private setupClient() {
    try {
      // Tạo SockJS connection
      const socket = new SockJS(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/ws`);
      
      // Tạo STOMP client
      this.client = new Client({
        webSocketFactory: () => socket,
      connectHeaders: {
        // Thêm Authorization header nếu có token
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('WebSocket Debug:', str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('WebSocket connected:', frame);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Notify connection status
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(true);
        }
        
        // Subscribe to online count updates
        this.subscribeToOnlineCount();
        
        // Subscribe to online details updates
        this.subscribeToOnlineDetails();
      },
      onDisconnect: (frame) => {
        console.log('WebSocket disconnected:', frame);
        this.isConnected = false;
        
        // Notify connection status
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
      },
      onStompError: (frame) => {
        console.error('WebSocket STOMP error:', frame);
        this.isConnected = false;
        
        // Notify connection status
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
        
        // Attempt reconnection
        this.attemptReconnection();
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        this.isConnected = false;
        
        // Notify connection status
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
      },
    });
    } catch (error) {
      console.error('Error setting up WebSocket client:', error);
      this.isConnected = false;
      
      // Notify connection status
      if (this.connectionStatusCallback) {
        this.connectionStatusCallback(false);
      }
    }
  }

  private subscribeToOnlineCount() {
    if (!this.client || !this.isConnected) return;

    // Subscribe to online count topic
    this.client.subscribe('/topic/online-count', (message) => {
      try {
        const data: OnlineUserResponse = JSON.parse(message.body);
        console.log('Received online count update:', data);
        
        if (this.onlineCountCallback) {
          this.onlineCountCallback(data);
        }
      } catch (error) {
        console.error('Error parsing online count message:', error);
      }
    });
  }

  private subscribeToOnlineDetails() {
    if (!this.client || !this.isConnected) return;

    // Subscribe to online details topic
    this.client.subscribe('/topic/online-details', (message) => {
      try {
        const data: OnlineUserResponse = JSON.parse(message.body);
        console.log('Received online details update:', data);
        
        if (this.onlineDetailsCallback) {
          this.onlineDetailsCallback(data);
        }
      } catch (error) {
        console.error('Error parsing online details message:', error);
      }
    });
  }

  private attemptReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      if (!this.isConnected && this.client) {
        this.client.activate();
      }
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  // Public methods
  connect() {
    if (this.client && !this.isConnected) {
      // Update token in headers before connecting
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.client.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      }
      
      this.client.activate();
    }
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }

  // Request refresh online count
  refreshOnlineCount() {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: '/app/refresh-online-count',
        body: JSON.stringify({}),
      });
    }
  }

  // Request online details
  requestOnlineDetails() {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: '/app/get-online-details',
        body: JSON.stringify({}),
      });
    }
  }

  // Set callbacks
  setOnlineCountCallback(callback: (data: OnlineUserResponse) => void) {
    this.onlineCountCallback = callback;
  }

  setOnlineDetailsCallback(callback: (data: OnlineUserResponse) => void) {
    this.onlineDetailsCallback = callback;
  }

  setConnectionStatusCallback(callback: (connected: boolean) => void) {
    this.connectionStatusCallback = callback;
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Clean up callbacks
  clearCallbacks() {
    this.onlineCountCallback = null;
    this.onlineDetailsCallback = null;
    this.connectionStatusCallback = null;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
