import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page" style={{ paddingTop: 110 }}>
      <section style={{ paddingTop: 32 }}>
        <div className="section-wrap">
          <span className="s-tag">Account</span>
          <h2 className="s-title">Profile</h2>
          <p className="s-sub">Manage your account details.</p>

          <div className="gc" style={{ padding: 26, borderRadius: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.45rem', fontWeight: 600 }}>
                  {user?.name || '—'}
                </div>
                <div style={{ color: 'rgba(255, 200, 220, 0.62)', fontSize: '0.92rem', marginTop: 4 }}>
                  {user?.email || '—'}
                </div>
              </div>

              {user?.isPremium ? (
                <div className="hero-badge" style={{ margin: 0 }}>
                  <span className="badge-dot" /> Premium
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
