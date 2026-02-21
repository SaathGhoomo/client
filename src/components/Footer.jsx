export default function Footer() {
  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer>
      <div className="footer-wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">
              ✦ Saath <em>Ghoomo</em>
            </div>
            <p>
              Find your perfect companion for any adventure. Safe, verified, and
              memorable experiences across India.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <a onClick={() => smoothScroll("how-it-works")}>How It Works</a>
            <a onClick={() => smoothScroll("features")}>Features</a>
            <a onClick={() => smoothScroll("saath-coins")}>SaathCoins</a>
            <a onClick={() => smoothScroll("refer")}>Refer &amp; Earn</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a>About Us</a>
            <a>Become a Companion</a>
            <a>Safety Guidelines</a>
            <a>Blog</a>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <a>Help Centre</a>
            <a>Contact Us</a>
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Saath Ghoomo. All rights reserved.</span>
          <span className="footer-hearts">♥ ♥ ♥</span>
        </div>
      </div>
    </footer>
  );
}
