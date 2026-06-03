'use client';
import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

const INPUT_STYLE = {
  width: '100%',
  padding: '13px var(--s-4)',
  borderRadius: 'var(--r-md)',
  border: '1.5px solid var(--hair-2)',
  background: 'var(--card)',
  color: 'var(--ink)',
  fontFamily: 'var(--font-ui)',
  fontSize: 16,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color var(--m-fast)',
};

function Field({ label, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--ink-2)',
      }}>
        {label}
      </label>
      <input
        {...inputProps}
        style={{
          ...INPUT_STYLE,
          borderColor: focused ? 'var(--accent)' : 'var(--hair-2)',
        }}
        onFocus={e => { setFocused(true); inputProps.onFocus?.(e); }}
        onBlur={e => { setFocused(false); inputProps.onBlur?.(e); }}
      />
    </div>
  );
}

export function AuthScreen({ mode: initialMode, onBack }) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'signup' | 'login'

  const [name, setName]         = useState('');
  const [handle, setHandle]     = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [info, setInfo]       = useState('');

  function switchMode(next) {
    setMode(next);
    setError('');
    setInfo('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const err = await signUp(email.trim(), password, name.trim(), handle.trim() || name.trim());
        if (err) {
          setError(err.message);
        } else {
          setInfo('Check your email to confirm your account, then log in.');
          switchMode('login');
        }
      } else {
        const err = await signIn(email.trim(), password);
        if (err) setError(err.message);
        // on success, AuthContext session change navigates automatically
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--paper)',
      overflowY: 'auto',
    }}>
      {/* Nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--s-4) var(--s-5)',
        paddingTop: 52,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: 'var(--s-2)',
            margin: '-8px',
            cursor: 'pointer',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--ink)',
          }}
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--s-2) var(--s-6) var(--s-8)',
        gap: 'var(--s-6)',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 700,
            color: 'var(--ink)',
            margin: 0,
            marginBottom: 'var(--s-2)',
          }}>
            {mode === 'signup' ? 'Create account' : 'Welcome back'}
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--muted)',
            margin: 0,
          }}>
            {mode === 'signup'
              ? 'Join Timeline to share and see events with friends.'
              : 'Log in to your Timeline account.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          {mode === 'signup' && (
            <>
              <Field
                label="Name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
              <Field
                label="Username"
                type="text"
                placeholder="yourhandle"
                value={handle}
                onChange={e => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, ''))}
                autoComplete="username"
              />
            </>
          )}

          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete={mode === 'signup' ? 'email' : 'username'}
            required
          />

          <Field
            label="Password"
            type="password"
            placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
          />
        </div>

        {/* Error / info messages */}
        {error && (
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'oklch(52% 0.18 22)',
            background: 'oklch(96% 0.03 22)',
            padding: 'var(--s-3) var(--s-4)',
            borderRadius: 'var(--r-md)',
            margin: 0,
          }}>
            {error}
          </p>
        )}
        {info && (
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            color: 'var(--good)',
            background: 'oklch(96% 0.04 150)',
            padding: 'var(--s-3) var(--s-4)',
            borderRadius: 'var(--r-md)',
            margin: 0,
          }}>
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px var(--s-5)',
            borderRadius: 'var(--r-pill)',
            border: 'none',
            background: loading ? 'var(--muted)' : 'var(--accent)',
            color: '#fff',
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background var(--m-fast)',
          }}
        >
          {loading
            ? (mode === 'signup' ? 'Creating account…' : 'Logging in…')
            : (mode === 'signup' ? 'Create account' : 'Log in')}
        </button>

        {/* Switch mode */}
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          color: 'var(--muted)',
          textAlign: 'center',
          margin: 0,
        }}>
          {mode === 'signup' ? 'Already have an account? ' : 'New to Timeline? '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'signup' ? 'login' : 'signup')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--accent)',
            }}
          >
            {mode === 'signup' ? 'Log in' : 'Create account'}
          </button>
        </p>
      </form>
    </div>
  );
}
