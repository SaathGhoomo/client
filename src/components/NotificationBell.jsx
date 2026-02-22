import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleNotificationClick,
    loading
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationItemClick = async (notification) => {
    await handleNotificationClick(notification);
    setIsOpen(false);
  };

  const handleMarkAsRead = async (e, notificationId) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now - notificationDate;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return notificationDate.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_created':
      case 'booking_accepted':
      case 'booking_rejected':
        return '📅';
      case 'payment_completed':
        return '💳';
      case 'new_message':
        return '💬';
      case 'partner_application':
      case 'partner_approved':
      case 'partner_rejected':
        return '👤';
      case 'review_received':
        return '⭐';
      case 'wallet_updated':
        return '💰';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'booking_created':
        return '#3b82f6'; // blue
      case 'booking_accepted':
        return '#10b981'; // green
      case 'booking_rejected':
        return '#ef4444'; // red
      case 'payment_completed':
        return '#10b981'; // green
      case 'new_message':
        return '#8b5cf6'; // purple
      case 'partner_application':
        return '#f59e0b'; // amber
      case 'partner_approved':
        return '#10b981'; // green
      case 'partner_rejected':
        return '#ef4444'; // red
      case 'review_received':
        return '#f59e0b'; // amber
      case 'wallet_updated':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ marginRight: 8 }}>
      <button type="button" onClick={handleBellClick} className="notif-bell-btn" aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <h3 className="notif-dropdown-title">Notifications</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAllAsRead} className="notif-footer-btn" style={{ padding: 0 }}>
                  Mark all read
                </button>
              )}
              <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,200,220,0.6)', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="notif-dropdown-body">
            {loading ? (
              <div className="notif-item">
                <p className="notif-item-msg">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-item" style={{ textAlign: 'center', padding: 32 }}>
                <Bell size={36} style={{ opacity: 0.5, marginBottom: 8, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
                <p className="notif-item-msg">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notif-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationItemClick(notification)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: '1.1rem' }}>{getNotificationIcon(notification.type)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="notif-item-title">{notification.title}</p>
                      <p className="notif-item-msg">{notification.message}</p>
                      <p className="notif-item-time">{formatTime(notification.createdAt)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                      {!notification.isRead && (
                        <button type="button" onClick={(e) => handleMarkAsRead(e, notification._id)} title="Mark as read" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,200,220,0.6)' }}>
                          <Check size={14} />
                        </button>
                      )}
                      <button type="button" onClick={(e) => handleDelete(e, notification._id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,200,220,0.5)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notif-footer">
              <button type="button" className="notif-footer-btn" onClick={() => { window.location.href = '/notifications'; }}>
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
