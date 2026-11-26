import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, XCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { homeFor } from '../lib/roles';
import './Login.css';

const Logo = () => (
  <span className="o360-logo-wrap" aria-label="Transcend Group of Institutions">
    <img src="/logo.png" alt="Transcend Group of Institutions" />
  </span>
);

const friendlyError = (err) =>
  err.status ? err.message : 'Can’t reach the campus server. Check that the API is running and try again.';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // { tone: 'error' | 'info', text }
  const [busy, setBusy] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError({ tone: 'error', text: 'Enter your email and password.' });
      return;
    }
    setBusy(true);
    try {
      // The server identifies the role from the account (RBAC) and returns a session token
      const { user, token } = await api.post('/api/auth/login', { identifier: email.trim(), password });
      login(user, token);
      navigate(homeFor(user), { replace: true });
    } catch (err) {
      setError({ tone: err.code === 'pending' ? 'info' : 'error', text: friendlyError(err) });
      setBusy(false);
    }
  };

  return (
    <div className="o360-page">
      <Logo />

      <motion.main
        className="o360-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <header className="o360-head">
          <h1>Sign in to Alumni Portal</h1>
        </header>

        {error && (
          <div className={`o360-alert ${error.tone === 'info' ? 'o360-alert--info' : ''}`} role="alert">
            {error.tone === 'info' ? <Info size={16} /> : <XCircle size={16} />}
            <span>{error.text}</span>
          </div>
        )}

        <form className="o360-form" onSubmit={handleSignIn} noValidate>
          <div>
            <label className="o360-label" htmlFor="o360-email">Email</label>
            <div className="o360-input">
              <Mail className="o360-input-icon" strokeWidth={1.75} aria-hidden="true" />
              <input
                id="o360-email"
                type="email"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck="false"
                placeholder="e.g. user@transcendgroup.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
      </motion.main>

      <p className="o360-foot">
        Alumni without an account? <Link to="/request-access">Request access</Link>
      </p>
    </div>
  );
};

export default Login;
