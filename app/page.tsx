'use client';

import { useState, useEffect } from 'react';
import EncryptPanel from '@/components/EncryptPanel';
import AboutPanel from '@/components/AboutPanel';
import CreditsPanel from '@/components/CreditsPanel';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [tab, setTab] = useState<'encrypt' | 'about' | 'credits'>('encrypt');
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('enkripsi_user');
    if (stored) {
      fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: stored }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          setAuthChecked(true);
        })
        .catch(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  function handleLogin(newUser: any) {
    setUser(newUser);
    setShowAuth(false);
  }

  function handleLogout() {
    localStorage.removeItem('enkripsi_user');
    setUser(null);
  }

  return (
    <main className="retro-app">
      <div className="retro-header">
        <h1><i className="fas fa-gamepad"></i> ENKRIPSI-KU v2 <i className="fas fa-gamepad"></i></h1>
        <p>8-BIT JS OBFUSCATOR v2.0 // BY PRIMROSEREYY // PROTECT YOUR JS</p>
      </div>

      <div className="retro-topbar">
        <nav className="retro-nav">
          <button className={`retro-btn ${tab === 'encrypt' ? 'active' : ''}`} onClick={() => setTab('encrypt')}>
            <i className="fas fa-lock"></i> ENCRYPT
          </button>
          <button className={`retro-btn ${tab === 'about' ? 'active' : ''}`} onClick={() => setTab('about')}>
            <i className="fas fa-circle-info"></i> ABOUT
          </button>
          <button className={`retro-btn ${tab === 'credits' ? 'active' : ''}`} onClick={() => setTab('credits')}>
            <i className="fas fa-coins"></i> CREDITS
          </button>
        </nav>

        <div className="auth-section">
          {authChecked && (
            user ? (
              <div className="user-chip">
                <i className="fas fa-user"></i>
                <span className="user-name">{user.username}</span>
                <span className="user-plan" style={{ color: user.plan === 'max' ? '#ffd700' : user.plan.startsWith('premium') ? '#ff00ff' : '#00ff41' }}>
                  [{user.plan === 'max' ? 'MAX' : user.plan.startsWith('premium') ? 'PREM' : 'FREE'}]
                </span>
                <button className="logout-btn" onClick={handleLogout} title="Logout">
                  <i className="fas fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <button className="login-trigger" onClick={() => setShowAuth(true)}>
                <i className="fas fa-user"></i> LOGIN
              </button>
            )
          )}
        </div>
      </div>

      <div className="retro-panel">
        {tab === 'encrypt' && <EncryptPanel user={user} onAuthRequired={() => setShowAuth(true)} />}
        {tab === 'about' && <AboutPanel />}
        {tab === 'credits' && <CreditsPanel user={user} />}
      </div>

      <div className="retro-credit">
        <span>PRIMROSEREYY</span> // v2.0 CUSTOM ENGINE // <span className="blink">_</span>
      </div>

      {showAuth && <AuthModal onLogin={handleLogin} onClose={() => setShowAuth(false)} />}

      <style jsx>{`
        .retro-app {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          background: #0d0d0d;
          color: #00ff41;
          min-height: 100vh;
          padding: 20px;
          image-rendering: pixelated;
        }
        .retro-header {
          text-align: center;
          border-bottom: 4px solid #00ff41;
          padding-bottom: 16px;
          margin-bottom: 24px;
          text-shadow: 2px 2px #ff00ff;
        }
        .retro-header h1 {
          font-size: 16px;
          margin: 0 0 8px 0;
          color: #00ff41;
          letter-spacing: 2px;
        }
        .retro-header p {
          font-size: 7px;
          color: #888;
          margin: 0;
        }
        .retro-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        .retro-nav {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .retro-btn {
          background: #1a1a1a;
          border: 3px solid #00ff41;
          color: #00ff41;
          padding: 10px 16px;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          cursor: pointer;
          text-transform: uppercase;
          box-shadow: 4px 4px 0 #004d00;
          transition: all 0.1s;
        }
        .retro-btn:hover {
          background: #00ff41;
          color: #0d0d0d;
          box-shadow: 2px 2px 0 #004d00;
          transform: translate(2px, 2px);
        }
        .retro-btn.active {
          background: #ff00ff;
          border-color: #ff00ff;
          color: #fff;
          box-shadow: 4px 4px 0 #660066;
        }
        .auth-section {
          display: flex;
          align-items: center;
        }
        .login-trigger {
          background: #1a1a1a;
          border: 2px solid #00ff41;
          color: #00ff41;
          padding: 8px 12px;
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          cursor: pointer;
        }
        .login-trigger:hover {
          background: #00ff41;
          color: #0d0d0d;
        }
        .user-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          border: 2px solid #333;
          padding: 6px 10px;
          font-size: 7px;
        }
        .user-name {
          color: #00ff41;
        }
        .user-plan {
          font-size: 6px;
        }
        .logout-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 10px;
          padding: 2px;
        }
        .logout-btn:hover {
          color: #ff0000;
        }
        .retro-panel {
          background: #111;
          border: 3px solid #00ff41;
          padding: 20px;
          box-shadow: 6px 6px 0 #004d00;
          max-width: 900px;
          margin: 0 auto;
        }
        .retro-label {
          font-size: 8px;
          color: #ff00ff;
          margin-bottom: 8px;
          display: block;
          text-transform: uppercase;
        }
        .retro-textarea, .retro-output {
          width: 100%;
          min-height: 180px;
          background: #0a0a0a;
          border: 2px solid #333;
          color: #00ff41;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          padding: 12px;
          box-sizing: border-box;
          resize: vertical;
          outline: none;
        }
        .retro-textarea:focus {
          border-color: #00ff41;
          box-shadow: 0 0 8px #00ff4133;
        }
        .retro-output {
          background: #050505;
          border-color: #444;
          color: #0f0;
          white-space: pre-wrap;
          word-break: break-all;
          overflow-x: auto;
        }
        .retro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 700px) {
          .retro-grid { grid-template-columns: 1fr; }
          .retro-topbar { flex-direction: column; align-items: stretch; }
          .auth-section { justify-content: center; }
        }
        .enc-type-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        @media (max-width: 700px) {
          .enc-type-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 400px) {
          .enc-type-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .enc-type-btn {
          background: #1a1a1a;
          border: 2px solid #444;
          color: #888;
          padding: 8px 4px;
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          cursor: pointer;
          text-align: center;
        }
        .enc-type-btn:hover {
          border-color: #00ff41;
          color: #00ff41;
        }
        .enc-type-btn.selected {
          border-color: #ff00ff;
          color: #ff00ff;
          background: #2a002a;
          box-shadow: 0 0 8px #ff00ff44;
        }
        .retro-action-btn {
          background: #ff00ff;
          border: 3px solid #ff00ff;
          color: #fff;
          padding: 12px 24px;
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          cursor: pointer;
          box-shadow: 4px 4px 0 #660066;
          margin-top: 12px;
          width: 100%;
        }
        .retro-action-btn:hover {
          background: #ff44ff;
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #660066;
        }
        .retro-action-btn:active {
          transform: translate(4px, 4px);
          box-shadow: 0 0 0 #660066;
        }
        .retro-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .retro-stats {
          display: flex;
          gap: 16px;
          font-size: 7px;
          color: #666;
          margin-top: 8px;
          justify-content: flex-end;
        }
        .output-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .copy-btn, .download-btn {
          background: #1a1a1a;
          border: 2px solid #00ff41;
          color: #00ff41;
          padding: 6px 12px;
          font-family: 'Press Start 2P', monospace;
          font-size: 7px;
          cursor: pointer;
          flex: 1;
        }
        .copy-btn:hover, .download-btn:hover {
          background: #00ff41;
          color: #0d0d0d;
        }
        .download-btn {
          border-color: #ff00ff;
          color: #ff00ff;
        }
        .download-btn:hover {
          background: #ff00ff;
          color: #fff;
        }
        .upload-area {
          background: #0a0a0a;
          border: 2px dashed #444;
          color: #666;
          padding: 16px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 12px;
          font-size: 8px;
          transition: all 0.2s;
        }
        .upload-area:hover {
          border-color: #00ff41;
          color: #00ff41;
        }
        .upload-area i {
          display: block;
          font-size: 20px;
          margin-bottom: 8px;
        }
        .retro-about-box {
          background: #0a0a0a;
          border: 2px solid #333;
          padding: 16px;
          margin-bottom: 16px;
        }
        .retro-about-box h3 {
          color: #ff00ff;
          font-size: 10px;
          margin: 0 0 12px 0;
          text-shadow: 1px 1px #660066;
        }
        .retro-about-box p, .retro-about-box li {
          font-size: 9px;
          color: #ccc;
          line-height: 1.8;
          margin: 0 0 8px 0;
        }
        .retro-about-box ul {
          padding-left: 20px;
        }
        .retro-about-box li {
          margin-bottom: 6px;
        }
        .retro-tag {
          display: inline-block;
          background: #1a1a1a;
          border: 1px solid #00ff41;
          color: #00ff41;
          padding: 4px 8px;
          font-size: 7px;
          margin: 2px;
        }
        .retro-credit {
          text-align: center;
          margin-top: 24px;
          font-size: 7px;
          color: #555;
        }
        .retro-credit span {
          color: #ff00ff;
        }
        .blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}
