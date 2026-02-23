import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PartnerBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    // Check if user can view partner bookings (only partners can view)
    if (user?.role !== 'partner') {
      navigate('/dashboard');
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/partner-bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bookingId, action) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status: action })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Booking ${action}d successfully!`);
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, ...data.booking }
              : booking
          )
        );
      } else {
        toast.error(data.message || `Failed to ${action} booking`);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      toast.error(`Failed to ${action} booking`);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'cancelled':
        return '#F44336'; // Red
      case 'completed':
        return '#2196F3'; // Blue
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'completed':
        return '✨';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Partner Bookings</span>
          <h2 className="s-title">Loading Bookings</h2>
          <p className="s-sub">Fetching your booking requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <div className="section-wrap">
        <span className="s-tag">Partner Bookings</span>
        <h2 className="s-title">Booking Requests</h2>
        <p className="s-sub">Manage and respond to booking requests from users.</p>

        <div className="gc" style={{ padding: 32, borderRadius: 20 }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '16px',
                color: 'var(--blush)' 
              }}>
                📋
              </div>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>
                No Booking Requests
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                You'll see booking requests here when users book your services.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{ 
                        color: 'white', 
                        marginBottom: '8px',
                        fontSize: '1.2rem'
                      }}>
                        {booking.userId?.name || 'User'}
                      </h3>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '4px',
                        fontSize: '0.95rem'
                      }}>
                        📧 {booking.userId?.email || 'Email'}
                      </p>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '4px',
                        fontSize: '0.9rem'
                      }}>
                        📅 {new Date(booking.date).toLocaleDateString()} at {booking.startTime || 'Time'}
                      </p>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        fontSize: '0.9rem'
                      }}>
                        ⏱️ {booking.duration} hours
                      </p>
                    </div>
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px'
                    }}>
                      <div style={{
                        background: getStatusColor(booking.status),
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 'bold',
                        color: 'var(--blush)'
                      }}>
                        ₹{booking.totalAmount || 0}
                      </div>
                    </div>
                  </div>

                  {booking.message && (
                    <div style={{ 
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <h4 style={{ 
                        color: 'var(--blush)', 
                        marginBottom: '8px',
                        fontSize: '0.95rem'
                      }}>
                        User Message
                      </h4>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.8)', 
                        lineHeight: '1.5',
                        fontSize: '0.9rem'
                      }}>
                        {booking.message}
                      </p>
                    </div>
                  )}

                  {booking.status === 'pending' && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px',
                      marginTop: '20px'
                    }}>
                      <button
                        className="btn-primary-nav"
                        onClick={() => handleAction(booking._id, 'accepted')}
                        disabled={actionLoading[booking._id]}
                        style={{
                          flex: 1,
                          opacity: actionLoading[booking._id] ? 0.7 : 1,
                          cursor: actionLoading[booking._id] ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {actionLoading[booking._id] ? 'Processing...' : '✅ Accept'}
                      </button>
                      <button
                        className="btn-ghost-nav"
                        onClick={() => handleAction(booking._id, 'rejected')}
                        disabled={actionLoading[booking._id]}
                        style={{
                          flex: 1,
                          opacity: actionLoading[booking._id] ? 0.7 : 1,
                          cursor: actionLoading[booking._id] ? 'not-allowed' : 'pointer',
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        {actionLoading[booking._id] ? 'Processing...' : '❌ Reject'}
                      </button>
                    </div>
                  )}

                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'right',
                    marginTop: '16px'
                  }}>
                    Requested on {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
