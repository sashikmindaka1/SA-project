import React, { useState, useEffect } from 'react';

export default function EvaluationForm() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [technicalDepth, setTechnicalDepth] = useState(75);
  const [systemDesign, setSystemDesign] = useState(60);
  const [communication, setCommunication] = useState(80);
  const [cultureAlignment, setCultureAlignment] = useState(90);
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch list of candidates/interviews on load to populate the dropdown
  useEffect(() => {
    // UPDATED: Now pointing to HTTP and port 5016
    fetch('http://localhost:5016/api/Interview')
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch((err) => console.error('Failed to load candidates', err));
  }, []);

  const overallMatchScore = Math.round(
    (technicalDepth * 0.4) +
    (systemDesign * 0.3) +
    (communication * 0.2) +
    (cultureAlignment * 0.1)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert('Please select a candidate to evaluate.');
      return;
    }

    setSubmitting(true);

    try {
      // UPDATED: Now pointing to HTTP and port 5016
      const response = await fetch('http://localhost:5016/api/Evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: selectedCandidate,
          technicalDepthScore: technicalDepth,
          systemDesignScore: systemDesign,
          communicationScore: communication,
          cultureAlignmentScore: cultureAlignment,
          executiveSummary: summary,
          overallMatchScore: overallMatchScore
        })
      });

      if (response.ok) {
        alert('Official evaluation saved for ' + selectedCandidate + '!');
        // Optional: Reset form fields here if you want
      }
    } catch (err) {
      console.error('Failed to submit evaluation', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#131b26] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Evaluation Matrix</h3>
        
        <div className="bg-[#0b111a] border border-slate-800 rounded-xl p-3 flex items-center gap-4">
          <div>
            <div className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">Match Score</div>
            <div className="text-xl font-extrabold text-white mt-0.5">{overallMatchScore}%</div>
          </div>
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-300"
                strokeWidth="3.5"
                strokeDasharray={`${overallMatchScore}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Candidate Selector Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Select Candidate</label>
          <select 
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="w-full bg-[#0b111a] border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-cyan-400 outline-none transition-all cursor-pointer"
          >
            <option value="">-- Choose Candidate from Pipeline --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.candidateName}>
                {c.candidateName} ({c.candidateRole})
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>TECHNICAL DEPTH (40%)</span>
            <span className="text-cyan-400 font-bold">{technicalDepth}</span>
          </div>
          <input 
            type="range" min="0" max="100" value={technicalDepth} 
            onChange={(e) => setTechnicalDepth(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>SYSTEM DESIGN (30%)</span>
            <span className="text-cyan-400 font-bold">{systemDesign}</span>
          </div>
          <input 
            type="range" min="0" max="100" value={systemDesign} 
            onChange={(e) => setSystemDesign(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>COMMUNICATION (20%)</span>
            <span className="text-cyan-400 font-bold">{communication}</span>
          </div>
          <input 
            type="range" min="0" max="100" value={communication} 
            onChange={(e) => setCommunication(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
            <span>CULTURE ALIGNMENT (10%)</span>
            <span className="text-cyan-400 font-bold">{cultureAlignment}</span>
          </div>
          <input 
            type="range" min="0" max="100" value={cultureAlignment} 
            onChange={(e) => setCultureAlignment(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Executive Summary</label>
          <textarea 
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Detail the candidate's core strengths..."
            className="w-full bg-[#0b111a] border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-cyan-400 outline-none resize-none transition-all"
          />
        </div>

        <button 
          type="submit"
          disabled={submitting}
          className="w-full bg-cyan-500/10 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#0b111a] font-bold py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] uppercase tracking-wider text-sm"
        >
          {submitting ? 'Submitting Evaluation...' : 'Submit Official Evaluation'}
        </button>
      </form>
    </div>
  );
}