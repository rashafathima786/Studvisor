import { useState, useEffect } from 'react'
import { fetchAdminDashboard } from '../../services/api'
import ErpLayout from '../../components/ErpLayout'
import StatCard from '../../components/StatCard'
import SkeletonLoader from '../../components/SkeletonLoader'
import { Users, GraduationCap, CreditCard, AlertTriangle, Briefcase, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const CHART_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#f97316']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <ErpLayout title="Admin Dashboard" subtitle="Loading...">
        <div className="stat-grid-3"><SkeletonLoader variant="card" count={6} /></div>
        <SkeletonLoader variant="chart" />
      </ErpLayout>
    )
  }

  const counts = data?.counts || {}
  const fin = data?.financials || {}
  const acad = data?.academic || {}
  const placement = data?.placement || {}

  const pieData = [
    { name: 'Collected', value: fin.total_collected || 0 },
    { name: 'Pending', value: (fin.total_due || 0) - (fin.total_collected || 0) },
  ]

  return (
    <ErpLayout title="Admin Dashboard" subtitle={`System Status: ${data?.system_status || 'Unknown'}`}>
      <div className="stat-grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="Total Students" value={counts.students || 0} icon={<Users size={20} />} accentColor="var(--accent)" />
        <StatCard title="Faculty Members" value={counts.faculty || 0} icon={<GraduationCap size={20} />} accentColor="var(--info)" />
        <StatCard title="Collection Rate" value={`${fin.collection_rate || 0}%`} icon={<CreditCard size={20} />} accentColor="var(--success)" subtitle={`₹${((fin.total_collected || 0) / 1000).toFixed(0)}K collected`} />
        <StatCard title="At-Risk Students" value={acad.at_risk_students || 0} icon={<AlertTriangle size={20} />} accentColor="var(--danger)" subtitle="Below 75% attendance" />
        <StatCard title="Daily Attendance" value={`${acad.daily_attendance || 0}%`} icon={<Target size={20} />} accentColor="var(--warning)" />
        <StatCard title="Active Drives" value={placement.active_drives || 0} icon={<Briefcase size={20} />} accentColor="var(--pink)" subtitle={`${placement.total_offers || 0} offers made`} />
      </div>

      <div className="dashboard-lower-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '24px' }}>
        <div className="card">
          <h3 className="section-title">Fee Collection Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="section-title">Quick Stats</h3>
          <div className="admin-quick-stats">
            <div className="admin-qs-item">
              <span className="admin-qs-label">Open Complaints</span>
              <span className="admin-qs-value">{acad.open_complaints || 0}</span>
            </div>
            <div className="admin-qs-item">
              <span className="admin-qs-label">Pending Leaves</span>
              <span className="admin-qs-value">{acad.pending_leaves || 0}</span>
            </div>
            <div className="admin-qs-item">
              <span className="admin-qs-label">Overdue Fees</span>
              <span className="admin-qs-value">{fin.overdue_count || 0}</span>
            </div>
            <div className="admin-qs-item">
              <span className="admin-qs-label">Total Subjects</span>
              <span className="admin-qs-value">{counts.subjects || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </ErpLayout>
  )
}
