import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ChevronRight, Grid3x3, XCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import './Login.css';

const Logo = () => (
  <Link to="/" className="o360-logo-wrap" aria-label="Transcend Group of Institutions — home">
    <img src="/logo.png" alt="Transcend Group of Institutions" />
  </Link>
);

// Where each role lands after signing in
const homeFor = (user) => {
  switch (user.role) {
    case 'admin': return '/admin';
    case 'student': return user.profileStatus === 'incomplete' ? '/profile/complete' : '/student/dashboard';
    case 'alumni': return '/alumni/dashboard';
    default: return '/home';
  }
};

const friendlyError = (err) =>
  err.status ? err.message : 'Can’t reach the campus server. Check that the API is running and try again.';

const panel = {
  initial: { opacity: 0, x: 14 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, x: -14, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

const Login = () => {
  const [view, setView] = useState('signin'); // signin | pin
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(null); // { tone: 'error' | 'info', text }
  const [busy, setBusy] = useState(false);
  const pinRefs = useRef([]);

  const { login } = useAuth();
  const navigate = useNavigate();

  const finish = (user) => {
    login(user);
    navigate(homeFor(user));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim() || !password) {
      setError({ tone: 'error', text: 'Enter your institutional ID or email and your password.' });
      return;
    }
    setBusy(true);
    try {
      const { user } = await api.post('/api/auth/login', { identifier: identifier.trim(), password });
      finish(user);
    } catch (err) {
      setError({ tone: err.code === 'pending' ? 'info' : 'error', text: friendlyError(err) });
      setBusy(false);
    }
  };

  const submitPin = async (digits) => {
    setBusy(true);
    setError(null);
    try {
      const { user } = await api.post('/api/auth/pin', { pin: digits.join('') });
      finish(user);
    } catch (err) {
      setError({ tone: 'error', text: friendlyError(err) });
      setPin(['', '', '', '']);
      setBusy(false);
      requestAnimationFrame(() => pinRefs.current[0]?.focus());
    }
  };

  const setPinAt = (index, raw) => {
    const value = raw.replace(/\D/g, '');
    if (!value) {
      const next = [...pin];
      next[index] = '';
      setPin(next);
      return;
    }
    // Supports typing one digit or pasting several
    const next = [...pin];
    let i = index;
    for (const d of value) {
      if (i > 3) break;
      next[i++] = d;
    }
    setPin(next);
    if (next.every(Boolean)) submitPin(next);
    else pinRefs.current[Math.min(i, 3)]?.focus();
  };

  const onPinKey = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const openPin = () => {
    setError(null);
    setPin(['', '', '', '']);
    setView('pin');
  };

  const backToSignIn = () => {
    setError(null);
    setView('signin');
  };

  return (
    <div className="o360-page">
      <Logo />

      <motion.main
        className="o360-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        layout
      >
        <AnimatePresence mode="wait" initial={false}>
          {view === 'signin' ? (
            <motion.div key="signin" {...panel}>
              <header className="o360-head">
                <h1>Sign in to Overall360</h1>
                <p>Transcend Campus OS Unified Gateway</p>
              </header>

              {error && (
                <div className={`o360-alert ${error.tone === 'info' ? 'o360-alert--info' : ''}`} role="alert">
                  {error.tone === 'info' ? <Info size={16} /> : <XCircle size={16} />}
                  <span>{error.text}</span>
                </div>
              )}

              <form className="o360-form" onSubmit={handleSignIn} noValidate>
                <div>
                  <label className="o360-label" htmlFor="o360-id">Institutional ID or Email</label>
                  <div className="o360-input">
                    <User className="o360-input-icon" strokeWidth={1.75} aria-hidden="true" />
                    <input
                      id="o360-id"
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck="false"
                      placeholder="e.g. user@transcendgroup.org"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="o360-label" htmlFor="o360-pw">Password</label>
                  <div className="o360-input">
                    <Lock className="o360-input-icon" strokeWidth={1.75} aria-hidden="true" />
                    <input
                      id="o360-pw"
                      className="has-toggle"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="o360-eye"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="o360-primary" disabled={busy}>
                  {busy ? (
                    <><span className="o360-spinner" aria-hidden="true" /> Signing in…</>
                  ) : (
                    <>Sign In to Campus Workspace <ArrowRight size={17} strokeWidth={2.25} /></>
                  )}
                </button>
              </form>

              <button type="button" className="o360-option" onClick={openPin}>
                <span className="o360-option-icon" aria-hidden="true">
                  <Grid3x3 size={18} strokeWidth={2} />
                </span>
                <span className="o360-option-body">
                  <span className="o360-option-title">Pin login for Hostel Mess and Warden</span>
                  <span className="o360-option-sub">Instant 4-digit PIN access for Wardens &amp; Mess staff</span>
                </span>
                <ChevronRight className="o360-chevron" size={18} aria-hidden="true" />
              </button>

              <div className="o360-divider">or</div>

              <button type="button" className="o360-option o360-option--compact" onClick={() => navigate('/home')}>
                <Eye className="o360-eye-icon" size={18} strokeWidth={2} aria-hidden="true" />
                <span className="o360-option-body">
                  <span className="o360-option-title">View only option</span>
                </span>
                <ChevronRight className="o360-chevron" size={18} aria-hidden="true" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="pin" {...panel}>
              <header className="o360-head">
                <h1>Enter your PIN</h1>
                <p>4-digit access for Wardens &amp; Mess staff</p>
              </header>

              {error && (
                <div className="o360-alert" role="alert">
                  <XCircle size={16} />
                  <span>{error.text}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); if (pin.every(Boolean)) submitPin(pin); }}>
                <div className={`o360-pin ${error ? 'is-error' : ''}`} role="group" aria-label="4-digit PIN">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { pinRefs.current[i] = el; }}
                      type="password"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={4}
                      aria-label={`PIN digit ${i + 1}`}
                      autoFocus={i === 0}
                      disabled={busy}
                      value={digit}
                      onChange={(e) => setPinAt(i, e.target.value)}
                      onKeyDown={(e) => onPinKey(i, e)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>
                <button type="submit" className="o360-primary" disabled={busy || !pin.every(Boolean)}>
                  {busy ? <><span className="o360-spinner" aria-hidden="true" /> Checking PIN…</> : 'Unlock'}
                </button>
              </form>

              <button type="button" className="o360-back" onClick={backToSignIn}>
                <ArrowLeft size={14} /> Back to sign in
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <p className="o360-foot">
        Alumni without an account? <Link to="/request-access">Request access</Link>
      </p>
    </div>
  );
};

export default Login;
