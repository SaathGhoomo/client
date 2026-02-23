import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import ReviewModal from '../../components/ReviewModal.jsx';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState({});
  const [wallet, setWallet] = useState(null);
  const [useCoins, setUseCoins] = useState({});
  const [showCoinInput, setShowCoinInput] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(null);

  useEffect(() => {
    // Check if user can view bookings (only users can view their bookings)
    if (user?.role !== 'user') {
      navigate('/dashboard');
      return;
    }

    fetchBookings();
    fetchWallet();
  }, [user, navigate]);

  const fetchWallet = async () => {
    try {
      const response = await api.get('/wallet');
      const data = response.data;
      
      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createOrder = async (bookingId, coinsToUse = 0) => {
    try {
      const response = await api.post('/payments/create-order', {
        bookingId,
        coinsToUse 
      });

      const data = response.data;
      
      if (data.success) {
        return data.order;
      } else {
        toast.error(data.message || 'Failed to create payment order');
        return null;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error.response?.data?.message || 'Failed to create payment order';
      toast.error(message);
      return null;
    }
  };

  const verifyPayment = async (paymentData, bookingId) => {
    try {
      const response = await api.post('/payments/verify', {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        bookingId
      });

      const data = response.data;
      
      if (data.success) {
        toast.success('Payment successful!');
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, paymentStatus: 'paid' }
              : booking
          )
        );
        fetchWallet(); // Refetch wallet after payment
      } else {
        toast.error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Payment verification failed');
    }
  };

  const handlePayment = async (booking) => {
    setPaymentLoading(prev => ({ ...prev, [booking._id]: true }));

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway');
      setPaymentLoading(prev => ({ ...prev, [booking._id]: false }));
      return;
    }

    // Get coins to use
    const coinsToUse = useCoins[booking._id] || 0;

    // Create order
    const order = await createOrder(booking._id, coinsToUse);
    if (!order) {
      setPaymentLoading(prev => ({ ...prev, [booking._id]: false }));
      return;
    }

    // Open Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'Saath Ghoomo',
      description: coinsToUse > 0 ? `Booking Payment (Using ${coinsToUse} coins)` : 'Booking Payment',
      handler: function (response) {
        // Verify payment
        verifyPayment(response, booking._id);
        setPaymentLoading(prev => ({ ...prev, [booking._id]: false }));
        // Refetch wallet after payment
        fetchWallet();
      },
      modal: {
        ondismiss: function() {
          setPaymentLoading(prev => ({ ...prev, [booking._id]: false }));
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || ''
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const toggleCoinInput = (bookingId) => {
    setShowCoinInput(prev => ({ ...prev, [bookingId]: !prev[bookingId] }));
    if (!showCoinInput[bookingId]) {
      setUseCoins(prev => ({ ...prev, [bookingId]: 0 }));
    }
  };

  const handleCoinsChange = (bookingId, value) => {
    const maxCoins = wallet?.balance || 0;
    const coinsToUse = Math.min(parseInt(value) || 0, maxCoins);
    setUseCoins(prev => ({ ...prev, [bookingId]: coinsToUse }));
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      const data = response.data;
      
      if (data.success) {
        setBookings(data.bookings || data.data || []);
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
          <span className="s-tag">My Bookings</span>
          <h2 className="s-title">Loading Bookings</h2>
          <p className="s-sub">Fetching your booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div className="section-wrap">
        <span className="s-tag">My Bookings</span>
        <h2 className="s-title">Your Bookings</h2>
        <p className="s-sub">Track and manage your travel bookings.</p>

        <div className="gc" style={{ padding: 32, borderRadius: 20 }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '16px',
                color: 'var(--blush)' 
              }}>
                📅
              </div>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>
                No Bookings Yet
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Start by booking a travel partner.
              </p>
              <button
                className="btn-primary-nav"
                onClick={() => navigate('/partners')}
                style={{
                  background: 'var(--blush)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '16px'
                }}
              >
                Browse Partners
              </button>
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
                        {booking.partnerId?.userId?.name || 'Partner'}
                      </h3>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '4px',
                        fontSize: '0.95rem'
                      }}>
                        📍 {booking.partnerId?.city || 'Location'}
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
                        Message
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

                  {booking.status === 'confirmed' && booking.paymentStatus !== 'paid' && (
                    <div>
                      {/* SaathCoins Section */}
                      {wallet && wallet.balance > 0 && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '16px'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '12px'
                          }}>
                            <h4 style={{ 
                              color: 'var(--blush)', 
                              fontSize: '0.95rem'
                            }}>
                              🪙 Use SaathCoins
                            </h4>
                            <button
                              className="btn-ghost-nav"
                              onClick={() => toggleCoinInput(booking._id)}
                              style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.85rem'
                              }}
                            >
                              {showCoinInput[booking._id] ? 'Cancel' : 'Apply Coins'}
                            </button>
                          </div>

                          {showCoinInput[booking._id] && (
                            <div style={{ 
                              display: 'flex', 
                              gap: '12px',
                              alignItems: 'center',
                              marginBottom: '12px'
                            }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ 
                                  color: 'rgba(255,255,255,0.7)', 
                                  fontSize: '0.85rem',
                                  marginBottom: '4px'
                                }}>
                                  Coins to Use:
                                </label>
                                <input
                                  type="number"
                                  value={useCoins[booking._id] || 0}
                                  onChange={(e) => handleCoinsChange(booking._id, e.target.value)}
                                  min="0"
                                  max={wallet.balance}
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                  }}
                                />
                                <p style={{ 
                                  color: 'rgba(255,255,255,0.5)', 
                                  fontSize: '0.75rem',
                                  marginTop: '4px'
                                }}>
                                  Available: {wallet.balance} coins
                                </p>
                              </div>
                              <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                textAlign: 'center'
                              }}>
                                <div style={{ 
                                  color: 'var(--blush)', 
                                  fontSize: '0.85rem',
                                  marginBottom: '2px'
                                }}>
                                  Discount Applied
                                </div>
                                <div style={{ 
                                  color: 'white', 
                                  fontSize: '1.1rem',
                                  fontWeight: 'bold'
                                }}>
                                  -{useCoins[booking._id] || 0} 🪙
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        className="btn-primary-nav"
                        onClick={() => handlePayment(booking)}
                        disabled={paymentLoading[booking._id]}
                        style={{
                          width: '100%',
                          background: 'var(--blush)',
                          border: 'none',
                          padding: '14px',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          opacity: paymentLoading[booking._id] ? 0.7 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        {paymentLoading[booking._id] ? (
                          <>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid white',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            💳 Pay {useCoins[booking._id] ? `with ${useCoins[booking._id]} coins` : 'Now'}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Review Section */}
                  {booking.status === 'completed' && !booking.reviewed && (
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <h4 style={{ 
                          color: 'var(--blush)', 
                          fontSize: '0.95rem'
                        }}>
                          ⭐ Rate Your Experience
                        </h4>
                        <span style={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          fontSize: '0.85rem'
                        }}>
                          Share your feedback
                        </span>
                      </div>
                      <button
                        onClick={() => setShowReviewModal(booking)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        ⭐ Leave Review
                      </button>
                    </div>
                  )}

                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'right'
                  }}>
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          booking={showReviewModal}
          onClose={() => setShowReviewModal(null)}
          onSuccess={() => {
            // Refetch bookings to update reviewed status
            fetchBookings();
            setShowReviewModal(null);
          }}
        />
      )}
    </div>
  );
}
