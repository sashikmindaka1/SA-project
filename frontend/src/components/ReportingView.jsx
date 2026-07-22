import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getReportSummary } from '../services/aiApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function exportCsv(rows) {
  const header = ['Report', 'Type', 'Generated'];
  const lines = [header.join(','), ...rows.map((r) => [r.report, r.type, r.generated].join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hiring_reports.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportingView() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getReportSummary().then(setData);
  }, []);

  const chartData = data && {
    labels: data.hiresOverTime.map((d) => d.month),
    datasets: [
      {
        data: data.hiresOverTime.map((d) => d.hires),
        backgroundColor: '#22d9d9',
        borderRadius: 6,
        maxBarThickness: 30
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#5c7086', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#5c7086', font: { size: 11 } } }
    }
  };

  return (
    <div className="rp-screen">
      <style>{`
        .rp-screen { display: grid; gap: 20px; }
        .rp-header { display: flex; align-items: center; justify-content: space-between; }
        .rp-title { font-size: 20px; font-weight: 800; margin: 0; }
        .rp-subtitle { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; }
        .rp-export-btn {
          background: var(--teal); color: #08101b; border: none; font-weight: 700;
          font-size: 12px; padding: 10px 16px; border-radius: 10px; cursor: pointer;
        }
        .rp-kpis { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
        .rp-kpi-card {
          background: var(--bg-panel); border: 1px solid var(--border);
          border-radius: 16px; padding: 18px;
        }
        .rp-kpi-label { font-size: 11px; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
        .rp-kpi-value { font-size: 26px; font-weight: 800; color: var(--text-primary); }
        .rp-row { display: grid; grid-template-columns: 1.1fr 1fr; gap: 20px; }
        .rp-panel { background: var(--bg-panel); border: 1px solid var(--border); border-radius: 18px; padding: 20px; }
        .rp-panel-title { font-size: 14px; font-weight: 700; margin: 0 0 14px 0; }
        .rp-table { width: 100%; border-collapse: collapse; }
        .rp-table th { text-align: left; font-size: 10px; color: var(--text-tertiary); text-transform: uppercase; padding: 0 0 8px 0; }
        .rp-table td { font-size: 12px; padding: 10px 0; border-top: 1px solid var(--border); color: var(--text-primary); }
        .rp-type-tag { font-size: 10px; padding: 3px 9px; border-radius: 20px; background: rgba(34,217,217,0.1); color: var(--teal); font-weight: 600; }
        @media (max-width: 900px) {
          .rp-kpis { grid-template-columns: repeat(2, minmax(0,1fr)); }
          .rp-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rp-header">
        <div>
          <h2 className="rp-title">Reporting</h2>
          <div className="rp-subtitle">Hiring pipeline reports pulled from the analytics endpoints</div>
        </div>
        {data && <button className="rp-export-btn" onClick={() => exportCsv(data.reportRows)}>Export CSV</button>}
      </div>

      {!data && <div style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>Loading report data…</div>}

      {data && (
        <>
          <div className="rp-kpis">
            <div className="rp-kpi-card">
              <div className="rp-kpi-label">Applications</div>
              <div className="rp-kpi-value">{data.totalApplications}</div>
            </div>
            <div className="rp-kpi-card">
              <div className="rp-kpi-label">Interviews</div>
              <div className="rp-kpi-value">{data.totalInterviews}</div>
            </div>
            <div className="rp-kpi-card">
              <div className="rp-kpi-label">Hires</div>
              <div className="rp-kpi-value">{data.totalHires}</div>
            </div>
            <div className="rp-kpi-card">
              <div className="rp-kpi-label">Avg. Time to Fill</div>
              <div className="rp-kpi-value">{data.avgTimeToFillDays}d</div>
            </div>
          </div>

          <div className="rp-row">
            <div className="rp-panel">
              <h3 className="rp-panel-title">Hires Over Time</h3>
              <div style={{ height: 220 }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
            <div className="rp-panel">
              <h3 className="rp-panel-title">Generated Reports</h3>
              <table className="rp-table">
                <thead>
                  <tr><th>Report</th><th>Type</th><th>Generated</th></tr>
                </thead>
                <tbody>
                  {data.reportRows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.report}</td>
                      <td><span className="rp-type-tag">{r.type}</span></td>
                      <td>{r.generated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportingView;
