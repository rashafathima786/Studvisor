import { useState, useEffect } from 'react'
import ErpLayout from '../components/ErpLayout'
import { fetchHeatmap, simulateBunk } from '../services/api'
import { CalendarDays, Sliders, AlertTriangle, Download } from 'lucide-react'
import AttendanceTrend from '../components/AttendanceTrend'

export default function AttendancePage() {
  const [heatmap, setHeatmap] = useState([])
  const [streak, setStreak] = useState(0)
  const [selectedDay, setSelectedDay] = useState(null)
  
  const [simSlider, setSimSlider] = useState(0)
  const [simResult, setSimResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHeatmap(new Date().getFullYear(), new Date().getMonth() + 1).then(res => {
      setHeatmap(res?.calendar || [])
      setStreak(res?.current_streak || 0)
      setLoading(false)
    }).catch(() => {
      setHeatmap([])
      setLoading(false)
    })
    
    // Initial sim
    handleSimulate(0)
  }, [])

  function handleSimulate(runs) {
    setSimSlider(runs)
    simulateBunk(runs).then(res => setSimResult(res)).catch(() => null)
  }

  if (loading) return (
    <div className="page-loader"><div className="loader-card"><h2>Studvisor</h2><p>Loading Attendance Matrix...</p></div></div>
  )

  const parseDate = (dstr) => parseInt(dstr.split('-')[2], 10)

  // Generate blank cells to offset start of month
  const firstDayStr = heatmap[0]?.date
  let blanks = []
  if (firstDayStr) {
    const dDate = new Date(firstDayStr)
    const dayOfWeek = dDate.getDay() // 0 = Sunday, 1 = Monday
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to Mon=0
    blanks = Array(offset).fill(null)
  }

  return (
    <ErpLayout title="Attendance Engine" subtitle="Live tracking, heatmaps, and predictive bunk simulations">
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px' }}>
        <button 
          onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/reports/attendance-certificate`, '_blank')}
          style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <Download size={16} /> Attendance Certificate
        </button>
      </div>

      <div className="dashboard-grid attendance-summary-grid">
         <div className="card info-card">
          <div className="info-card-title">Current Streak</div>
          <div className="info-card-value">{streak} <span style={{fontSize:'1rem'}}>Days</span></div>
          <div className="info-card-subtitle" style={{ color: '#fb923c' }}>🔥 Keep it going!</div>
        </div>
      </div>

      {/* ── Attendance Trend Component ── */}
      <div style={{ marginBottom: '24px' }}>
        <AttendanceTrend />
      </div>

      <div className="dashboard-lower-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        
        <div className="card">
          <h3 className="section-title"><CalendarDays size={18} style={{ display:'inline', verticalAlign:'-3px', marginRight:'6px' }}/> Monthly Heatmap</h3>
          <p className="erp-page-subtitle" style={{ marginBottom: '16px' }}>{new Date().toLocaleDateString('en-US', { month:'long', year:'numeric'})}</p>
          
          <div className="heatmap-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="heatmap-day-label">{d}</div>
            ))}
            
            {blanks.map((_, i) => <div key={`b-${i}`} className="heatmap-cell empty"></div>)}
            
            {heatmap.map(day => {
              let colorClass = 'heatmap-gray'
              if (day.status === 'Present') colorClass = 'heatmap-green'
              if (day.status === 'Partial') colorClass = 'heatmap-yellow'
              if (day.status === 'Absent') colorClass = 'heatmap-red'
              if (day.is_holiday) colorClass = 'heatmap-gray'

              return (
                <div 
                  key={day.date} 
                  className={`heatmap-cell ${colorClass} ${selectedDay?.date === day.date ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(day)}
                  title={`${day.date}: ${day.status}`}
                >
                  <span className="heatmap-date">{parseDate(day.date)}</span>
                </div>
              )
            })}
          </div>
          
          <div className="heatmap-legend">
            <div><span className="heatmap-dot heatmap-green"></span> Full Present</div>
            <div><span className="heatmap-dot heatmap-yellow"></span> Partial</div>
            <div><span className="heatmap-dot heatmap-red"></span> Absent</div>
            <div><span className="heatmap-dot heatmap-gray"></span> Holiday/No Data</div>
          </div>

          {selectedDay && selectedDay.detail && selectedDay.detail.length > 0 && (
            <div className="day-detail-popup">
              <h4>Classes on {selectedDay.date}</h4>
              <div className="day-detail-hours">
                {selectedDay.detail.map((hr, idx) => (
                  <div key={idx} className="day-hour-item">
                    <span className="day-hour-num">H {hr.period}</span>
                    <span>{hr.subject_code}</span>
                    <span className={`day-hour-status ${hr.status}`}>{hr.status === 'P' ? 'Present' : hr.status === 'A' ? 'Absent' : 'Duty Leave'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title"><Sliders size={18} style={{ display:'inline', verticalAlign:'-3px', marginRight:'6px' }}/> Predictive Bunk Simulator</h3>
          <p className="erp-page-subtitle">Simulate the impact of missing upcoming days entirely.</p>
          
          <div className="sim-controls">
            <label className="sim-label">
              Days to miss: {simSlider}
              <input 
                type="range" className="sim-slider" 
                min="0" max="10" 
                value={simSlider} 
                onChange={e => handleSimulate(parseInt(e.target.value))} 
              />
            </label>
          </div>

          {simResult && (
            <>
              <div className="sim-current">
                Overall projection: <strong style={{ color: simResult.projected_overall >= 75 ? '#6ee7b7' : '#fca5a5' }}>
                  {simResult.projected_overall}%
                </strong>
                {simResult.projected_overall < 75 && <AlertTriangle size={16} color="#fca5a5" />}
              </div>
              
              <div className="sim-projections">
                {simResult.projected_subjects.map(sub => (
                  <div key={sub.subject} className={`sim-proj-item severity-${sub.severity}`}>
                    <div style={{ width: '80px', fontWeight: 600 }}>{sub.subject}</div>
                    <div className="sim-proj-bar-track">
                      <div className="sim-proj-bar-fill" style={{ width: `${sub.projected}%`, background: sub.severity === 'safe' ? 'var(--success)' : sub.severity === 'caution' ? 'var(--warning)' : sub.severity === 'danger' ? 'var(--orange)' : 'var(--danger)' }}></div>
                    </div>
                    <div style={{ minWidth: '40px', textAlign: 'right', fontWeight: 700 }}>{sub.projected}%</div>
                    {sub.severity === 'critical' && <div className="sim-warn critical">Danger Zone</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </ErpLayout>
  )
}

