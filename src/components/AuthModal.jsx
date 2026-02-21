import { useEffect, useMemo, useRef, useState } from "react";

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

export default function AuthModal({
  open,
  mode,
  onClose,
  onLogin,
  onModeChange,
  onBurst,
  flipTargetRef,
}) {
  const overlayRef = useRef(null);

  const [registerMsg, setRegisterMsg] = useState(null);
  const [loginMsg, setLoginMsg] = useState(null);

  const users = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("sgUsers") || "[]");
    } catch {
      return [];
    }
  }, [open]);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regGender, setRegGender] = useState("Male");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

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

  const isFlipped = mode === "login";

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const onGoogle = () => {
    flash(
      setRegisterMsg,
      "Google auth coming soon — backend not connected yet.",
      "error"
    );
    flash(
      setLoginMsg,
      "Google auth coming soon — backend not connected yet.",
      "error"
    );
  };

  const registerUser = () => {
    const name = regName.trim();
    const email = regEmail.trim();
    const pass = regPass;

    if (!name || !email || !pass) {
      flash(setRegisterMsg, "Please fill all fields.", "error");
      return;
    }

    if (users.find((u) => u.email === email)) {
      flash(setRegisterMsg, "Email already registered.", "error");
      return;
    }

    const nextUsers = [
      ...users,
      {
        name,
        email,
        pass,
        gender: regGender,
        coins: 100,
      },
    ];

    localStorage.setItem("sgUsers", JSON.stringify(nextUsers));
    flash(setRegisterMsg, "✓ Account created! Signing you in…", "success");

    window.setTimeout(() => {
      onBurst?.();
      onModeChange?.("login");
    }, 1100);
  };

  const loginUser = () => {
    const email = loginEmail.trim();
    const pass = loginPass;

    const user = users.find((u) => u.email === email && u.pass === pass);
    if (!user) {
      flash(setLoginMsg, "Incorrect email or password.", "error");
      return;
    }

    localStorage.setItem("accessToken", `local_${Date.now()}`);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("sgLoggedUser", JSON.stringify(user));

    onLogin?.({ name: user.name, initials: getInitials(user.name) });
    onClose?.();
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
        ref={flipTargetRef}
        className={`flip-wrapper ${isFlipped ? "flipped" : ""}`}
      >
        <div className="card-front-wrap">
          <div className="arc-ring" />
          <div className="auth-card">
            <div className="auth-title">✦ Saath Ghoomo</div>
            <div className="auth-sub">Find Compatibility Partner · Join</div>

            <button className="btn-google" onClick={onGoogle} type="button">
              <svg width="17" height="17" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
                />
              </svg>
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
              <input
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="Create a password"
              />
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
                  onBurst?.();
                  onModeChange?.("login");
                }}
                role="button"
                tabIndex={0}
              >
                Sign In
              </span>
            </div>
          </div>
        </div>

        <div className="card-back-wrap">
          <div className="arc-ring" />
          <div className="auth-card">
            <div className="auth-title">✦ Welcome Back</div>
            <div className="auth-sub">Find Compatibility Partner · Sign In</div>

            <button className="btn-google" onClick={onGoogle} type="button">
              <svg width="17" height="17" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
                />
              </svg>
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
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Your password"
              />
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
                  onBurst?.();
                  onModeChange?.("register");
                }}
                role="button"
                tabIndex={0}
              >
                Create account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
