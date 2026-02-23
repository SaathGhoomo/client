import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ApplyPartner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    city: '',
    experience: '',
    hourlyRate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    // Check if user can apply (only users can apply)
    if (user?.role !== 'user') {
      navigate('/dashboard');
      return;
    }

    // Check if already applied
    fetchApplicationStatus();
  }, [user, navigate]);

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch('/api/partners/my-application', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setApplicationStatus(data.application.approvalStatus);
      }
    } catch (error) {
      console.error('Error fetching application status:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bio || !formData.city || !formData.experience || !formData.hourlyRate) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Application submitted successfully!');
        setApplicationStatus('pending');
        setFormData({ bio: '', city: '', experience: '', hourlyRate: '' });
      } else {
        toast.error(data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Application error:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (applicationStatus === 'pending') {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Partner Application</span>
          <h2 className="s-title">Application Pending</h2>
          <p className="s-sub">Your partner application is under review.</p>
          
          <div className="gc" style={{ 
            padding: 32, 
            borderRadius: 20,
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '16px',
              color: 'var(--blush)' 
            }}>
              ⏳
            </div>
            <h3 style={{ color: 'white', marginBottom: '8px' }}>
              Application Under Review
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              We'll notify you once your application is reviewed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (applicationStatus && applicationStatus !== 'pending') {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Partner Application</span>
          <h2 className="s-title">Application {applicationStatus === 'approved' ? 'Approved' : 'Rejected'}</h2>
          <p className="s-sub">
            Your application has been {applicationStatus}.
          </p>
          
          <div className="gc" style={{ 
            padding: 32, 
            borderRadius: 20,
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '16px',
              color: applicationStatus === 'approved' ? 'var(--blush)' : 'var(--crimson)' 
            }}>
              {applicationStatus === 'approved' ? '✅' : '❌'}
            </div>
            <h3 style={{ 
              color: 'white', 
              marginBottom: '8px' 
            }}>
              {applicationStatus === 'approved' ? 'Congratulations!' : 'Application Rejected'}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>
              {applicationStatus === 'approved' 
                ? 'Your partner application has been approved. You now have access to partner features.'
                : 'Your application was not approved at this time. You may apply again later.'
              }
            </p>
            {applicationStatus === 'approved' && (
              <button
                className="btn-primary-nav"
                onClick={() => navigate('/dashboard')}
                style={{ marginTop: '20px' }}
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <div className="section-wrap">
        <span className="s-tag">Partner Application</span>
        <h2 className="s-title">Apply as Partner</h2>
        <p className="s-sub">Join our network of trusted travel partners.</p>

        <div className="gc" style={{ padding: 32, borderRadius: 20 }}>
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself and your travel experience..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  minHeight: '100px'
                }}
              />
            </div>

            <div className="auth-field">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
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
              <label>Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Your travel experience (e.g., 5 years of guided tours)"
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
              <label>Hourly Rate (₹)</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="1000"
                min="100"
                max="10000"
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

            <button
              type="submit"
              className="btn-primary-nav"
              disabled={isSubmitting}
              style={{
                width: '100%',
                marginTop: '20px',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
