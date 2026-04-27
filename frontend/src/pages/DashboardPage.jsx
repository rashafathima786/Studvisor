import { useState, useEffect, useMemo } from 'react'
import { fetchProfile, fetchBunkAlerts, fetchMeritStatus, fetchMarks } from '../services/api'
import ErpLayout from '../components/ErpLayout'
import { ChevronRight } from 'lucide-react'

// Modular Dashboard Components
import StatCards from '../components/dashboard/StatCards'
import WeeklyTasks from '../components/dashboard/WeeklyTasks'
import { 
  ProfileCard, 
  AttendanceWidget, 
  BunkBudgetWidget, 
  MeritWidget, 
  DangerAlertsWidget, 
  SubjectBreakdownWidget, 
  RecentResultsWidget 
} from '../components/dashboard/DashboardWidgets'

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)
  const [marks, setMarks] = useState([])
  const [bunkData, setBunkData] = useState(null)
  const [meritData, setMeritData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProfile().catch(() => null),
      fetchBunkAlerts().catch(() => null),
      fetchMeritStatus().catch(() => null),
      fetchMarks().catch(() => [])
    ]).then(([profRes, bunkRes, meritRes, marksRes]) => {
      setProfile({
        name: profRes?.name || profRes?.full_name || "Student",
        student_id: profRes?.student_id || profRes?.username || "0000",
        department: profRes?.department || "CSE",
        semester: profRes?.semester || 3,
        roll_number: profRes?.roll_number || "N/A",
        merit_points: profRes?.merit_points || 0,
        merit_tier: profRes?.merit_tier || "Novice"
      })
      setBunkData(bunkRes || null)
      setMeritData(meritRes || null)
      setMarks(Array.isArray(marksRes) ? marksRes.slice(0, 6) : [])
      setLoading(false)
    })
  }, [])

  const overallAtt = bunkData?.overall_attendance || 0
  const attColor = overallAtt >= 85 ? '#22c55e' : overallAtt >= 75 ? '#eab308' : '#ef4444'

  const sparkData = useMemo(() => {
    return [78, 82, 75, 80, 85, 79, 83, 88, 82, 86]
  }, [])

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div className="page-loader">
      <div className="loader-card">
        <div className="loader-spinner" />
        <h2>Studvisor</h2>
        <p>Preparing your dashboard...</p>
      </div>
    </div>
  )

  return (
    <ErpLayout
      title={`${greeting}, ${profile.name.split(' ')[0]}`}
      subtitle={now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    >

      {/* ── Top Stat Cards Row (Orlando Style) ────────────────────────── */}
      <StatCards profile={profile} bunkData={bunkData} marks={marks} />

      {/* ── Live Class Banner ───────────────────────────────────────── */}
      {bunkData?.current_class && (
        <div className="nx-live-banner" style={{ marginBottom: '24px' }}>
          <div className="nx-live-dot" />
          <div className="nx-live-content">
            <span className="nx-live-tag">LIVE NOW</span>
            <strong>{bunkData.current_class.subject_name}</strong>
            <span className="nx-live-meta">{bunkData.current_class.room} · {bunkData.current_class.instructor}</span>
          </div>
          <ChevronRight size={18} />
        </div>
      )}

      {/* ── Bento Grid Assembly ───────────────────────────────────────── */}
      <div className="nx-bento">
        {/* Row 1 */}
        <ProfileCard profile={profile} marks={marks} />
        <AttendanceWidget overallAtt={overallAtt} attColor={attColor} sparkData={sparkData} />
        <BunkBudgetWidget bunkData={bunkData} />

        {/* Row 2 */}
        <WeeklyTasks />
        <MeritWidget meritData={meritData} profile={profile} />

        {/* Alerts */}
        <DangerAlertsWidget bunkData={bunkData} />

        {/* Bottom Row */}
        <SubjectBreakdownWidget bunkData={bunkData} />
        <RecentResultsWidget marks={marks} />
      </div>
      
    </ErpLayout>
  )
}
