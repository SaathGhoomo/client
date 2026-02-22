import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <section style={{ paddingTop: 32 }}>
        <div className="section-wrap">
          <span className="s-tag">Dashboard</span>
          <h2 className="s-title">Welcome, {user?.name}</h2>
          <p className="s-sub">Your space to manage bookings, earnings, and account settings.</p>

          <div className="gc" style={{ padding: 26, borderRadius: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ color: 'rgba(255, 200, 220, 0.62)', fontSize: '0.92rem' }}>
                Logged in as {user?.email}
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn-ghost-nav" type="button" onClick={() => navigate('/profile')}>
                  Profile
                </button>
                <button
                  className="btn-primary-nav"
                  type="button"
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
