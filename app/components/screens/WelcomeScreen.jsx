'use client';

export function WelcomeScreen({ onSignUp, onLogIn }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--paper)',
      padding: 'var(--s-6)',
      paddingTop: 80,
    }}>
      {/* Logo mark */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--r-lg)',
        background: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 'var(--s-6)',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="7" width="20" height="2" rx="1" fill="white" opacity="0.9" />
          <rect x="4" y="13" width="14" height="2" rx="1" fill="white" opacity="0.7" />
          <rect x="4" y="19" width="17" height="2" rx="1" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Wordmark + tagline */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 48,
        fontWeight: 700,
        color: 'var(--ink)',
        margin: 0,
        lineHeight: 1,
        marginBottom: 'var(--s-3)',
      }}>
        Timeline
      </h1>
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 16,
        color: 'var(--muted)',
        margin: 0,
        lineHeight: 1.5,
        maxWidth: 260,
      }}>
        See what&apos;s happening with the people around you.
      </p>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        <button
          onClick={onSignUp}
          style={{
            width: '100%',
            padding: '15px var(--s-5)',
            borderRadius: 'var(--r-pill)',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity var(--m-fast)',
          }}
          onMouseDown={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseUp={e => (e.currentTarget.style.opacity = '1')}
          onTouchStart={e => (e.currentTarget.style.opacity = '0.8')}
          onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
        >
          Create account
        </button>

        <button
          onClick={onLogIn}
          style={{
            width: '100%',
            padding: '14px var(--s-5)',
            borderRadius: 'var(--r-pill)',
            border: '1.5px solid var(--hair-2)',
            background: 'transparent',
            color: 'var(--ink)',
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'opacity var(--m-fast)',
          }}
          onMouseDown={e => (e.currentTarget.style.opacity = '0.6')}
          onMouseUp={e => (e.currentTarget.style.opacity = '1')}
          onTouchStart={e => (e.currentTarget.style.opacity = '0.6')}
          onTouchEnd={e => (e.currentTarget.style.opacity = '1')}
        >
          Log in
        </button>
      </div>

      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 12,
        color: 'var(--muted)',
        textAlign: 'center',
        marginTop: 'var(--s-5)',
        marginBottom: 0,
        lineHeight: 1.5,
      }}>
        By continuing, you agree to Timeline&apos;s terms of service.
      </p>
    </div>
  );
}
