import { useState } from 'react';

export const LoginPanel = ({ onAuth }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onAuth(mode, form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="glass">
        <h1>PulseChat</h1>
        <p className="muted">Stay in sync with real-time rooms and DMs.</p>
        <div className="mode-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Sign In
          </button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Create Account
          </button>
        </div>
        <form onSubmit={submit} className="stack">
          {mode === 'register' && (
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={6}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Working…' : mode === 'login' ? 'Enter' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};
