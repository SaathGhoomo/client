import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PartnerApproval() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const response = await fetch('/api/admin/partners?status=pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications || data.data || []);
      } else {
        toast.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error loading applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (applicationId, action) => {
    setActionLoading(prev => ({ ...prev, [applicationId]: true }));

    try {
      const response = await fetch(`/api/admin/partners/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ approvalStatus: action })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Application ${action}d successfully!`);
        // Remove the application from the list
        setApplications(prev => prev.filter(app => app._id !== applicationId));
      } else {
        toast.error(data.message || `Failed to ${action} application`);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast.error(`Failed to ${action} application`);
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="page" style={{ paddingTop: 110 }}>
        <div className="section-wrap">
          <span className="s-tag">Partner Approval</span>
          <h2 className="s-title">Loading Applications</h2>
          <p className="s-sub">Fetching pending partner applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <div className="section-wrap">
        <span className="s-tag">Partner Approval</span>
        <h2 className="s-title">Pending Applications</h2>
        <p className="s-sub">Review and approve partner applications.</p>

        <div className="gc" style={{ padding: 32, borderRadius: 20 }}>
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '16px',
                color: 'var(--blush)' 
              }}>
                📋
              </div>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>
                No Pending Applications
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                All partner applications have been reviewed.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {applications.map((application) => (
                <div
                  key={application._id}
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
                        fontSize: '1.1rem'
                      }}>
                        {application.userId?.name}
                      </h3>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '4px',
                        fontSize: '0.9rem'
                      }}>
                        📧 {application.userId?.email}
                      </p>
                      <p style={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        marginBottom: '4px',
                        fontSize: '0.9rem'
                      }}>
                        📍 {application.city}
                      </p>
                    </div>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
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
                      Experience
                    </h4>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>
                      {application.experience}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h4 style={{ 
                        color: 'var(--blush)', 
                        marginBottom: '4px',
                        fontSize: '0.95rem'
                      }}>
                        Hourly Rate
                      </h4>
                      <p style={{ 
                        color: 'white', 
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}>
                        ₹{application.hourlyRate}
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ 
                      color: 'var(--blush)', 
                      marginBottom: '8px',
                      fontSize: '0.95rem'
                    }}>
                      Bio
                    </h4>
                    <p style={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>
                      {application.bio}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '12px',
                    marginTop: '20px'
                  }}>
                    <button
                      className="btn-primary-nav"
                      onClick={() => handleAction(application._id, 'approved')}
                      disabled={actionLoading[application._id]}
                      style={{
                        flex: 1,
                        opacity: actionLoading[application._id] ? 0.7 : 1,
                        cursor: actionLoading[application._id] ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {actionLoading[application._id] ? 'Approving...' : '✅ Approve'}
                    </button>
                    <button
                      className="btn-ghost-nav"
                      onClick={() => handleAction(application._id, 'rejected')}
                      disabled={actionLoading[application._id]}
                      style={{
                        flex: 1,
                        opacity: actionLoading[application._id] ? 0.7 : 1,
                        cursor: actionLoading[application._id] ? 'not-allowed' : 'pointer',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {actionLoading[application._id] ? 'Processing...' : '❌ Reject'}
                    </button>
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
