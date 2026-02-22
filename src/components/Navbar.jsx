import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logoUrl from "../assets/saathghoomo-logo.svg";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell.jsx";

function smoothScroll(id) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth" });
}

function getInitials(name) {
  return (
    name
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

export default function Navbar({ onOpenAuth }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  const loggedIn = isAuthenticated;
  const userName = user?.name || "User";

  const initials = useMemo(() => getInitials(userName), [userName]);
  const firstName = useMemo(() => userName.split(" ")[0] || "User", [userName]);

  const wrapRef = useRef(null);

  useEffect(() => {}, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setDdOpen(false);
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const doLogout = () => {
    logout();
    setDdOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <div className="nav-row">
          <a
            className="nav-logo"
            onClick={() => {
              if (window.location.pathname === "/") {
                smoothScroll("hero");
              } else {
                navigate("/");
              }
            }}
            role="button"
            tabIndex={0}
          >
            <img className="nav-logo-icon" src={logoUrl} alt="SaathGhoomo" />
            Saath <em>Ghoomo</em>
          </a>

          <div className="nav-links" id="desktopLinks">
            <button className="nav-link" onClick={() => smoothScroll("hero")}>
              Home
            </button>
            <button
              className="nav-link"
              onClick={() => smoothScroll("find-companions")}
            >
              Find Companions
            </button>
            <button
              className="nav-link"
              onClick={() => smoothScroll("how-it-works")}
            >
              How It Works
            </button>
            <button
              className="nav-link"
              onClick={() => smoothScroll("features")}
            >
              Features
            </button>
            <button className="nav-link" onClick={() => smoothScroll("refer")}>
              Refer & Earn
            </button>
          </div>

          {!loggedIn ? (
            <div className="nav-auth" id="navAuthOut">
              <button
                className="btn-ghost-nav"
                onClick={() => navigate("/signin")}
                type="button"
              >
                Login
              </button>
              <button
                className="btn-primary-nav"
                onClick={() => navigate("/signup")}
                type="button"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="nav-dropdown-wrap" id="navAuthIn" ref={wrapRef}>
              {/* Notification Bell */}
              <NotificationBell />
              
              <button
                className="nav-avatar-btn"
                onClick={() => setDdOpen((v) => !v)}
                id="avatarBtn"
                type="button"
              >
                <div className="nav-avatar" id="navAvatarInitials">
                  {initials}
                </div>
                <span id="navDisplayName">{firstName}</span>
                <span className="nav-chevron">▾</span>
              </button>

              <div className={`nav-dropdown ${ddOpen ? "open" : ""}`} id="navDD">
                <div className="nav-dd-header">
                  <div
                    className="nav-avatar"
                    id="ddAvatarInitials"
                    style={{ width: 28, height: 28, fontSize: "0.72rem" }}
                  >
                    {initials}
                  </div>
                  <span className="nav-dd-name" id="ddUserName">
                    {userName}
                  </span>
                </div>

                <div className="nav-dd-sep" />
                <button className="nav-dd-item" type="button" onClick={() => setDdOpen(false)}>
                  👤 &nbsp;Dashboard
                </button>
                <button className="nav-dd-item" type="button" onClick={() => setDdOpen(false)}>
                  📅 &nbsp;My Bookings
                </button>
                <button className="nav-dd-item" type="button" onClick={() => setDdOpen(false)}>
                  💰 &nbsp;Wallet
                </button>
                <button
                  className="nav-dd-item"
                  type="button"
                  onClick={() => {
                    setDdOpen(false);
                    navigate("/profile");
                  }}
                >
                  🪪 &nbsp;Profile
                </button>
                <div className="nav-dd-sep" />
                <button className="nav-dd-item danger" type="button" onClick={doLogout}>
                  🚪 &nbsp;Log Out
                </button>
              </div>
            </div>
          )}

          <button
            className="nav-burger"
            id="burgerBtn"
            onClick={() => setMobileOpen((v) => !v)}
            type="button"
          >
            <div className={`burger-icon ${mobileOpen ? "open" : ""}`} id="burgerIcon">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>

        <div className={`nav-mobile ${mobileOpen ? "open" : ""}`} id="mobileMenu">
          <button
            className="nav-mobile-link"
            onClick={() => {
              smoothScroll("hero");
              closeMobile();
            }}
            type="button"
          >
            Home
          </button>
          <button
            className="nav-mobile-link"
            onClick={() => {
              smoothScroll("find-companions");
              closeMobile();
            }}
            type="button"
          >
            Find Companions
          </button>
          <button
            className="nav-mobile-link"
            onClick={() => {
              smoothScroll("how-it-works");
              closeMobile();
            }}
            type="button"
          >
            How It Works
          </button>
          <button
            className="nav-mobile-link"
            onClick={() => {
              smoothScroll("features");
              closeMobile();
            }}
            type="button"
          >
            Features
          </button>
          <button
            className="nav-mobile-link"
            onClick={() => {
              smoothScroll("refer");
              closeMobile();
            }}
            type="button"
          >
            Refer & Earn
          </button>

          {!loggedIn ? (
            <div className="nav-mobile-auth" id="mobileAuthOut">
              <button
                className="btn-ghost-nav"
                onClick={() => {
                  closeMobile();
                  navigate("/signin");
                }}
                type="button"
              >
                Login
              </button>
              <button
                className="btn-primary-nav"
                onClick={() => {
                  closeMobile();
                  navigate("/signup");
                }}
                type="button"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div className="nav-mobile-user" id="mobileAuthIn">
              <div className="nav-mobile-user-header">
                <div className="nav-avatar" id="mobileAvatar">
                  {initials}
                </div>
                <span className="nav-mobile-user-name" id="mobileUserName">
                  {userName}
                </span>
              </div>
              <button className="nav-mobile-link" type="button" onClick={closeMobile}>
                👤 &nbsp;Dashboard
              </button>
              <button className="nav-mobile-link" type="button" onClick={closeMobile}>
                📅 &nbsp;My Bookings
              </button>
              <button className="nav-mobile-link" type="button" onClick={closeMobile}>
                💰 &nbsp;Wallet
              </button>
              <button
                className="nav-mobile-link"
                type="button"
                onClick={() => {
                  closeMobile();
                  navigate("/profile");
                }}
              >
                🪪 &nbsp;Profile
              </button>
              <button
                className="nav-mobile-link"
                style={{ color: "rgba(255,107,107,0.8)" }}
                type="button"
                onClick={() => {
                  doLogout();
                  closeMobile();
                }}
              >
                🚪 &nbsp;Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
