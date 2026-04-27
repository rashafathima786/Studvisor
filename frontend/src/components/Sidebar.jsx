import { useState, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Calendar, CalendarDays, UserCheck, FileText,
  LayoutList, MessageSquare, Video, GraduationCap,
  Search, ChevronDown, X, Inbox, Bell, BarChart3, Users,
  CreditCard, Briefcase, BookOpen, Award, Flame, MapPin,
  HelpCircle, LogOut, Shield, Settings, Megaphone, BookMarked
} from 'lucide-react'
import useAuthStore from '../stores/authStore'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'timetable', label: 'Timetables', icon: Calendar, path: '/timetable' },
  { id: 'calendar', label: 'Academic Calendar', icon: CalendarDays, path: '/calendar' },
  { id: 'attendance', label: 'Attendance', icon: UserCheck, path: '/attendance' },
  { id: 'syllabus', label: 'Curriculum / Pathway', icon: FileText, path: '/syllabus' },
  { id: 'assignments', label: 'Assessments', icon: LayoutList, path: '/assignments' },
  { id: 'results', label: 'Results', icon: GraduationCap, path: '/results' },
  { id: 'gpa', label: 'GPA / CGPA', icon: BarChart3, path: '/gpa' },
  { id: 'fees', label: 'Fee Management', icon: CreditCard, path: '/fees' },
  { id: 'exams', label: 'Exam Schedule', icon: BookOpen, path: '/exams' },
  { id: 'leave', label: 'OD / Leave', icon: CalendarDays, path: '/leave' },
  { id: 'placement', label: 'Placements', icon: Briefcase, path: '/placement' },
  { id: 'library', label: 'Library', icon: BookMarked, path: '/library' },
  { id: 'analytics', label: 'Performance', icon: BarChart3, path: '/analytics' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, path: '/announcements' },
  { id: 'events', label: 'Events', icon: CalendarDays, path: '/events' },
  { id: 'faculty', label: 'Faculty Directory', icon: Users, path: '/faculty' },
  { id: 'notes', label: 'Study Resources', icon: FileText, path: '/notes' },
  { id: 'polls', label: 'Campus Polls', icon: MessageSquare, path: '/polls' },
  { id: 'lostfound', label: 'Lost & Found', icon: MapPin, path: '/lostfound' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Award, path: '/leaderboard' },
  { id: 'achievements', label: 'Achievements', icon: Award, path: '/achievements' },
  { id: 'wall', label: 'Campus Wall', icon: Flame, path: '/wall' },
  { id: 'hub', label: 'Campus Hub', icon: Shield, path: '/hub' },
  { id: 'complaints', label: 'Complaints', icon: HelpCircle, path: '/complaints' },
]

export default function Sidebar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return NAV_ITEMS
    return NAV_ITEMS.filter(n => n.label.toLowerCase().includes(q))
  }, [query])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo / Header */}
      <div className="sidebar-header">
        <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
          AMS
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Linways AMS</div>
          <div style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap' }}>Student Portal</div>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={14} color="#888" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search menu..."
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#888', display: 'flex' }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {filtered.length === 0 && (
          <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
            No results for "{query}"
          </div>
        )}
        {filtered.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-item-left">
                <div className="nav-icon-box">
                  <Icon size={16} />
                </div>
                <span>{item.label}</span>
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.05)', color: '#bbb',
            cursor: 'pointer', fontSize: '0.85rem'
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}