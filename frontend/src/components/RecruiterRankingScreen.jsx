import React, { useEffect, useState } from 'react';
import { getRanking, parseResume, extractSkills, matchCandidateToJob } from '../services/aiApi';

function ScoreRing({ score }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#22d9d9' : score >= 70 ? '#e8bb4e' : '#e07a5f';
  return (
    <div style={{ position: 'relative', width: 58, height: 58 }}>
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <circle
          cx="29"
          cy="29"
          r={radius}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 29 29)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#eaf1f8'
        }}
      >
        {score}
      </div>
    </div>
  );
}

export function RecruiterRankingScreen() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getRanking('job-frontend-2026').then((res) => {
      if (!active) return;
      setCandidates(res.candidates);
      setLoading(false);
      setSelectedId(res.candidates[0]?.id ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    setDetailLoading(true);
    Promise.all([parseResume(selectedId), extractSkills(selectedId), matchCandidateToJob(selectedId)]).then(
      ([parsed, skills, match]) => {
        if (!active) return;
        setDetail({ parsed, skills, match });
        setDetailLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectedCandidate = candidates.find((c) => c.id === selectedId);

  return (
    <div className="rr-screen">
      <style>{`
        .rr-screen { display: grid; gap: 20px; }
        .rr-header { display: flex; align-items: center; justify-content: space-between; }
        .rr-title { font-size: 20px; font-weight: 800; margin: 0; }
        .rr-subtitle { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; }
        .rr-job-select {
          background: var(--bg-inset);
          border: 1px solid var(--border);
          color: var(--text-primary);
          border-radius: 10px;
          padding: 9px 14px;
          font-size: 12px;
        }
        .rr-body { display: grid; grid-template-columns: minmax(0,1fr) 320px; gap: 20px; }
        .rr-list { display: grid; gap: 12px; }
        .rr-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px 18px;
          cursor: pointer;
          transition: border-color 0.15s ease;
        }
        .rr-card[data-active="true"] { border-color: rgba(34,217,217,0.5); }
        .rr-rank { width: 26px; font-size: 12px; color: var(--text-tertiary); font-weight: 700; }
        .rr-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg,#c46bd0,#7a3fa8);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .rr-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .rr-role { font-size: 12px; color: var(--text-tertiary); margin-top: 2px; }
        .rr-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .rr-tag {
          font-size: 10px; color: var(--teal); background: rgba(34,217,217,0.1);
          padding: 3px 8px; border-radius: 20px; font-weight: 600;
        }
        .rr-panel {
          background: var(--bg-panel); border: 1px solid var(--border);
          border-radius: 18px; padding: 20px; align-self: start;
        }
        .rr-panel-title { font-size: 14px; font-weight: 700; margin: 0 0 4px 0; }
        .rr-panel-sub { font-size: 11px; color: var(--text-tertiary); margin-bottom: 16px; }
        .rr-section-label {
          font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
          color: var(--text-tertiary); margin: 16px 0 8px 0;
        }
        .rr-field-row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid var(--border); }
        .rr-field-row span:first-child { color: var(--text-tertiary); }
        .rr-field-row span:last-child { color: var(--text-primary); font-weight: 600; }
        .rr-skill-chip {
          display: flex; justify-content: space-between; align-items: center;
          background: var(--bg-inset); border: 1px solid var(--border);
          border-radius: 10px; padding: 7px 10px; font-size: 11px; margin-bottom: 6px;
        }
        .rr-skill-bar-track { width: 60px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
        .rr-skill-bar-fill { height: 100%; background: var(--teal); }
        .rr-match-badge {
          display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 20px; font-weight: 700; margin: 2px 4px 2px 0;
        }
        .rr-match-badge.hit { background: rgba(34,217,217,0.12); color: var(--teal); }
        .rr-match-badge.miss { background: rgba(224,122,95,0.12); color: #e07a5f; }
        .rr-loading { color: var(--text-tertiary); font-size: 12px; padding: 30px; text-align: center; }
        @media (max-width: 900px) {
          .rr-body { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rr-header">
        <div>
          <h2 className="rr-title">Recruiter AI Ranking</h2>
          <div className="rr-subtitle">Candidates ranked by AI match score for the open role</div>
        </div>
        <select className="rr-job-select" defaultValue="frontend">
          <option value="frontend">Frontend Engineer — Req #2026-14</option>
          <option value="pm">Product Manager — Req #2026-09</option>
        </select>
      </div>

      <div className="rr-body">
        <div className="rr-list">
          {loading && <div className="rr-loading">Ranking candidates with AI…</div>}
          {!loading &&
            candidates.map((c, idx) => (
              <div
                key={c.id}
                className="rr-card"
                data-active={c.id === selectedId}
                onClick={() => setSelectedId(c.id)}
              >
                <div className="rr-rank">#{idx + 1}</div>
                <div className="rr-avatar">{c.initials}</div>
                <div style={{ flex: 1 }}>
                  <div className="rr-name">{c.name}</div>
                  <div className="rr-role">{c.role} · {c.experienceYears} yrs exp</div>
                  <div className="rr-tags">
                    {c.matchedSkills.slice(0, 3).map((s) => (
                      <span key={s} className="rr-tag">{s}</span>
                    ))}
                  </div>
                </div>
                <ScoreRing score={c.matchScore} />
              </div>
            ))}
        </div>

        <div className="rr-panel">
          {!selectedCandidate && <div className="rr-loading">Select a candidate</div>}
          {selectedCandidate && (
            <>
              <h3 className="rr-panel-title">{selectedCandidate.name}</h3>
              <div className="rr-panel-sub">AI Insights & Analytics</div>

              {detailLoading && <div className="rr-loading">Parsing resume & extracting skills…</div>}

              {!detailLoading && detail && (
                <>
                  <div className="rr-section-label">Resume Parsing</div>
                  <div className="rr-field-row"><span>Email</span><span>{detail.parsed.email}</span></div>
                  <div className="rr-field-row"><span>Experience</span><span>{detail.parsed.experienceYears} yrs</span></div>
                  <div className="rr-field-row"><span>Education</span><span style={{ textAlign: 'right', maxWidth: 170 }}>{detail.parsed.education}</span></div>

                  <div className="rr-section-label">Extracted Skills</div>
                  {detail.skills.map((s) => (
                    <div className="rr-skill-chip" key={s.skill}>
                      <span>{s.skill}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="rr-skill-bar-track">
                          <div className="rr-skill-bar-fill" style={{ width: `${Math.round(s.confidence * 100)}%` }} />
                        </div>
                        <span style={{ color: 'var(--text-tertiary)' }}>{Math.round(s.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}

                  <div className="rr-section-label">Candidate–Job Match</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--teal)', marginBottom: 8 }}>
                    {detail.match.matchScore}% match
                  </div>
                  <div>
                    {detail.match.matchedSkills.map((s) => (
                      <span key={s} className="rr-match-badge hit">✓ {s}</span>
                    ))}
                    {detail.match.missingSkills.map((s) => (
                      <span key={s} className="rr-match-badge miss">✕ {s}</span>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecruiterRankingScreen;
