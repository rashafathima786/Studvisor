import {
  LayoutDashboard, BookOpen, BarChart3, MessageCircle,
  Briefcase, LogOut, ShieldAlert, Settings, ChevronLeft
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'

/* ═══════════════════════════════════════════════════════════════════
   Sidebar v4.0 — Flat category navigation
   Subcategories appear as bento tiles INSIDE each hub page
   ═══════════════════════════════════════════════════════════════════ */

const studentNav = [
  { to: '/dashboard',    icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/academics',    icon: <BookOpen size={20} />,        label: 'Academics' },
  { to: '/performance',  icon: <BarChart3 size={20} />,       label: 'Performance' },
  { to: '/campus',       icon: <MessageCircle size={20} />,   label: 'Campus Life' },
  { to: '/services',     icon: <Briefcase size={20} />,       label: 'Services' },
]

const facultyNav = [
  { to: '/faculty/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/faculty/classes',   icon: <BookOpen size={20} />,        label: 'My Classes' },
  { to: '/faculty/analytics', icon: <BarChart3 size={20} />,       label: 'Analytics' },
]

const adminNav = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/admin/manage',    icon: <Briefcase size={20} />,       label: 'Management' },
  { to: '/admin/analytics', icon: <BarChart3 size={20} />,       label: 'Analytics' },
]

export default function Sidebar({ onLogout }) {
  const role = useAuthStore((s) => s.role)
  const { sidebarOpen, closeSidebar } = useUIStore()

  let navItems = studentNav
  if (role === 'faculty' || role === 'hod') navItems = facultyNav
  if (role === 'admin') navItems = adminNav

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-inner">
          {/* Brand */}
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <ShieldAlert size={22} />
            </div>
            <div className="sidebar-brand-text">
              <h2>Studvisor</h2>
              <p>v4.0</p>
            </div>
            <button className="sidebar-close-mobile" onClick={closeSidebar} aria-label="Close sidebar">
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav" aria-label="Main navigation">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
