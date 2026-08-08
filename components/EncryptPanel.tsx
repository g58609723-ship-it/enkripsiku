'use client';

import { useState, useRef, useEffect } from 'react';

const ENCRYPTION_TYPES = [
  { id: 'obf', label: '/obf' },
  { id: 'enchard', label: '/enchard' },
  { id: 'encbreak', label: '/encbreak' },
  { id: 'invisibleenc', label: '/invisible' },
  { id: 'encnull', label: '/encnull' },
  { id: 'encvar', label: '/encvar' },
  { id: 'encundf', label: '/encundf' },
  { id: 'encnan', label: '/encnan' },
  { id: 'enctostring', label: '/enctostring' },
  { id: 'encquery', label: '/encquery' },
  { id: 'customname', label: '/customname' },
];

interface EncryptPanelProps {
  user: any;
  onAuthRequired: () => void;
}

export default function EncryptPanel({ user, onAuthRequired }: EncryptPanelProps) {
  const [mode, setMode] = useState('obf');
  const [customName, setCustomName] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('// Encrypted result will appear here...');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ orig: 0, new: 0, ratio: '0' });
  const [fileName, setFileName] = useState('');
  const [localUser, setLocalUser] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  // Refresh user data
  async function refreshUser() {
    const stored = localStorage.getItem('enkripsi_user');
    if (!stored) return;
    try {
      const res = await fetch('/api/auth/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: stored }),
      });
      const data = await res.json();
      if (data.user) setLocalUser(data.user);
    } catch {}
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.js')) {
      alert('Hanya file .js yang diperbolehkan!');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setInput(text);
    };
    reader.readAsText(file);
  }

  async function runEncrypt() {
    if (!localUser) {
      onAuthRequired();
      return;
    }
    if (!input.trim()) {
      setOutput('// ERROR: Input code is empty!\n// Paste some JavaScript first.');
      return;
    }
    if (mode === 'customname' && (!customName || customName.trim().length < 2)) {
      setOutput('// ERROR: Custom name required (min 2 chars) for /customname mode!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: input,
          mode,
          customName: customName.trim(),
          username: localUser.username,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Encryption failed');
      setOutput(data.result);
      setStats({
        orig: input.length,
        new: data.result.length,
        ratio: ((data.result.length / input.length) * 100).toFixed(1),
      });
      if (data.user) setLocalUser(data.user);
    } catch (e: any) {
      setOutput('// ERROR: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    const text = document.getElementById('output-code')?.textContent || '';
    if (!text || text.includes('// Encrypted result')) return;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const old = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> COPIED!';
      setTimeout(() => (btn.innerHTML = old), 1500);
    }
  }

  function downloadOutput() {
    const text = document.getElementById('output-code')?.textContent || '';
    if (!text || text.includes('// Encrypted result')) return;
    const blob = new Blob([text], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `encrypted_${fileName}` : `encrypted_${Date.now()}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const isCustom = mode === 'customname';
  const creditText = localUser
    ? localUser.plan === 'max'
      ? '∞ MAX'
      : localUser.plan.startsWith('premium')
      ? '∞ PREMIUM'
      : `Used: ${localUser.dailyUsed}/5`
    : 'Login required';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <label className="retro-label"><i className="fas fa-lock"></i> PILIH TIPE ENKRIPSI</label>
        <div style={{ fontSize: '8px', color: '#ff00ff', border: '1px solid #ff00ff', padding: '4px 8px' }}>
          <i className="fas fa-coins"></i> {creditText}
        </div>
      </div>

      <div className="enc-type-grid">
        {ENCRYPTION_TYPES.map((t) => (
          <button
            key={t.id}
            className={`enc-type-btn ${mode === t.id ? 'selected' : ''}`}
            onClick={() => setMode(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isCustom && (
        <div style={{ marginBottom: '16px' }}>
          <label className="retro-label"><i className="fas fa-tag"></i> CUSTOM NAME</label>
          <input
            className="auth-input"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '9px' }}
            placeholder="e.g. Pprimrosereyy"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <div style={{ fontSize: '7px', color: '#666', marginTop: '4px' }}>
            <i className="fas fa-circle-info"></i> Base64 chunks akan diselipin di akhir nama ini. Cost: 2 credits.
          </div>
        </div>
      )}

      <div className="retro-grid">
        <div>
          <label className="retro-label"><i className="fas fa-file-code"></i> INPUT CODE.JS</label>
          <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
            <i className="fas fa-cloud-arrow-up"></i>
            <span>{fileName || 'Klik untuk upload file .js'}</span>
            <input ref={fileInputRef} type="file" accept=".js" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>
          <textarea
            className="retro-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"// Atau paste kode JS di sini...\nconst hello = 'world';\nconsole.log(hello);\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst regex = /test/gi;\nrequire('fs');"}
          />
        </div>
        <div>
          <label className="retro-label"><i className="fas fa-file-shield"></i> OUTPUT ENCRYPTED</label>
          <pre className="retro-output" id="output-code">{output}</pre>
          <div className="retro-stats">
            <span><i className="fas fa-ruler-horizontal"></i> ORIG: {stats.orig}b</span>
            <span><i className="fas fa-ruler-combined"></i> NEW: {stats.new}b</span>
            <span><i className="fas fa-percent"></i> RATIO: {stats.ratio}%</span>
          </div>
          <div className="output-actions">
            <button className="copy-btn" id="copy-btn" onClick={copyOutput}>
              <i className="fas fa-copy"></i> COPY
            </button>
            <button className="download-btn" onClick={downloadOutput}>
              <i className="fas fa-download"></i> DOWNLOAD .JS
            </button>
          </div>
        </div>
      </div>

      <button className="retro-action-btn" onClick={runEncrypt} disabled={loading}>
        {loading ? '<i class="fas fa-spinner fa-spin"></i> ENCRYPTING...' : '<i class="fas fa-bolt"></i> JALANKAN ENKRIPSI'}
      </button>
    </div>
  );
}
