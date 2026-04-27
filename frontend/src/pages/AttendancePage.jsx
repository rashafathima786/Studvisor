import { useState, useEffect } from 'react'
import ErpLayout from '../components/ErpLayout'
import { Info, Download, Printer } from 'lucide-react'

export default function AttendancePage() {
  const [data, setData] = useState([
    { sl: 1, name: "CA-V2 Vocation Course II : Electronic Content Design ( 6BCA-ECD )", th: 18, ah: 9, dl: 6, ahdl: 15, ah_pct: "50.00 %", ahdl_pct: "83.33 %" },
    { sl: 2, name: "Internship ( 6BCA-INT )", th: 10, ah: 6, dl: 2, ahdl: 8, ah_pct: "60.00 %", ahdl_pct: "80.00 %" },
    { sl: 3, name: "Industrial Specialization ( 6BCA-IS )", th: 21, ah: 6, dl: 2, ahdl: 8, ah_pct: "28.57 %", ahdl_pct: "38.10 %" },
    { sl: 4, name: "LIBRARY ( 6BCA-LIB )", th: 1, ah: 1, dl: 0, ahdl: 1, ah_pct: "100.00 %", ahdl_pct: "100.00 %" },
    { sl: 5, name: "Mobile Application Development ( 6BCA-MAD )", th: 32, ah: 17, dl: 9, ahdl: 26, ah_pct: "53.13 %", ahdl_pct: "81.25 %" },
    { sl: 6, name: "Mobile Application Development Lab ( 6BCA-MADLAB )", th: 27, ah: 16, dl: 6, ahdl: 22, ah_pct: "59.26 %", ahdl_pct: "81.48 %" },
    { sl: 7, name: "Machine Learning ( 6BCA-ML )", th: 38, ah: 20, dl: 9, ahdl: 29, ah_pct: "52.63 %", ahdl_pct: "76.32 %" }
  ])

  return (
    <ErpLayout>
      <div className="breadcrumb">ATTENDANCE</div>

      <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#555', marginBottom: '24px' }}>
        <Info size={16} color="#333" />
        <strong>Note:</strong> When the rule "Attendance count from date of admission" is enabled, data is shown from the date of admission.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '16px' }}>
        <button className="filter-btn"><Download size={14}/> Export</button>
        <button className="filter-btn"><Printer size={14}/> Print</button>
      </div>

      <div className="linways-table-container">
        <table className="linways-table">
          <thead>
            <tr className="linways-table-header-row">
              <th colSpan="8">COURSE WISE REPORT</th>
            </tr>
            <tr className="linways-table-header-row" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
              <th colSpan="8" style={{ fontWeight: 400, textTransform: 'none' }}>Date range : 09-02-2026 to 11-07-2026</th>
            </tr>
            <tr>
              <th>SL.NO.</th>
              <th style={{ textAlign: 'left' }}>COURSE NAME</th>
              <th>TH</th>
              <th>AH</th>
              <th>DL</th>
              <th>AH + DL</th>
              <th>AH%</th>
              <th>AH+DL%</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.sl}>
                <td>{row.sl}</td>
                <td style={{ textAlign: 'left', color: '#333' }}>{row.name}</td>
                <td>{row.th}</td>
                <td>{row.ah}</td>
                <td>{row.dl}</td>
                <td>{row.ahdl}</td>
                <td>{row.ah_pct}</td>
                <td>{row.ahdl_pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </ErpLayout>
  )
}
