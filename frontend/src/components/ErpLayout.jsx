import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ToastContainer from './Toast'
import useAuthStore from '../stores/authStore'

export default function ErpLayout({ title, subtitle, children }) {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <Header title={title} subtitle={subtitle} />
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}
