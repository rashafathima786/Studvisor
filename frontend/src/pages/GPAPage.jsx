import { useState, useEffect } from 'react'
import ErpLayout from '../components/ErpLayout'
import { fetchTranscript } from '../services/api'
import { GraduationCap, Award, TrendingUp } from 'lucide-react'

export default function GPAPage() {
  const [transcript, setTranscript] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTranscript().then(res => {
      setTranscript(res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="page-loader"><div className="loader-card"><h2>Studvisor</h2><p>Computing GPA Engine...</p></div></div>
  )

  const gradeColor = (letter) => {
    const map = { 'O': '#22c55e', 'A+': '#6ee7b7', 'A': '#a3e635', 'B+': '#facc15', 'B': '#fb923c', 'C': '#f87171', 'F': '#ef4444' }
    return map[letter] || '#94a3b8'
  }

  return (
    <ErpLayout title="GPA / CGPA Engine" subtitle="Credit-weighted academic performance analysis">

      {/* CGPA Summary Card */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
        <div className="card info-card">
          <div className="info-card-title">Cumulative GPA</div>
          <div className="info-card-value" style={{ color: '#6366f1', fontSize: '2.4rem' }}>
            {transcript?.cgpa?.toFixed(2) || '0.00'}
          </div>
          <div className="info-card-subtitle">Across all semesters</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Total Credits</div>
          <div className="info-card-value">{transcript?.total_credits || 0}</div>
          <div className="info-card-subtitle">Credit hours earned</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Semesters</div>
          <div className="info-card-value">{transcript?.semesters?.length || 0}</div>
          <div className="info-card-subtitle">Completed</div>
        </div>
      </div>

      {/* Semester-wise Breakdown */}
      {transcript?.semesters?.map(sem => (
        <div key={sem.semester} className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              <GraduationCap size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '6px' }} />
              Semester {sem.semester}
            </h3>
            <div style={{
              padding: '6px 16px', borderRadius: '20px',
              backgroundColor: sem.gpa >= 8 ? 'rgba(34,197,94,0.15)' : sem.gpa >= 6 ? 'rgba(250,204,21,0.15)' : 'rgba(239,68,68,0.15)',
              color: sem.gpa >= 8 ? '#22c55e' : sem.gpa >= 6 ? '#facc15' : '#ef4444',
              fontWeight: 700, fontSize: '0.95rem',
            }}>
              GPA: {sem.gpa}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Subject</th>
                  <th style={{ padding: '10px 12px' }}>Code</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Credits</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Marks</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>%</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Grade</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>GP</th>
                </tr>
              </thead>
              <tbody>
                {sem.subjects?.map(subj => (
                  <tr key={subj.subject_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{subj.subject_name}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{subj.subject_code}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{subj.credits}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{subj.marks_obtained}/{subj.max_marks}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{subj.percentage}%</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
                        backgroundColor: `${gradeColor(subj.grade_letter)}20`,
                        color: gradeColor(subj.grade_letter), fontWeight: 700,
                      }}>
                        {subj.grade_letter}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{subj.grade_point}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {(!transcript?.semesters || transcript.semesters.length === 0) && (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '40px' }}>
          <Award size={40} color="var(--text-secondary)" />
          <h3>No Results Available</h3>
          <p>Your semester results will appear here once published.</p>
        </div>
      )}

    </ErpLayout>
  )
}

