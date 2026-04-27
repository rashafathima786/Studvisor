import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import useAuthStore from '../stores/authStore'
import { ShieldAlert, Fingerprint, Lock, GraduationCap, Users, Settings } from 'lucide-react'

const roles = [
  { id: 'student', label: 'Student', icon: <GraduationCap size={18} /> },
  { id: 'faculty', label: 'Faculty', icon: <Users size={18} /> },
  { id: 'admin', label: 'Admin', icon: <Settings size={18} /> },
]

export default function LoginPage() {
  const [username, setuser] = useState('')
  const [password, setpass] = useState('')
  const [selectedRole, setSelectedRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser({ username, password, role: selectedRole })
      const role = res.role || selectedRole
      const userData = res.user || {}
      login(res.access_token, role, {
        id: userData.id, username: username,
        full_name: userData.name || username, role,
        department: userData.department,
      })
      if (res.refresh_token) localStorage.setItem('erp_refresh_token', res.refresh_token)

      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'faculty' || role === 'hod') navigate('/faculty/dashboard')
      else navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please verify your identity.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-v4-wrapper">
      <div className="login-v4-card">
        <div className="login-v4-header">
          <div className="login-v4-logo">
            <ShieldAlert size={28} color="#fff" />
          </div>
          <h1>Studvisor v4</h1>
          <p>Unified Campus Intelligence Platform</p>
        </div>

        <div className="login-v4-role-selector">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`login-v4-role-btn ${selectedRole === r.id ? 'active' : ''}`}
              onClick={() => setSelectedRole(r.id)}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLogin} className="login-v4-form">
          <div className="input-group">
            <label>Username / Staff ID</label>
            <div className="input-with-icon">
              <Fingerprint size={18} />
              <input 
                autoFocus 
                required 
                type="text" 
                placeholder="e.g. aarav_sharma" 
                value={username} 
                onChange={e => setuser(e.target.value)} 
              />
            </div>
          </div>
          <div className="input-group">
            <label>Secure Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setpass(e.target.value)} 
              />
            </div>
          </div>
          
          <button type="submit" className="primary-btn" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="login-v4-footer">
          <p>Demo Credentials: <strong>demo</strong> / <strong>demo</strong> (Select your role above)</p>
        </div>
      </div>
    </div>
  )
}

