import { useState, useEffect } from 'react'
import ErpLayout from '../components/ErpLayout'
import { fetchPerformanceAnalytics, predictCgpa } from '../services/api'
import { TrendingUp, AlertTriangle, CheckCircle, BarChart2, Target } from 'lucide-react'

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [predictMode, setPredictMode] = useState(false)
  const [expectedMarks, setExpectedMarks] = useState({})
  const [simResult, setSimResult] = useState(null)

  useEffect(() => {
    fetchPerformanceAnalytics().then(res => {
      setData(res)
      setLoading(false)
      
      const defaultMarks = {}
      if (res && res.subjects) {
        res.subjects.forEach(s => defaultMarks[s.subject_id] = s.total_marks)
      }
      setExpectedMarks(defaultMarks)
    }).catch(() => null)
  }, [])

  const handlePredict = async () => {
    try {
      const res = await predictCgpa(expectedMarks)
      setSimResult(res)
      setPredictMode(false)
    } catch (e) { alert("Failed to simulate") }
  }

  if (loading) return (
    <div className="page-loader">
       <div className="loader-card"><h2>Studvisor</h2><p>Loading Deep Analytics...</p></div>
    </div>
  )

  const { metrics, risk_flags, cgpa_trend, subjects } = data

  const maxCgpa = 10
  const chartHeight = 200
  const chartWidth = 800

  const normalizeY = (val) => chartHeight - ((val / maxCgpa) * chartHeight)
  const stepX = cgpa_trend.length > 1 ? chartWidth / (cgpa_trend.length - 1) : 0

  const sgpaPoints = cgpa_trend.map((d, i) => `${i * stepX},${normalizeY(d.sgpa)}`).join(' ')
  const cgpaPoints = cgpa_trend.map((d, i) => `${i * stepX},${normalizeY(d.cgpa)}`).join(' ')

  return (
    <ErpLayout title="Performance Analytics" subtitle="AI-driven academic metrics and predictive models">
      
      <div className="dashboard-grid analytics-summary-grid">
        <div className="card info-card">
          <div className="info-card-title">Cumulative GPA</div>
          <div className="info-card-value">{metrics.current_cgpa}</div>
          <div className="info-card-subtitle">Out of {maxCgpa}.0</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Completed Credits</div>
          <div className="info-card-value">{metrics.total_credits_earned}</div>
          <div className="info-card-subtitle">Across {cgpa_trend.length} semesters</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Current Standing</div>
          <div className="info-card-value" style={{ fontSize: '1.4rem' }}>{metrics.standing}</div>
          <div className="info-card-subtitle" style={{ color: metrics.standing.includes('Good') ? '#6ee7b7' : '#fca5a5' }}>Academic Status</div>
        </div>
      </div>

      <div className="dashboard-lower-grid" style={{ gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)' }}>
        
        <div className="card analytics-chart-card">
          <h3 className="section-title">SGPA & CGPA Trajectory</h3>
          <div className="chart-container">
            <svg viewBox={`0 -20 ${chartWidth} ${chartHeight + 40}`} className="line-chart-svg">
              {/* Grid Lines */}
              {[0, 2, 4, 6, 8, 10].map(y => (
                <line key={`grid-${y}`} x1="0" y1={normalizeY(y)} x2={chartWidth} y2={normalizeY(y)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              
              {/* Lines */}
              <polyline points={sgpaPoints} fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={cgpaPoints} fill="none" stroke="#ec4899" strokeWidth="3" strokeDasharray="6,6" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Dots & Labels */}
              {cgpa_trend.map((d, i) => (
                <g key={i}>
                  <circle cx={i * stepX} cy={normalizeY(d.sgpa)} r="6" fill="#0a0e1a" stroke="#6366f1" strokeWidth="3" />
                  <circle cx={i * stepX} cy={normalizeY(d.cgpa)} r="5" fill="#0a0e1a" stroke="#ec4899" strokeWidth="3" />
                  <text x={i * stepX} y={chartHeight + 25} fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">Sem {d.semester}</text>
                  <text x={i * stepX} y={normalizeY(d.sgpa) - 15} fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="bold">{d.sgpa}</text>
                </g>
              ))}
            </svg>
            <div className="chart-legend">
              <div><span className="legend-bar" style={{ background: '#6366f1' }}></span> SGPA (Term Performance)</div>
              <div><span className="legend-bar" style={{ background: 'transparent', borderTop: '2px dashed #ec4899' }}></span> CGPA (Cumulative)</div>
            </div>
          </div>
        </div>

        <div className="page-stack">
          <div className="card">
            <h3 className="section-title">Subject Mastery Comparison</h3>
            <div className="subject-bars">
              {subjects.map(sub => {
                const pct = (sub.total_marks / sub.max_marks) * 100
                return (
                  <div key={sub.subject_name} className="subject-bar-row">
                    <div className="subject-bar-label">
                      <span className="subject-bar-name">{sub.subject_name}</span>
                      <span className="subject-bar-meta">{sub.total_marks} / {sub.max_marks}</span>
                    </div>
                    <div className="subject-bar-track">
                      <div 
                        className="subject-bar-fill" 
                        style={{ 
                          width: `${pct}%`, 
                          background: pct >= 80 ? 'linear-gradient(90deg, var(--success), #34d399)' : pct >= 60 ? 'linear-gradient(90deg, var(--accent), #818cf8)' : 'linear-gradient(90deg, var(--warning), #fbbf24)'
                        }}
                      ></div>
                      <span className="subject-bar-value">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header-row">
               <h3 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                 <Target size={18} style={{ marginRight:'6px' }}/> CGPA Predictor
               </h3>
               {!predictMode ? (
                 <button className="outline-btn" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => setPredictMode(true)}>Set Targets</button>
               ) : (
                 <button className="primary-btn compact-btn" style={{ fontSize: '0.75rem', padding: '4px 10px', marginTop: 0 }} onClick={handlePredict}>Simulate</button>
               )}
            </div>
            
            {predictMode ? (
               <div className="erp-form" style={{ marginTop: '12px' }}>
                 <p className="erp-page-subtitle" style={{ marginBottom: '12px' }}>Enter expected total marks for your current subjects.</p>
                 {subjects.map(s => (
                   <div key={s.subject_id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.subject_name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input type="number" max={s.max_marks} min={s.total_marks} value={expectedMarks[s.subject_id] || ''} onChange={e => setExpectedMarks({...expectedMarks, [s.subject_id]: parseInt(e.target.value) || 0})} style={{ padding: '6px', fontSize: '0.8rem', width: '100%' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {s.max_marks}</span>
                      </div>
                   </div>
                 ))}
               </div>
            ) : simResult ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                     <div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Baseline</div>
                       <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{simResult.current_cgpa.toFixed(2)}</div>
                     </div>
                     <TrendingUp size={24} color="#6366f1" />
                     <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projected</div>
                       <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6ee7b7' }}>{simResult.projected_cgpa.toFixed(2)}</div>
                     </div>
                  </div>
                  <div className="admin-response" style={{ fontSize: '0.8rem' }}>Target Points Gained: +{simResult.target_points_gained.toFixed(1)}</div>
               </div>
            ) : (
               <div className="empty-state" style={{ marginTop: '16px' }}>Click "Set Targets" to model a CGPA trajectory.</div>
            )}
          </div>

          <div className="card">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Intelligence Flags
            </h3>
            <div className="risk-flags">
              {risk_flags.length === 0 ? (
                <div className="risk-flag" style={{ background: 'var(--success-soft)', color: '#6ee7b7' }}>
                  <CheckCircle size={16} /> All academic metrics are nominal.
                </div>
              ) : (
                risk_flags.map((flag, i) => (
                  <div key={i} className={`risk-flag risk-${flag.severity === 'Danger' ? 'critical' : 'warning'}`}>
                     <BarChart2 size={16} />
                     <div style={{ flex: 1 }}>
                       <strong>{flag.type}: </strong> {flag.message}
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </ErpLayout>
  )
}

