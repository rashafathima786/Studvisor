import { useEffect, useMemo, useState } from 'react'
import ErpLayout from '../components/ErpLayout'
import InfoCard from '../components/InfoCard'
import MarksCard from '../components/MarksCard'
import { fetchMarks } from '../services/api'
import { Download } from 'lucide-react'

export default function ResultsPage() {
  const [marks, setMarks] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMarks() {
      try {
        setMarks(await fetchMarks())
      } catch (err) {
        setError(err?.response?.data?.detail || 'Failed to load results.')
      } finally {
        setLoading(false)
      }
    }

    loadMarks()
  }, [])

  const summary = useMemo(() => {
    if (!marks.length) {
      return { average: '0', best: '-', weakest: '-' }
    }
    const enriched = marks.map((item) => ({
      ...item,
      percentage: Number(item.max_marks) ? (Number(item.marks_obtained) / Number(item.max_marks)) * 100 : 0,
    }))
    const sorted = [...enriched].sort((a, b) => b.percentage - a.percentage)
    const total = enriched.reduce((sum, item) => sum + item.percentage, 0)
    return {
      average: (total / enriched.length).toFixed(2),
      best: sorted[0]?.subject_name || '-',
      weakest: sorted[sorted.length - 1]?.subject_name || '-',
    }
  }, [marks])

  return (
    <ErpLayout title="Results" subtitle="Review marks, strongest subjects, and areas that need focus.">
      {error ? <div className="error-box page-error">{error}</div> : null}
      {loading ? <div className="card empty-state">Loading results...</div> : null}

      {!loading ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px' }}>
            <button 
              onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/reports/marksheet`, '_blank')}
              style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <Download size={16} /> Download Marksheet
            </button>
            <button 
              onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/reports/bonafide`, '_blank')}
              style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary, #0f1424)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <Download size={16} /> Bonafide Certificate
            </button>
          </div>
          <section className="dashboard-grid results-summary-grid">
            <InfoCard title="Average" value={`${summary.average}%`} subtitle="Across available marks" />
            <InfoCard title="Best Subject" value={summary.best} subtitle="Highest percentage" />
            <InfoCard title="Weakest Subject" value={summary.weakest} subtitle="Lowest percentage" />
          </section>
          <MarksCard marks={marks} average={summary.average} />
        </>
      ) : null}
    </ErpLayout>
  )
}
