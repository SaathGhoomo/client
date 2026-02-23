import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../api/axios';

const NotificationContext = createContext();

// Action types
const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  INCREMENT_UNREAD: 'INCREMENT_UNREAD',
  SET_LOADING: 'SET_LOADING',
  SET_SOCKET: 'SET_SOCKET'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  socket: null
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload._id
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };

    case NOTIFICATION_ACTIONS.INCREMENT_UNREAD:
      return {
        ...state,
        unreadCount: state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case NOTIFICATION_ACTIONS.SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      };

    default:
      return state;
  }
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const newSocket = io('http://localhost:8000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Notification socket connected');
      dispatch({ type: NOTIFICATION_ACTIONS.SET_SOCKET, payload: newSocket });
    });

    newSocket.on('disconnect', () => {
      console.log('Notification socket disconnected');
      dispatch({ type: NOTIFICATION_ACTIONS.SET_SOCKET, payload: null });
    });

    newSocket.on('new-notification', (notification) => {
      console.log('New notification received:', notification);
      dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
      
      // Show toast notification
      toast.success(notification.title, {
        duration: 4000,
        position: 'top-right'
      });
    });

    newSocket.on('unread-count', (data) => {
      console.log('Unread count updated:', data.count);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT, payload: data.count });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch notifications only when user is logged in (token present)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
      return;
    }
    fetchNotifications();
  }, []);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      const response = await api.get('/notifications');
      
      if (response.data.success) {
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
          payload: response.data.notifications
        });
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
          payload: response.data.unreadCount
        });
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      
      if (response.data.success) {
        dispatch({
          type: NOTIFICATION_ACTIONS.MARK_AS_READ,
          payload: { _id: notificationId }
        });
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      
      if (response.data.success) {
        dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      
      if (response.data.success) {
        // Remove from state
        dispatch({
          type: 'SET_NOTIFICATIONS',
          payload: state.notifications.filter(n => n._id !== notificationId)
        });
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_UNREAD_COUNT,
          payload: response.data.unreadCount
        });
      }
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate to link if provided
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const value = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
