import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const { login, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const onGoogle = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('VITE_GOOGLE_CLIENT_ID is not set');
      return;
    }

    if (!window.google?.accounts?.id) {
      toast.error('Google script not loaded. Please restart Vite.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (resp) => {
        try {
          await googleLogin({ idToken: resp.credential });
          const to = location.state?.from || '/dashboard';
          navigate(to, { replace: true });
        } catch (e) {
          const apiMsg = e?.response?.data?.message;
          toast.error(apiMsg || 'Google sign-in failed');
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    try {
      await login(values);
      const to = location.state?.from || '/dashboard';
      navigate(to, { replace: true });
    } catch (e) {
      const apiMsg = e?.response?.data?.message;
      const firstValidationMsg = e?.response?.data?.errors?.[0]?.msg;
      toast.error(firstValidationMsg || apiMsg || 'Login failed');
    }
  };

  return (
    <div className="auth-overlay open" role="main" aria-modal="false">
      <div className="flip-wrapper">
        <div className="card-front-wrap">
          <div className="arc-ring" />
          <div className="auth-card">
            <div className="auth-title">Welcome Back</div>
            <div className="auth-sub">Find Compatibility Partner · Sign In</div>

            <button className="btn-google" type="button" onClick={onGoogle}>
              <FcGoogle size={18} style={{ marginRight: 8 }} />
              Continue with Google
            </button>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                />
                {errors.email && (
                  <div className="auth-msg error" style={{ marginTop: 8 }}>
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Min 6 characters' },
                    })}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <div className="auth-msg error" style={{ marginTop: 8 }}>
                    {errors.password.message}
                  </div>
                )}
              </div>

              <button className="btn-auth" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="auth-switch">
              New here?{' '}
              <Link className="auth-link" to="/signup">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
