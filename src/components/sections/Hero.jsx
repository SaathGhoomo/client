export default function Hero({ onOpenAuth }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-badge">
          <div className="badge-dot" />
          🌍 Now live across 12 cities
        </div>

        <h1 className="hero-title">
          Find Your Perfect<br />
          <em>Companion</em> for Any Adventure
        </h1>

        <p className="hero-sub">
          Book verified companions for movies, dinners, city tours, and adventures.
          Safe, trusted, and memorable experiences with Saath Ghoomo.
        </p>

        <div className="hero-btns">
          <button
            className="btn-hero btn-hero-primary"
            onClick={() => onOpenAuth?.("register")}
            type="button"
          >
            Start Your Journey 🚀
          </button>
          <button
            className="btn-hero btn-hero-ghost"
            onClick={() =>
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            type="button"
          >
            How It Works →
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <div className="stat-num">12K+</div>
            <div className="stat-label">Happy Travellers</div>
          </div>
          <div className="stat-divider" />
          <div>
            <div className="stat-num">850+</div>
            <div className="stat-label">Verified Companions</div>
          </div>
          <div className="stat-divider" />
          <div>
            <div className="stat-num">4.9★</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-divider" />
          <div>
            <div className="stat-num">99%</div>
            <div className="stat-label">Safe Experiences</div>
          </div>
        </div>
      </div>
    </section>
  );
}
