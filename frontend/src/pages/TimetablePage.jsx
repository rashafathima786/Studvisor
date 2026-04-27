import ErpLayout from '../components/ErpLayout'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TimetablePage() {
  return (
    <ErpLayout>
      <div className="breadcrumb">TIMETABLES &gt; TIMETABLE</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <button style={{ borderRadius: '50%', width: '32px', height: '32px', border: '1px solid #ccc', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontSize: '1rem', color: '#333' }}>
          <strong>26th April, 2026</strong> to <strong>2nd May, 2026</strong>
        </div>
        <button style={{ borderRadius: '50%', width: '32px', height: '32px', border: '1px solid #ccc', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronRight size={16} />
        </button>
        <button style={{ border: '1px solid #ccc', background: 'white', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }}>
          <CalendarIcon size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.85rem', color: '#555' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', background: '#d1fae5', borderRadius: '4px' }}></div> Present</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', background: '#fee2e2', borderRadius: '4px' }}></div> Absent</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', background: '#cce5ff', borderRadius: '4px' }}></div> Un marked</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '16px', height: '16px', background: '#e2e8f0', borderRadius: '4px' }}></div> Suspended</div>
      </div>

      <div className="linways-table-container">
        <table className="linways-table" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '12%' }}>DAY/HOUR</th>
              <th>HOUR 1</th>
              <th>HOUR 2</th>
              <th>HOUR 3</th>
              <th>HOUR 4</th>
              <th>HOUR 5</th>
              <th>HOUR 6</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ backgroundColor: '#fafafa' }}>
                <div style={{ fontWeight: 600, color: '#333' }}>27 April, 2026</div>
                <div style={{ color: '#777', fontSize: '0.8rem' }}>Monday</div>
              </td>
              <td style={{ padding: '8px' }}>
                <div className="tt-cell">
                  <div className="tt-title">6BCA-MLLAB - Machine Learning Lab</div>
                  <div className="tt-faculty">ROSHINI B</div>
                  <div className="tt-time">09:00 AM - 10:00 AM</div>
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div className="tt-cell">
                  <div className="tt-title">6BCA-MLLAB - Machine Learning Lab</div>
                  <div className="tt-faculty">ROSHINI B</div>
                  <div className="tt-time">10:00 AM - 11:00 AM</div>
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div className="tt-cell">
                  <div className="tt-title">6BCA-LIB - LIBRARY</div>
                  <div className="tt-faculty">SHYLAJA C</div>
                  <div className="tt-time">11:30 AM - 12:30 PM</div>
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div className="tt-cell">
                  <div className="tt-title">6BCA-ML - Machine Learning</div>
                  <div className="tt-faculty">ROSHINI B</div>
                  <div className="tt-time">12:30 AM - 01:30 PM</div>
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div className="tt-cell">
                  <div className="tt-title">6BCA-ST - CA-E2 Elective II : b. Software Testing</div>
                  <div className="tt-faculty">Dr.UMARANI C</div>
                  <div className="tt-time">02:10 PM - 03:05 PM</div>
                </div>
              </td>
              <td style={{ padding: '8px' }}>
                <div className="tt-cell">
                  <div className="tt-title">6BCA-MAD - Mobile Application Dev</div>
                  <div className="tt-faculty">Dr. M.A.JOSEPHINE</div>
                  <div className="tt-time">03:05 PM - 04:00 PM</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ErpLayout>
  )
}
