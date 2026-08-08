'use client';

import { useState } from 'react';

interface AuthModalProps {
  onLogin: (user: any) => void;
  onClose: () => void;
}

export default function AuthModal({ onLogin, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!username || !password) {
      setError('Fill all fields bro!');
      return;
    }
    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      localStorage.setItem('enkripsi_user', data.user.username);
      onLogin(data.user);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-box">
        <h2><i className="fas fa-user-shield"></i> {tab === 'login' ? 'LOGIN' : 'REGISTER'}</h2>
        <div className="auth-tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>LOGIN</button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>REGISTER</button>
        </div>
        {error && <div className="auth-error"><i className="fas fa-triangle-exclamation"></i> {error}</div>}
        <input
          className="auth-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '<i class="fas fa-spinner fa-spin"></i> ...' : tab === 'login' ? '<i class="fas fa-right-to-bracket"></i> LOGIN' : '<i class="fas fa-user-plus"></i> REGISTER'}
        </button>
        <button className="auth-close" onClick={onClose}><i className="fas fa-xmark"></i></button>
      </div>
      <style jsx>{`
        .auth-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }
        .auth-box {
          background: #111;
          border: 3px solid #00ff41;
          padding: 24px;
          width: 90%;
          max-width: 380px;
          box-shadow: 8px 8px 0 #004d00;
          position: relative;
        }
        .auth-box h2 {
          font-size: 12px;
          color: #00ff41;
          margin: 0 0 16px 0;
          text-align: center;
          text-shadow: 2px 2px #004d00;
        }
        .auth-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .auth-tabs button {
          flex: 1;
          background: #1a1a1a;
          border: 2px solid #333;
          color: #888;
          padding: 8px;
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          cursor: pointer;
        }
        .auth-tabs button.active {
          border-color: #ff00ff;
          color: #ff00ff;
          background: #2a002a;
        }
        .auth-input {
          width: 100%;
          background: #0a0a0a;
          border: 2px solid #333;
          color: #00ff41;
          padding: 10px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          margin-bottom: 10px;
          outline: none;
        }
        .auth-input:focus {
          border-color: #00ff41;
        }
        .auth-btn {
          width: 100%;
          background: #ff00ff;
          border: 3px solid #ff00ff;
          color: #fff;
          padding: 12px;
          font-family: 'Press Start 2P', monospace;
          font-size: 9px;
          cursor: pointer;
          box-shadow: 4px 4px 0 #660066;
          margin-top: 8px;
        }
        .auth-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #660066;
        }
        .auth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .auth-error {
          background: #330000;
          border: 1px solid #ff0000;
          color: #ff4444;
          padding: 8px;
          font-size: 8px;
          margin-bottom: 10px;
        }
        .auth-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          color: #666;
          font-size: 14px;
          cursor: pointer;
        }
        .auth-close:hover {
          color: #ff00ff;
        }
      `}</style>
    </div>
  );
}
