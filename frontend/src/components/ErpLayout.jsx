import Sidebar from './Sidebar'
import Header from './Header'

export default function ErpLayout({ title, subtitle, children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <Header />
        <div className="content-area">
          {title && <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{title}</span>
            {subtitle && <span style={{ color: '#888', fontWeight: 'normal', textTransform: 'none' }}>{subtitle}</span>}
          </div>}
          {children}
        </div>
        <footer className="Studvisor-footer">
          <div>Powered by Linways Technologies Pvt.Ltd.</div>
          <div>Linways AMS ULTIMATE v4.4.1.7</div>
        </footer>
      </main>
    </div>
  )
}
