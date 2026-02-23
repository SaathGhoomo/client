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
      }
    ],
    partner: [
      ...menuItems,
      {
        id: 'partner',
        label: 'Partner Panel',
        icon: '💼'
      }
    ],
    user: menuItems
  };

  const currentMenuItems = roleBasedItems[user?.role] || menuItems;

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      {/* Top Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'rgba(4, 0, 12, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0 
          }}>
            Saath Ghoomo
          </h1>
          <span style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.9rem' 
          }}>
            Dashboard
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.85rem' 
          }}>
            Welcome, {user?.name}
          </span>
          <button
            className="btn-ghost-nav"
            type="button"
            onClick={() => {
              logout();
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.8)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', paddingTop: '70px' }}>
        {/* Sidebar */}
        <aside style={{
          width: '280px',
          background: 'rgba(4, 0, 12, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          height: 'calc(100vh - 70px)',
          position: 'fixed',
          left: 0,
          top: '70px',
          overflowY: 'auto',
          padding: '24px 0'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              opacity: 0.7
            }}>
              Menu
            </h3>
          </div>
          
          <nav>
            {currentMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: activeSection === item.id 
                    ? 'rgba(255, 45, 85, 0.2)' 
                    : 'transparent',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 45, 85, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = activeSection === item.id 
                    ? 'rgba(255, 45, 85, 0.2)' 
                    : 'transparent';
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          padding: '24px',
          marginLeft: '280px',
          minHeight: 'calc(100vh - 70px)'
        }}>
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
            <div className="gc" style={{ 
              padding: 32, 
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {activeSection === 'overview' && (
                <div>
                  <h3 style={{ color: 'var(--blush)', marginBottom: '16px' }}>Overview</h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px' 
                  }}>
                    <div style={{
                      background: 'rgba(255, 45, 85, 0.1)',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <h4 style={{ color: 'white', marginBottom: '8px' }}>Total Bookings</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--pink)' }}>0</div>
                    </div>
                    <div style={{
                      background: 'rgba(120, 119, 198, 0.1)',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <h4 style={{ color: 'white', marginBottom: '8px' }}>Total Earnings</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blush)' }}>₹0</div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '20px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <h4 style={{ color: 'white', marginBottom: '8px' }}>Profile Completion</h4>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--blush)' }}>85%</div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'bookings' && (
                <div>
                  <h3 style={{ color: 'var(--blush)', marginBottom: '16px' }}>My Bookings</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>No bookings yet.</p>
                </div>
              )}

              {activeSection === 'earnings' && (
                <div>
                  <h3 style={{ color: 'var(--blush)', marginBottom: '16px' }}>Earnings</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>Earnings dashboard coming soon.</p>
                </div>
              )}

              {activeSection === 'profile' && (
                <div>
                  <h3 style={{ color: 'var(--blush)', marginBottom: '16px' }}>Profile Settings</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>Profile settings coming soon.</p>
                </div>
              )}

              {activeSection === 'admin' && user?.role === 'admin' && (
                <div>
                  <h3 style={{ color: 'var(--blush)', marginBottom: '16px' }}>Admin Panel</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>Admin controls coming soon.</p>
                </div>
              )}

              {activeSection === 'partner' && user?.role === 'partner' && (
                <div>
                  <h3 style={{ color: 'var(--blush)', marginBottom: '16px' }}>Partner Panel</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>Partner dashboard coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
