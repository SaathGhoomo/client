import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊'
    },
    {
      id: 'partners',
      label: 'Browse Partners',
      icon: '👥'
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: '📅'
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: '💰'
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      icon: '⚙️'
    }
  ];

  const roleBasedItems = {
    admin: [
      ...menuItems,
      {
        id: 'admin',
        label: 'Admin Panel',
        icon: '🛡️'
      },
      {
        id: 'partner-approval',
        label: 'Partner Approvals',
        icon: '✅'
      }
    ],
    partner: [
      ...menuItems,
      {
        id: 'partner',
        label: 'Partner Panel',
        icon: '💼'
      },
      {
        id: 'partner-bookings',
        label: 'My Bookings',
        icon: '📋'
      }
    ],
    user: [
      ...menuItems,
      {
        id: 'wallet',
        label: 'My Wallet',
        icon: '🪙'
      },
      {
        id: 'apply-partner',
        label: 'Apply as Partner',
        icon: '🤝'
      }
    ]
  };

  const currentMenuItems = roleBasedItems[user?.role] || menuItems;

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <nav className="dash-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
            Saath Ghoomo
          </h1>
          <span className="s-tag" style={{ marginBottom: 0 }}>
            Dashboard
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Welcome, {user?.name}
          </span>
          <button type="button" className="btn-ghost-nav" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex' }}>
        <aside className="dash-sidebar">
          <div className="dash-sidebar-label">Menu</div>
          <nav>
            {currentMenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`dash-sidebar-btn ${activeSection === item.id ? 'active' : ''}`}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="dash-main">
          <div className="section-wrap">
            <span className="s-tag">{
              currentMenuItems.find(item => item.id === activeSection)?.label || 'Dashboard'
            }</span>
            <h2 className="s-title">{
              currentMenuItems.find(item => item.id === activeSection)?.label || 'Overview'
            }</h2>
            <p className="s-sub">{
              user?.role === 'admin' ? 'Admin control panel' :
              user?.role === 'partner' ? 'Partner management dashboard' :
              'User dashboard and settings'
            }</p>

            {/* Content based on active section */}
            <div className="dash-card">
              {activeSection === 'overview' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Overview</h3>
                  <div className="steps-grid" style={{ marginTop: 8 }}>
                    <div className="step-card">
                      <div className="step-num">0</div>
                      <h3 style={{ fontSize: '1rem' }}>Total Bookings</h3>
                      <p style={{ margin: 0 }}>Your bookings</p>
                    </div>
                    <div className="step-card">
                      <div className="step-num">₹0</div>
                      <h3 style={{ fontSize: '1rem' }}>Earnings</h3>
                      <p style={{ margin: 0 }}>From completed trips</p>
                    </div>
                    <div className="step-card">
                      <div className="step-num">85%</div>
                      <h3 style={{ fontSize: '1rem' }}>Profile</h3>
                      <p style={{ margin: 0 }}>Completion</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'bookings' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>My Bookings</h3>
                  <p className="s-sub" style={{ marginBottom: 0 }}>No bookings yet.</p>
                  <button type="button" className="btn-primary-nav" style={{ marginTop: 16 }} onClick={() => navigate('/my-bookings')}>
                    📅 My Bookings
                  </button>
                </div>
              )}

              {activeSection === 'earnings' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Earnings</h3>
                  <div className="steps-grid" style={{ marginBottom: 24 }}>
                    <div className="step-card">
                      <div className="step-num">₹0</div>
                      <h3 style={{ fontSize: '1rem' }}>Total Earnings</h3>
                      <p style={{ margin: 0 }}>From bookings</p>
                    </div>
                    <div className="step-card">
                      <div className="step-num">₹0</div>
                      <h3 style={{ fontSize: '1rem' }}>Pending</h3>
                      <p style={{ margin: 0 }}>Awaiting payout</p>
                    </div>
                  </div>
                  <p className="s-sub" style={{ marginBottom: 0 }}>Track your earnings from completed bookings and services.</p>
                </div>
              )}

              {activeSection === 'profile' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Profile Settings</h3>
                  <div className="gc" style={{ padding: 24, marginBottom: 20 }}>
                    <div className="auth-field" style={{ marginBottom: 16 }}>
                      <label>Name</label>
                      <div style={{ padding: '12px 14px', borderRadius: 11, border: '1px solid rgba(255,100,150,0.2)', background: 'rgba(255,255,255,0.07)', color: '#fff' }}>
                        {user?.name || 'Loading...'}
                      </div>
                    </div>
                    <div className="auth-field" style={{ marginBottom: 16 }}>
                      <label>Email</label>
                      <div style={{ padding: '12px 14px', borderRadius: 11, border: '1px solid rgba(255,100,150,0.2)', background: 'rgba(255,255,255,0.07)', color: '#fff' }}>
                        {user?.email || 'Loading...'}
                      </div>
                    </div>
                    <div className="auth-field">
                      <label>Role</label>
                      <div style={{ padding: '12px 14px', borderRadius: 11, border: '1px solid rgba(255,100,150,0.2)', background: 'rgba(255,255,255,0.07)', color: '#fff' }}>
                        {user?.role || 'Loading...'}
                      </div>
                    </div>
                  </div>
                  <p className="s-sub" style={{ marginBottom: 0 }}>Manage your account settings and preferences.</p>
                  <button type="button" className="btn-primary-nav" style={{ marginTop: 16 }} onClick={() => navigate('/profile')}>
                    🪪 Open Profile
                  </button>
                </div>
              )}

              {activeSection === 'admin' && user?.role === 'admin' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Admin Panel</h3>
                  <p className="s-sub" style={{ marginBottom: 0 }}>Admin controls coming soon.</p>
                </div>
              )}

              {activeSection === 'partner-approval' && user?.role === 'admin' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Partner Approvals</h3>
                  <p className="s-sub" style={{ marginBottom: 16 }}>
                    Review and manage partner applications from users.
                  </p>
                  <button type="button" className="btn-primary-nav" onClick={() => navigate('/admin/partner-approval')}>
                    ✅ Manage Applications
                  </button>
                </div>
              )}

              {activeSection === 'wallet' && user?.role === 'user' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>My Wallet</h3>
                  <p className="s-sub" style={{ marginBottom: 16 }}>
                    Manage your SaathCoins and view transaction history.
                  </p>
                  <button type="button" className="btn-primary-nav" onClick={() => navigate('/wallet')}>
                    🪙 View Wallet
                  </button>
                </div>
              )}

              {activeSection === 'partners' && user?.role === 'user' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Browse Partners</h3>
                  <p className="s-sub" style={{ marginBottom: 16 }}>
                    Discover and book experienced travel partners for your journey.
                  </p>
                  <button type="button" className="btn-primary-nav" onClick={() => navigate('/partners')}>
                    👥 Browse Partners
                  </button>
                </div>
              )}

              {activeSection === 'partner-bookings' && user?.role === 'partner' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Partner Bookings</h3>
                  <p className="s-sub" style={{ marginBottom: 16 }}>
                    Manage and respond to booking requests from users.
                  </p>
                  <button type="button" className="btn-primary-nav" onClick={() => navigate('/partner/bookings')}>
                    📋 Manage Bookings
                  </button>
                </div>
              )}

              {activeSection === 'apply-partner' && user?.role === 'user' && (
                <div>
                  <h3 className="s-tag" style={{ marginBottom: 12 }}>Apply as Partner</h3>
                  <p className="s-sub" style={{ marginBottom: 16 }}>
                    Ready to join our partner network? Apply below to start earning through your travel expertise.
                  </p>
                  <button type="button" className="btn-primary-nav" onClick={() => navigate('/apply-partner')}>
                    🤝 Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
