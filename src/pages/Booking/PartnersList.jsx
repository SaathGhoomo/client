import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import PartnerReviews from '../../components/PartnerReviews.jsx';

export default function PartnersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    duration: 1,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user can book (only users can book)
    if (user?.role !== 'user') {
      navigate('/dashboard');
      return;
    }

    fetchPartners();
  }, [user, navigate]);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setPartners(data.partners || data.data || []);
      } else {
        toast.error('Failed to fetch partners');
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Error loading partners');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (partner) => {
    setSelectedPartner(partner);
    setShowBookingModal(true);
    setBookingForm({
      date: '',
      time: '',
      duration: 1,
      message: ''
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingForm.date || !bookingForm.time) {
      toast.error('Please select date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          partnerId: selectedPartner._id,
          date: bookingForm.date,
          startTime: bookingForm.time,
          endTime: (() => {
            const [hours, minutes] = bookingForm.time.split(':').map(Number);
            const endHours = hours + Number(bookingForm.duration || 1);
            const normalizedHours = ((endHours % 24) + 24) % 24;
            const paddedHours = String(normalizedHours).padStart(2, '0');
            const paddedMinutes = String(minutes).padStart(2, '0');
            return `${paddedHours}:${paddedMinutes}`;
          })(),
          message: bookingForm.message
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Booking created successfully!');
        setShowBookingModal(false);
        navigate('/my-bookings');
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Partners</span>
          <h2 className="s-title">Loading Partners</h2>
          <p className="s-sub">Fetching available travel partners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <div className="section-wrap">
        <span className="s-tag">Partners</span>
        <h2 className="s-title">Available Partners</h2>
        <p className="s-sub">Book experienced travel partners for your journey.</p>

        <div className="gc" style={{ padding: 32, borderRadius: 20 }}>
          {partners.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '16px',
                color: 'var(--blush)' 
              }}>
                👥
              </div>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>
                No Partners Available
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Check back later for available travel partners.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
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
                        fontSize: '1.3rem'
                      }}>
                        {partner.userId?.name || 'Partner'}
                      </h3>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '4px',
                        fontSize: '0.95rem'
                      }}>
                        📍 {partner.city}
                      </p>
                      {partner.rating && (
                        <p style={{ 
                          color: 'var(--blush)', 
                          marginBottom: '4px',
                          fontSize: '0.9rem'
                        }}>
                          ⭐ {partner.rating.toFixed(1)} Rating
                        </p>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      color: 'var(--blush)'
                    }}>
                      ₹{partner.hourlyRate}/hr
                    </div>
                  </div>

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
                      About
                    </h4>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>
                      {partner.bio}
                    </p>
                  </div>

                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ 
                      color: 'var(--blush)', 
                      marginBottom: '8px',
                      fontSize: '0.95rem'
                    }}>
                      Experience
                    </h4>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>
                      {partner.experience}
                    </p>
                  </div>

                  <button
                    className="btn-primary-nav"
                    onClick={() => handleBookNow(partner)}
                    style={{
                      width: '100%',
                      background: 'var(--blush)',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    📅 Book Now
                  </button>

                  {/* Reviews Section */}
                  <div style={{ marginTop: '20px' }}>
                    <PartnerReviews 
                      partnerId={partner._id} 
                      partnerName={partner.userId?.name || partner.name}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedPartner && (
        <div 
          className="auth-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowBookingModal(false)}
        >
          <div 
            className="gc"
            style={{
              width: '90%',
              maxWidth: '500px',
              padding: '32px',
              borderRadius: '20px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="auth-close"
              onClick={() => setShowBookingModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>

            <h3 style={{ 
              color: 'white', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Book {selectedPartner.userId?.name || 'Partner'}
            </h3>

            <form onSubmit={handleBookingSubmit}>
              <div className="auth-field">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div className="auth-field">
                <label>Time</label>
                <input
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div className="auth-field">
                <label>Duration (hours)</label>
                <input
                  type="number"
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="1"
                  max="8"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div className="auth-field">
                <label>Message (optional)</label>
                <textarea
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px',
                marginTop: '20px'
              }}>
                <button
                  type="button"
                  className="btn-ghost-nav"
                  onClick={() => setShowBookingModal(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-nav"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
