import { useState, useEffect, useRef } from 'react'
import { Bell, Search, Sun, Moon, Menu, User, LogOut, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications } from '../services/api'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'

export default function Header({ title, subtitle }) {
  const [notifs, setNotifs] = useState([])
  const [showPanel, setShowPanel] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const userMenuRef = useRef(null)
  const notifRef = useRef(null)
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const logout = useAuthStore((s) => s.logout)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)

  useEffect(() => {
    fetchNotifications().then(res => setNotifs(res?.notifications || [])).catch(() => {})
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowPanel(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const unreadCount = notifs.filter(n => !n.is_read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user?.full_name || user?.username || 'User'
  const roleLabel = (role || 'student').charAt(0).toUpperCase() + (role || 'student').slice(1)

  return (
    <div className="dashboard-header">
      <div className="header-left">
        <button
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="header-actions">
        <div className="input-with-icon header-search" style={{ marginBottom: 0, padding: '0 12px' }}>
          <Search size={16} />
          <input type="text" placeholder="Search across ERP..." style={{ padding: '8px 0', fontSize: '0.88rem' }} />
        </div>

        <button className="notif-bell" onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="notif-bell" onClick={() => setShowPanel(!showPanel)} aria-label="Notifications">
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
          </button>

          {showPanel && (
            <div className="notif-panel" style={{ position: 'absolute', top: '100%', right: 0, width: '380px', zIndex: 100, marginTop: '8px' }}>
              <div className="notif-panel-header">
                <strong>Notification Center</strong>
                {unreadCount > 0 && <span className="pill-badge">{unreadCount} New</span>}
              </div>

              {notifs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No notifications</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifs.map(n => (
                    <div key={n.id} className={`notif-item notif-${n.type}`}>
                      <div className="notif-icon">
                        {n.type === 'critical' ? '🚨' : n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : 'ℹ️'}
                      </div>
                      <div>
                        <strong>{n.title}</strong>
                        <p>{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="header-user-menu" ref={userMenuRef}>
          <button
            className="header-user-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <div className="header-avatar">
              <User size={16} />
            </div>
            <div className="header-user-info">
              <span className="header-user-name">{displayName}</span>
              <span className="header-user-role">{roleLabel}</span>
            </div>
            <ChevronDown size={14} className={`header-chevron ${showUserMenu ? 'rotated' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="header-dropdown">
              <div className="header-dropdown-header">
                <div className="header-avatar lg">
                  <User size={20} />
                </div>
                <div>
                  <strong>{displayName}</strong>
                  <span>{roleLabel}</span>
                </div>
              </div>
              <div className="header-dropdown-divider" />
              <button className="header-dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
