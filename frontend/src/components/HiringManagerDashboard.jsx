import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler);

const candidates = [
  { name: 'Sarah Perera', role: 'UI/UX Designer', time: '2:00 PM', initials: 'SP' },
  { name: 'Sarah Perera', role: 'UI/UX Designer', time: '2:00 PM', initials: 'SP' }
];

function StarRow({ label, value, onChange }) {
  return (
    <div className="star-row">
      <span className="star-row-label">{label}</span>
      <div className="star-row-stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className="star"
            onClick={() => onChange(n)}
            style={{ color: n <= value ? 'var(--gold)' : 'rgba(255,255,255,0.18)' }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

function Toggle({ active }) {
  return (
    <div className="pill-toggle" data-active={active}>
      <span>{active}</span>
    </div>
  );
}

export function HiringManagerDashboard() {
  const [scores, setScores] = useState({ technical: 4, teamFit: 3, communication: 4 });
  const [comment, setComment] = useState('');
  const [tab, setTab] = useState('Upcoming');
  const [kpiComment, setKpiComment] = useState('');
  const [toast, setToast] = useState('');
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSendEvaluation = () => {
    if (!comment.trim()) {
      showToast('Please add a comment before sending.');
      return;
    }
    console.log('Evaluation submitted:', { scores, comment });
    showToast('Evaluation sent successfully.');
    setComment('');
  };

  const handleSendKpiComment = () => {
    if (!kpiComment.trim()) {
      showToast('Please add a comment before sending.');
      return;
    }
    console.log('KPI comment submitted:', kpiComment);
    showToast('Comment sent successfully.');
    setKpiComment('');
  };

  const handleMenuAction = (action, candidateName) => {
    setOpenMenuIndex(null);
    showToast(`${action}: ${candidateName}`);
  };

  const lineData = {
    labels: ['1 Wk', '2 Wk', '3 Wk', '4 Wk', '5 Wk'],
    datasets: [
      {
        data: [58, 92, 40, 100, 78],
        borderColor: '#22d9d9',
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
          g.addColorStop(0, 'rgba(34, 217, 217, 0.35)');
          g.addColorStop(1, 'rgba(34, 217, 217, 0)');
          return g;
        },
        fill: true,
        tension: 0.45,
        pointRadius: 3,
        pointBackgroundColor: '#22d9d9',
        pointBorderColor: '#0d1826',
        pointBorderWidth: 2,
        borderWidth: 2
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { intersect: false, mode: 'index' } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5c7086', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#5c7086', font: { size: 11 } } }
    }
  };

  const sourceData = {
    labels: ['LinkedIn', 'Referral', 'Job Board', 'Career Site', 'Other'],
    datasets: [
      {
        data: [420, 300, 260, 180, 90],
        backgroundColor: '#22d9d9',
        borderRadius: 6,
        maxBarThickness: 26
      }
    ]
  };

  const skillData = {
    labels: ['Python', 'React', 'Node', 'SQL', 'Design'],
    datasets: [
      {
        data: [92, 78, 85, 70, 60],
        backgroundColor: '#22d9d9',
        borderRadius: 6,
        maxBarThickness: 26
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5c7086', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#5c7086', font: { size: 10 } } }
    }
  };

  return (
    <div className="hm-dashboard">
      <style>{`
        .hm-dashboard {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: 0 24px 60px rgba(0,0,0,0.45);
          overflow: hidden;
        }
        .hm-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          border-bottom: 1px solid var(--border);
        }
        .hm-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          font-size: 17px;
          color: var(--text-primary);
        }
        .hm-logo .dot {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--teal), #0f5f5f);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
        .hm-logo span.flow { color: var(--teal); }
        .hm-topbar-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .hm-bell {
          color: var(--text-secondary);
          font-size: 16px;
        }
        .hm-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hm-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3c5a76, #1c2c3d);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }
        .hm-user-meta { line-height: 1.3; }
        .hm-user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .hm-user-role { font-size: 11px; color: var(--text-tertiary); }

        .hm-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
        }
        .hm-main {
          padding: 22px;
          display: grid;
          gap: 20px;
        }
        .hm-row {
          display: grid;
          gap: 20px;
        }
        .hm-row.top { grid-template-columns: minmax(0,1fr) 300px; }
        .hm-row.mid { grid-template-columns: 300px minmax(0,1fr); }
        .hm-row.bottom { grid-template-columns: 1fr 1fr; }

        .hm-panel {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
        }
        .hm-panel-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 14px 0;
        }
        .hm-panel-subtitle {
          font-size: 11px;
          color: var(--text-tertiary);
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .hm-tabs {
          display: flex;
          gap: 18px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 10px;
        }
        .hm-tab {
          background: none;
          border: none;
          color: var(--text-tertiary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .hm-tab[data-active="true"] {
          color: var(--teal);
        }

        .hm-table-head {
          display: grid;
          grid-template-columns: 1fr 90px 20px;
          font-size: 11px;
          color: var(--text-tertiary);
          padding: 0 14px 10px 14px;
        }
        .hm-candidate-row {
          display: grid;
          grid-template-columns: 1fr 90px 20px;
          align-items: center;
          background: var(--bg-inset);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 12px 14px;
          margin-bottom: 12px;
        }
        .hm-candidate-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hm-candidate-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f0a5c4, #c46bd0);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #2a0f22;
        }
        .hm-candidate-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
        .hm-candidate-role { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
        .hm-candidate-time { font-size: 12px; color: var(--text-secondary); font-weight: 600; }
        .hm-candidate-menu { color: var(--text-tertiary); text-align: right; cursor: pointer; padding: 4px 8px; }
        .hm-menu-dropdown {
          position: absolute;
          right: 0;
          top: 26px;
          background: var(--bg-panel);
          border: 1px solid var(--border-strong);
          border-radius: 12px;
          overflow: hidden;
          z-index: 10;
          min-width: 150px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
        }
        .hm-menu-dropdown div {
          padding: 10px 14px;
          font-size: 12px;
          color: var(--text-primary);
          cursor: pointer;
          white-space: nowrap;
        }
        .hm-menu-dropdown div:hover { background: rgba(34,217,217,0.1); color: var(--teal); }

        .hm-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--teal);
          color: #08101b;
          font-size: 13px;
          font-weight: 700;
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          z-index: 50;
        }

        .hm-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--teal);
          background: rgba(34,217,217,0.12);
          padding: 4px 10px;
          border-radius: 20px;
        }
        .hm-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .star-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .star-row-label { font-size: 12px; color: var(--text-secondary); }
        .star-row-stars { display: flex; gap: 3px; }
        .star { font-size: 15px; cursor: pointer; }

        .hm-comments-label { font-size: 11px; color: var(--text-tertiary); margin: 14px 0 6px 0; }
        .hm-textarea {
          width: 100%;
          min-height: 56px;
          background: var(--bg-inset);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 12px;
          padding: 10px 12px;
          resize: none;
        }
        .hm-send-btn {
          margin-top: 14px;
          width: 100%;
          background: var(--teal);
          color: #08101b;
          border: none;
          font-weight: 700;
          font-size: 13px;
          padding: 11px;
          border-radius: 12px;
          cursor: pointer;
        }

        .hm-kpi-field { margin-bottom: 14px; }
        .hm-kpi-label { font-size: 11px; color: var(--text-tertiary); margin-bottom: 6px; }
        .hm-kpi-value-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-inset);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 12px;
          color: var(--text-primary);
        }
        .hm-kpi-chevron { color: var(--text-tertiary); font-size: 10px; }
        .hm-kpi-textarea {
          width: 100%;
          min-height: 44px;
          background: var(--bg-inset);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 12px;
          padding: 9px 12px;
          resize: none;
        }
        .hm-kpi-send {
          margin-top: 4px;
          width: 100%;
          background: var(--teal);
          color: #08101b;
          border: none;
          font-weight: 700;
          font-size: 12px;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
        }

        .hm-chart-wrap { height: 200px; }
        .hm-chart-wrap.small { height: 170px; }

        @media (max-width: 900px) {
          .hm-row.top, .hm-row.mid, .hm-row.bottom { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="hm-topbar">
        <div className="hm-logo">
          <span className="dot">◆</span>
          Talent<span className="flow">Flow</span> AI
        </div>
        <div className="hm-topbar-right">
          <span className="hm-bell">🔔</span>
          <div className="hm-user">
            <div className="hm-avatar">DW</div>
            <div className="hm-user-meta">
              <div className="hm-user-name">Module Leader</div>
              <div className="hm-user-role">Mr. Diluka Wijesinghe</div>
            </div>
            <span className="hm-kpi-chevron">▾</span>
          </div>
        </div>
      </div>

      <div className="hm-body">
        <main className="hm-main">
          <div className="hm-row top">
            <div className="hm-panel">
              <h3 className="hm-panel-title">My Interviews</h3>
              <div className="hm-tabs">
                {['Upcoming', 'Previous', 'Events'].map((t) => (
                  <button key={t} className="hm-tab" data-active={tab === t} onClick={() => setTab(t)}>
                    {t}{t === 'Upcoming' ? ` (${candidates.length})` : ''}
                  </button>
                ))}
              </div>
              <div className="hm-table-head">
                <span>Candidate</span>
                <span>Schedule</span>
                <span></span>
              </div>
              {candidates.map((c, i) => (
                <div className="hm-candidate-row" key={i}>
                  <div className="hm-candidate-info">
                    <div className="hm-candidate-avatar">{c.initials}</div>
                    <div>
                      <div className="hm-candidate-name">{c.name}</div>
                      <div className="hm-candidate-role">{c.role}</div>
                    </div>
                  </div>
                  <div className="hm-candidate-time">{c.time}</div>
                  <div style={{ position: 'relative' }}>
                    <div
                      className="hm-candidate-menu"
                      onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
                    >
                      ⋮
                    </div>
                    {openMenuIndex === i && (
                      <div className="hm-menu-dropdown">
                        <div onClick={() => handleMenuAction('Viewing profile', c.name)}>View Profile</div>
                        <div onClick={() => handleMenuAction('Rescheduling', c.name)}>Reschedule</div>
                        <div onClick={() => handleMenuAction('Cancelled interview', c.name)}>Cancel Interview</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="hm-panel">
              <div className="hm-form-header">
                <h3 className="hm-panel-title" style={{ margin: 0 }}>Form</h3>
                <span className="hm-badge">1 candidate</span>
              </div>
              <p className="hm-panel-subtitle" style={{ marginBottom: 12 }}>Evaluation Scoring</p>
              <StarRow label="Technical" value={scores.technical} onChange={(v) => setScores((s) => ({ ...s, technical: v }))} />
              <StarRow label="Team Fit" value={scores.teamFit} onChange={(v) => setScores((s) => ({ ...s, teamFit: v }))} />
              <StarRow label="Communication" value={scores.communication} onChange={(v) => setScores((s) => ({ ...s, communication: v }))} />
              <div className="hm-comments-label">Comments</div>
              <textarea
                className="hm-textarea"
                placeholder="Type evaluation comments..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="hm-send-btn" onClick={handleSendEvaluation}>Send</button>
            </div>
          </div>

          <div className="hm-row mid">
            <div className="hm-panel">
              <h3 className="hm-panel-title">Recruitment KPIs</h3>
              <p className="hm-panel-subtitle" style={{ marginBottom: 14 }}>Recruitment data analytics</p>

              <div className="hm-kpi-field">
                <div className="hm-kpi-label">Technical</div>
                <div className="hm-kpi-value-row">1 message <span className="hm-kpi-chevron">▾</span></div>
              </div>
              <div className="hm-kpi-field">
                <div className="hm-kpi-label">Team Fit</div>
                <div className="hm-kpi-value-row">Form Sent <span className="hm-kpi-chevron">▾</span></div>
              </div>
              <div className="hm-kpi-field">
                <div className="hm-kpi-label">Communication</div>
                <div className="hm-kpi-value-row">1–5 <span className="hm-kpi-chevron">▾</span></div>
              </div>
              <div className="hm-kpi-field">
                <div className="hm-kpi-label">Applicant</div>
                <div className="hm-kpi-value-row">Score <span className="hm-kpi-chevron">▾</span></div>
              </div>
              <div className="hm-kpi-field">
                <div className="hm-kpi-label">Comments</div>
                <textarea
                  className="hm-kpi-textarea"
                  placeholder="Type a comment..."
                  value={kpiComment}
                  onChange={(e) => setKpiComment(e.target.value)}
                />
              </div>
              <button className="hm-kpi-send" onClick={handleSendKpiComment}>Send</button>
            </div>

            <div className="hm-panel">
              <h3 className="hm-panel-title">Time to Hire Trend</h3>
              <div className="hm-chart-wrap">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>

          <div className="hm-row bottom">
            <div className="hm-panel">
              <h3 className="hm-panel-title">Applicant Source Breakdown</h3>
              <div className="hm-chart-wrap small">
                <Bar data={sourceData} options={barOptions} />
              </div>
            </div>
            <div className="hm-panel">
              <h3 className="hm-panel-title">Skill Match Success Rate</h3>
              <div className="hm-chart-wrap small">
                <Bar data={skillData} options={barOptions} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {toast && <div className="hm-toast">{toast}</div>}
    </div>
  );
}

export default HiringManagerDashboard;
