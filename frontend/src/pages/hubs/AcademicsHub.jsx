import { Link } from 'react-router-dom'
import ErpLayout from '../../components/ErpLayout'

export default function AcademicsHub() {
  return (
    <ErpLayout title="Academics" subtitle="Manage your academic journey">
      <div className="bento-grid">
        
        {/* Assignments - Large Bento Tile */}
        <div className="bento-tile bento-span-2 bento-row-span-2" style={{ cursor: 'default' }}>
          <div className="hub-tile-header">
            <div className="hub-tile-icon-wrap">📝</div>
            <div className="hub-tile-title">
              <span className="hub-tile-label">Assignments</span>
              <span className="hub-tile-desc">Submit & track work</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Link to="/assignments" className="bento-task-action">View All</Link>
            </div>
          </div>
          <div className="bento-internal-scroll">
            <div className="bento-task-item">
              <div className="bento-task-info">
                <span className="bento-task-title">OS Lab Report</span>
                <span className="bento-task-meta">Due: Tomorrow, 11:59 PM</span>
              </div>
              <button className="bento-task-action primary">Submit</button>
            </div>
            <div className="bento-task-item">
              <div className="bento-task-info">
                <span className="bento-task-title">DB Systems Quiz 3</span>
                <span className="bento-task-meta">Due: Oct 15, 5:00 PM</span>
              </div>
              <button className="bento-task-action primary">Take Quiz</button>
            </div>
            <div className="bento-task-item">
              <div className="bento-task-info">
                <span className="bento-task-title">Computer Networks Project</span>
                <span className="bento-task-meta">Due: Oct 20, 11:59 PM</span>
              </div>
              <button className="bento-task-action">Details</button>
            </div>
            <div className="bento-task-item">
              <div className="bento-task-info">
                <span className="bento-task-title">Data Structures Assignment 4</span>
                <span className="bento-task-meta">Due: Oct 25, 11:59 PM</span>
              </div>
              <button className="bento-task-action">Details</button>
            </div>
          </div>
        </div>

        {/* Timetable - Wide Bento Tile */}
        <Link to="/timetable" className="bento-tile bento-span-2">
          <div className="hub-tile-header">
            <div className="hub-tile-icon-wrap">📅</div>
            <div className="hub-tile-title">
              <span className="hub-tile-label">Today's Schedule</span>
              <span className="hub-tile-desc">Your classes for today</span>
            </div>
          </div>
          <div className="hub-tile-preview" style={{ borderTop: 'none', paddingTop: '0', marginTop: '16px' }}>
            <div className="mini-status-list">
              <div className="mini-status-item" style={{ padding: '8px', background: '#f9fafb', borderRadius: '8px' }}>
                <span className="mini-tag violet" style={{ width: '60px', textAlign: 'center' }}>10:00 AM</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>Data Structures</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6b7280' }}>Room 402</span>
              </div>
              <div className="mini-status-item" style={{ padding: '8px', background: '#f9fafb', borderRadius: '8px' }}>
                <span className="mini-tag" style={{ width: '60px', textAlign: 'center' }}>11:30 AM</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>Computer Networks</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6b7280' }}>Room 305</span>
              </div>
              <div className="mini-status-item" style={{ padding: '8px', background: '#f9fafb', borderRadius: '8px' }}>
                <span className="mini-tag" style={{ width: '60px', textAlign: 'center' }}>02:00 PM</span>
                <span style={{ fontWeight: 600, color: '#111827' }}>OS Lab</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#6b7280' }}>Lab 3</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Syllabus Tracker */}
        <Link to="/syllabus" className="bento-tile bento-span-2">
          <div className="hub-tile-header">
            <div className="hub-tile-icon-wrap">📊</div>
            <div className="hub-tile-title">
              <span className="hub-tile-label">Syllabus Tracker</span>
              <span className="hub-tile-desc">Overall Progress: 65%</span>
            </div>
          </div>
          <div className="hub-tile-preview" style={{ borderTop: 'none', paddingTop: '0', marginTop: '16px' }}>
             <div className="seg-progress" style={{ height: '8px' }}>
              <div className="seg-block seg-block--filled green" style={{ height: '8px' }}></div>
              <div className="seg-block seg-block--filled green" style={{ height: '8px' }}></div>
              <div className="seg-block seg-block--filled green" style={{ height: '8px' }}></div>
              <div className="seg-block seg-block--filled green" style={{ height: '8px' }}></div>
              <div className="seg-block seg-block--filled green" style={{ height: '8px' }}></div>
              <div className="seg-block" style={{ height: '8px' }}></div>
              <div className="seg-block" style={{ height: '8px' }}></div>
              <div className="seg-block" style={{ height: '8px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.8rem' }}>
              <span style={{ color: '#374151', fontWeight: 600 }}>DB Systems: 80%</span>
              <span style={{ color: '#374151', fontWeight: 600 }}>OS: 50%</span>
            </div>
          </div>
        </Link>

        {/* Exams */}
        <Link to="/exams" className="bento-tile">
          <div className="hub-tile-header">
            <div className="hub-tile-icon-wrap">📖</div>
            <div className="hub-tile-title">
              <span className="hub-tile-label">Exams</span>
              <span className="hub-tile-desc">Mid-Terms in 14 Days</span>
            </div>
          </div>
          <div className="hub-tile-preview">
            <div className="mini-status-list">
              <div className="mini-status-item">
                <div className="mini-dot warning"></div>
                <span>Starts Oct 24, 2026</span>
              </div>
              <div className="mini-status-item">
                <div className="mini-dot"></div>
                <span>5 subjects scheduled</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Study Resources */}
        <Link to="/notes" className="bento-tile">
          <div className="hub-tile-header">
            <div className="hub-tile-icon-wrap">📄</div>
            <div className="hub-tile-title">
              <span className="hub-tile-label">Resources</span>
              <span className="hub-tile-desc">2 New Materials</span>
            </div>
          </div>
          <div className="hub-tile-preview">
             <div className="mini-status-list">
              <div className="mini-status-item">
                <div className="mini-dot active"></div>
                <span>OS Chapter 4 (PDF)</span>
              </div>
              <div className="mini-status-item">
                <div className="mini-dot active"></div>
                <span>DB Guidelines</span>
              </div>
            </div>
          </div>
        </Link>

      </div>
    </ErpLayout>
  )
}
