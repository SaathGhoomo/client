export default function Footer() {
  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-brand-name">
              Saath <em>Ghoomo</em>
            </div>
            <p>
              Find your perfect companion for any adventure. Safe, verified, and
              memorable experiences across India.
            </p>

            <div className="footer-social" aria-label="Social links">
              <a
                href="https://instagram.com/saathghoomo"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M17.6 6.6h.01"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <a
                href="https://facebook.com/saathghoomo"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 8.6V7.2c0-1.1.7-1.9 2-1.9h1.7V2H16c-3 0-5 1.9-5 5v1.6H8.6V12H11v10h3V12h2.8l.8-3.4H14Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://x.com/saathghoomo"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18.7 2H22l-7.2 8.2L23.2 22h-6.6l-5.1-6.7L5.7 22H2.4l7.7-8.8L1 2h6.8l4.6 6.1L18.7 2Zm-1.1 18h1.8L7.6 3.9H5.6L17.6 20Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://t.me/saathghoomos"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.8 4.6 3.7 11.8c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.5c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.7-2.6 5.6 4.1c1 .6 1.7.3 2-1l3.1-14.6c.4-1.6-.6-2.3-1.5-1.9Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
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
          <span className="footer-copy">© {currentYear} Saath Ghoomo. All rights reserved.</span>
          <span className="footer-hearts">♥ ♥ ♥</span>
        </div>
      </div>
    </footer>
  );
}
