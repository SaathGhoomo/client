import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';

export default function CTA({ onOpenAuth }) {
  return (
    <section id="cta">
      <div className="cta-card">
        <h2 className="cta-title">Ready to Find Your Perfect Adventure Partner?</h2>
        <p className="cta-sub">
          Join 12,000+ people already using Saath Ghoomo to explore, connect, and
          create unforgettable memories — safely.
        </p>
        <div className="cta-btns">
          <button
            className="btn-hero btn-hero-primary"
            onClick={() => onOpenAuth?.("register")}
            type="button"
          >
            <FaUserPlus size={16} style={{ marginRight: 8 }} />
            Create Free Account
          </button>
          <button
            className="btn-hero btn-hero-ghost"
            onClick={() => onOpenAuth?.("login")}
            type="button"
          >
            <FaSignInAlt size={16} style={{ marginRight: 8 }} />
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}
