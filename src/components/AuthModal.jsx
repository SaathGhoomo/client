import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

function flash(setMsg, msg, type) {
  setMsg({ msg, type });
  window.setTimeout(() => setMsg(null), 3200);
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass);
}

export default function AuthModal({
  open,
  mode,
  onClose,
  onLogin,
  onModeChange,
  onBurst,
  flipTargetRef,
}) {
  const { login, register, googleLogin } = useAuth();

  const overlayRef = useRef(null);

  const [registerMsg, setRegisterMsg] = useState(null);
  const [loginMsg, setLoginMsg] = useState(null);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regGender, setRegGender] = useState("Male");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  function flipToLogin() {
    if (!isFlipped) {
      document.getElementById("flipWrapper").classList.add("flipped");
      setIsFlipped(true);
    }
  }

  function flipToRegister() {
    if (isFlipped) {
      document.getElementById("flipWrapper").classList.remove("flipped");
      setIsFlipped(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setRegisterMsg(null);
      setLoginMsg(null);
    }
  }, [open]);

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const onGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      flash(setRegisterMsg, "VITE_GOOGLE_CLIENT_ID is not set.", "error");
      flash(setLoginMsg, "VITE_GOOGLE_CLIENT_ID is not set.", "error");
      return;
    }

    if (!window.google?.accounts?.id) {
      flash(setRegisterMsg, "Google script not loaded. Restart Vite.", "error");
      flash(setLoginMsg, "Google script not loaded. Restart Vite.", "error");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (resp) => {
        try {
          const res = await googleLogin({ idToken: resp.credential });
          const name = res?.user?.name || "User";
          onLogin?.({ name, initials: getInitials(name) });
          onClose?.();
        } catch (e) {
          const apiMsg = e?.response?.data?.message;
          flash(setRegisterMsg, apiMsg || "Google sign-in failed.", "error");
          flash(setLoginMsg, apiMsg || "Google sign-in failed.", "error");
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  const registerUser = async () => {
    const name = regName.trim();
    const email = regEmail.trim();
    const pass = regPass;

    if (!name || !email || !pass) {
      flash(setRegisterMsg, "Please fill all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      flash(setRegisterMsg, "Please provide a valid email.", "error");
      return;
    }

    if (pass.length < 6 || !isStrongPassword(pass)) {
      flash(
        setRegisterMsg,
        "Password must be at least 6 characters and include uppercase, lowercase and a number.",
        "error"
      );
      return;
    }

    try {
      await register({ name, email, password: pass });
      flash(setRegisterMsg, "✓ Account created!", "success");
      onBurst?.();
      onModeChange?.("login");
    } catch (e) {
      const apiMsg = e?.response?.data?.message;
      const firstValidationMsg = e?.response?.data?.errors?.[0]?.msg;
      flash(
        setRegisterMsg,
        firstValidationMsg || apiMsg || "Registration failed.",
        "error"
      );
    }
  };

  const loginUser = async () => {
    const email = loginEmail.trim();
    const pass = loginPass;

    try {
      const res = await login({ email, password: pass });
      const name = res?.user?.name || "User";
      onLogin?.({ name, initials: getInitials(name) });
      onClose?.();
    } catch (e) {
      const apiMsg = e?.response?.data?.message;
      const firstValidationMsg = e?.response?.data?.errors?.[0]?.msg;
      flash(setLoginMsg, firstValidationMsg || apiMsg || "Login failed.", "error");
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`auth-overlay ${open ? "open" : ""}`}
      onMouseDown={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <button className="auth-close" onClick={onClose} type="button">
        ✕
      </button>

      <div
        id="flipWrapper"
        ref={flipTargetRef}
        className="flip-wrapper"
      >
        <div className="card-front-wrap">
          <div className="arc-ring" />
          <div className="auth-card">
            <div className="auth-title">Saath Ghoomo</div>
            <div className="auth-sub">Find Compatibility Partner · Join</div>

            <button className="btn-google" onClick={onGoogle} type="button">
              <FcGoogle size={18} style={{ marginRight: 8 }} />
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or sign up with email</span>
            </div>

            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Create a password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showRegPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label>I am a</label>
              <select
                value={regGender}
                onChange={(e) => setRegGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>

            <button className="btn-auth" onClick={registerUser} type="button">
              Create Account
            </button>

            {registerMsg && (
              <div className={`auth-msg ${registerMsg.type}`}>{registerMsg.msg}</div>
            )}

            <div className="auth-switch">
              Already have an account?{" "}
              <span
                className="auth-link"
                onClick={() => {
                  flipToLogin();
                  onBurst?.();
                  onModeChange?.("login");
                }}
                role="button"
                tabIndex={0}
              >
                Sign In
              </span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  flipToLogin();
                  onBurst?.();
                  onModeChange?.("login");
                }}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                Already have an account? Sign In →
              </button>
            </div>
          </div>
        </div>

        <div className="card-back-wrap">
          <div className="arc-ring" />
          <div className="auth-card">
            <div className="auth-title">Welcome Back</div>
            <div className="auth-sub">Find Compatibility Partner · Sign In</div>

            <button className="btn-google" onClick={onGoogle} type="button">
              <FcGoogle size={18} style={{ marginRight: 8 }} />
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or sign in with email</span>
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Your password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  {showLoginPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button className="btn-auth" onClick={loginUser} type="button">
              Sign In
            </button>

            {loginMsg && (
              <div className={`auth-msg ${loginMsg.type}`}>{loginMsg.msg}</div>
            )}

            <div className="auth-switch">
              New here?{" "}
              <span
                className="auth-link"
                onClick={() => {
                  flipToRegister();
                  onBurst?.();
                  onModeChange?.("register");
                }}
                role="button"
                tabIndex={0}
              >
                Create account
              </span>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => {
                  flipToRegister();
                  onBurst?.();
                  onModeChange?.("register");
                }}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.color = 'rgba(255,255,255,0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                New here? Create Account →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
