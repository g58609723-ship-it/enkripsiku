'use client';

import { useState, useEffect } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  glow: string;
}

interface CreditsPanelProps {
  user: any;
}

export default function CreditsPanel({ user }: CreditsPanelProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/credits')
      .then((r) => r.json())
      .then((data) => {
        setPlans(data.plans || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentPlan = user?.plan || 'free';
  const planNames: Record<string, string> = {
    free: 'FREE',
    premium_monthly: 'PREMIUM / MONTH',
    premium_yearly: 'PREMIUM / YEAR',
    max: 'MAX',
  };

  function getPlanColor(planId: string) {
    const p = plans.find((x) => x.id === planId);
    return p?.color || '#00ff41';
  }

  function getPlanGlow(planId: string) {
    const p = plans.find((x) => x.id === planId);
    return p?.glow || '0 0 20px #00ff4133';
  }

  function openTelegram(planId: string) {
    const prices: Record<string, string> = {
      premium_monthly: 'PREMIUM_MONTHLY_15000',
      premium_yearly: 'PREMIUM_YEARLY_100000',
      max: 'MAX_200000',
    };
    const msg = `Halo Primrosereyy, saya mau beli plan ${planId} (${prices[planId]}) untuk akun ${user?.username || 'saya'}.`;
    window.open(`https://t.me/xberlianmine?text=${encodeURIComponent(msg)}`, '_blank');
  }

  if (loading) {
    return (
      <div className="retro-about-box" style={{ textAlign: 'center', padding: '40px' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '20px', color: '#00ff41' }}></i>
        <p style={{ fontSize: '10px', marginTop: '12px' }}>LOADING PLANS...</p>
      </div>
    );
  }

  return (
    <div>
      {/* CURRENT PLAN CARD */}
      <div
        className="plan-card current"
        style={{
          borderColor: getPlanColor(currentPlan),
          boxShadow: getPlanGlow(currentPlan),
        }}
      >
        <div className="plan-badge" style={{ background: getPlanColor(currentPlan) }}>
          <i className="fas fa-crown"></i> CURRENT PLAN
        </div>
        <h2 style={{ color: getPlanColor(currentPlan), textShadow: `0 0 10px ${getPlanColor(currentPlan)}66` }}>
          {planNames[currentPlan] || 'FREE'}
        </h2>
        <div className="plan-stats">
          <div className="plan-stat">
            <span className="plan-stat-label">CREDITS</span>
            <span className="plan-stat-value" style={{ color: getPlanColor(currentPlan) }}>
              {user?.plan === 'max' ? '∞' : user?.plan?.startsWith('premium') ? '∞' : `${5 - (user?.dailyUsed || 0)} / 5`}
            </span>
          </div>
          <div className="plan-stat">
            <span className="plan-stat-label">DAILY USED</span>
            <span className="plan-stat-value">{user?.dailyUsed || 0}</span>
          </div>
          <div className="plan-stat">
            <span className="plan-stat-label">RATE LIMIT</span>
            <span className="plan-stat-value">
              {currentPlan === 'max' ? '5s' : currentPlan.startsWith('premium') ? '10s' : '30s'}
            </span>
          </div>
        </div>
        {user?.premiumExpiry && (
          <div style={{ fontSize: '7px', color: '#888', marginTop: '8px' }}>
            <i className="fas fa-clock"></i> Expires: {new Date(user.premiumExpiry).toLocaleDateString('id-ID')}
          </div>
        )}
      </div>

      {/* PLAN OPTIONS */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#ff00ff', fontSize: '10px', marginBottom: '16px', textShadow: '1px 1px #660066' }}>
          <i className="fas fa-cart-shopping"></i> UPGRADE PLAN
        </h3>
        <div className="plans-grid">
          {plans
            .filter((p) => p.id !== 'free')
            .map((plan) => (
              <div
                key={plan.id}
                className="plan-card"
                style={{
                  borderColor: plan.color,
                  boxShadow: plan.glow,
                }}
              >
                <h4 style={{ color: plan.color, textShadow: `0 0 8px ${plan.color}44` }}>{plan.name}</h4>
                <div className="plan-price" style={{ color: plan.color }}>
                  Rp {plan.price.toLocaleString('id-ID')}
                </div>
                <ul className="plan-features">
                  {plan.features.map((feat, i) => (
                    <li key={i}><i className="fas fa-check" style={{ color: plan.color }}></i> {feat}</li>
                  ))}
                </ul>
                <button
                  className="plan-buy-btn"
                  style={{
                    background: plan.color,
                    borderColor: plan.color,
                    boxShadow: `4px 4px 0 ${plan.color}44`,
                  }}
                  onClick={() => openTelegram(plan.id)}
                >
                  <i className="fas fa-paper-plane"></i> BELI via TELEGRAM
                </button>
              </div>
            ))}
        </div>
      </div>

      <style jsx>{`
        .plan-card {
          background: #0a0a0a;
          border: 2px solid;
          padding: 16px;
          margin-bottom: 16px;
          transition: all 0.3s;
        }
        .plan-card.current {
          position: relative;
          overflow: hidden;
        }
        .plan-card.current::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          animation: pulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .plan-badge {
          display: inline-block;
          color: #000;
          font-size: 7px;
          padding: 3px 8px;
          margin-bottom: 8px;
        }
        .plan-card h2 {
          font-size: 14px;
          margin: 0 0 12px 0;
        }
        .plan-card h4 {
          font-size: 10px;
          margin: 0 0 8px 0;
        }
        .plan-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .plan-stat {
          text-align: center;
        }
        .plan-stat-label {
          display: block;
          font-size: 6px;
          color: #666;
          margin-bottom: 4px;
        }
        .plan-stat-value {
          font-size: 12px;
          color: #00ff41;
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .plan-price {
          font-size: 14px;
          margin: 8px 0;
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 12px 0;
        }
        .plan-features li {
          font-size: 8px;
          color: #ccc;
          margin-bottom: 6px;
          line-height: 1.6;
        }
        .plan-buy-btn {
          width: 100%;
          padding: 10px;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          color: #000;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.1s;
        }
        .plan-buy-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0;
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  );
}
