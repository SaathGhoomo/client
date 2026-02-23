import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ChatRoom = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Authentication required');
      navigate('/signin');
      return;
    }

    const newSocket = io('http://localhost:8000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      // Join room after connection
      newSocket.emit('join-room', bookingId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('room-joined', (data) => {
      console.log('Room joined:', data);
      setBookingInfo(data.booking);
      
      // Determine other user based on current user role
      if (user.role === 'user') {
        setOtherUser({ name: data.booking.partnerName, type: 'partner' });
      } else {
        setOtherUser({ name: data.booking.userName, type: 'user' });
      }
    });

    newSocket.on('receive-message', (data) => {
      console.log('Message received:', data);
      setMessages(prev => [...prev, {
        id: data.id,
        sender: data.sender,
        message: data.message,
        timestamp: new Date(data.timestamp),
        isOwn: data.sender.id === user._id
      }]);
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'Chat error occurred');
    });

    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data);
      toast.success(`${data.userName} joined the chat`);
    });

    newSocket.on('user-left', (data) => {
      console.log('User left:', data);
      toast(`${data.userName} left the chat`, { icon: '👋' });
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leave-room', bookingId);
        newSocket.disconnect();
      }
    };
  }, [bookingId, navigate, user._id, user.role]);

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, [bookingId]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/chat/${bookingId}`);
      
      if (response.data.success) {
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg._id,
          sender: {
            id: msg.sender._id,
            name: msg.sender.name,
            role: msg.sender.role
          },
          message: msg.message,
          timestamp: new Date(msg.createdAt),
          isOwn: msg.sender._id === user._id
        }));
        
        setMessages(formattedMessages);
        setBookingInfo(response.data.booking);
        
        // Set other user info
        if (user.role === 'user') {
          setOtherUser({ name: response.data.booking.partnerName, type: 'partner' });
        } else {
          setOtherUser({ name: response.data.booking.userName, type: 'user' });
        }
        
        // Scroll to bottom after loading
        setTimeout(() => scrollToBottom(), 100);
      }
    } catch (error) {
      console.error('Load chat history error:', error);
      toast.error(error.response?.data?.message || 'Failed to load chat history');
      
      // Redirect if access denied
      if (error.response?.status === 403) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socket || !connected) {
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Emit message via socket
      socket.emit('send-message', {
        bookingId,
        message: messageText
      });
      
      // Add optimistic message to UI
      const optimisticMessage = {
        id: Date.now().toString(),
        sender: {
          id: user._id,
          name: user.name,
          role: user.role
        },
        message: messageText,
        timestamp: new Date(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setTimeout(() => scrollToBottom(), 100);
      
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
      // Restore message on error
      setNewMessage(messageText);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Chat</span>
          <h2 className="s-title">Loading Chat...</h2>
          <p className="s-sub">Please wait while we load your conversation.</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <div className="section-wrap">
        {/* Chat Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                padding: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              <ArrowLeft size={20} style={{ color: 'white' }} />
            </button>
            
            <div>
              <h3 style={{ color: 'white', fontSize: 18, marginBottom: 4 }}>
                {otherUser?.name || 'Chat'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: connected ? '#10b981' : '#ef4444'
                }}></div>
                <span style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: 14 
                }}>
                  {connected ? 'Online' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)'
          }}>
            {bookingInfo?.status || 'Chat'}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="gc" style={{
          height: 'calc(100vh - 300px)',
          minHeight: 400,
          padding: 20,
          borderRadius: 16,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: 'rgba(255,255,255,0.5)'
            }}>
              <MessageCircle size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p>No messages yet</p>
              <p style={{ fontSize: 14, marginTop: 8 }}>
                Start the conversation with a friendly greeting!
              </p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 16,
                  position: 'relative'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 12,
                    display: 'inline-block'
                  }}>
                    {date}
                  </div>
                </div>

                {/* Messages for this date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                        maxWidth: '70%'
                      }}
                    >
                      <div style={{
                        background: message.isOwn 
                          ? 'var(--blush)' 
                          : 'rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        borderRadius: message.isOwn 
                          ? '16px 16px 4px 16px' 
                          : '16px 16px 16px 4px',
                        border: message.isOwn 
                          ? 'none' 
                          : '1px solid rgba(255,255,255,0.2)',
                        maxWidth: '100%'
                      }}>
                        <p style={{
                          color: 'white',
                          margin: 0,
                          lineHeight: 1.4,
                          wordBreak: 'break-word'
                        }}>
                          {message.message}
                        </p>
                        <p style={{
                          color: message.isOwn 
                            ? 'rgba(255,255,255,0.8)' 
                            : 'rgba(255,255,255,0.5)',
                          fontSize: 11,
                          margin: '4px 0 0 0',
                          textAlign: message.isOwn ? 'right' : 'left'
                        }}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} style={{
          display: 'flex',
          gap: 12,
          marginTop: 20
        }}>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!connected || sending}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: '12px 16px',
              color: 'white',
              fontSize: 14,
              outline: 'none',
              transition: 'all 0.2s ease',
              opacity: connected ? 1 : 0.6
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.15)';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
          />
          
          <button
            type="submit"
            disabled={!connected || sending || !newMessage.trim()}
            style={{
              background: connected && newMessage.trim() 
                ? 'var(--blush)' 
                : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              color: 'white',
              cursor: connected && newMessage.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
              opacity: connected ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (connected && newMessage.trim()) {
                e.target.style.background = '#e11d48';
              }
            }}
            onMouseLeave={(e) => {
              if (connected && newMessage.trim()) {
                e.target.style.background = 'var(--blush)';
              }
            }}
          >
            {sending ? (
              <div style={{
                width: 16,
                height: 16,
                border: '2px solid white',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ChatRoom;
