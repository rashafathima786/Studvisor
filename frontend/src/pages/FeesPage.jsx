import { useState, useEffect } from 'react'
import ErpLayout from '../components/ErpLayout'
import { fetchMyFees, fetchFeeSummary, fetchPaymentHistory } from '../services/api'
import { CreditCard, Receipt, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function FeesPage() {
  const [fees, setFees] = useState([])
  const [summary, setSummary] = useState(null)
  const [payments, setPayments] = useState([])
  const [tab, setTab] = useState('fees')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchMyFees().catch(() => ({ fees: [] })),
      fetchFeeSummary().catch(() => null),
      fetchPaymentHistory().catch(() => ({ payments: [] })),
    ]).then(([feesRes, summaryRes, paymentsRes]) => {
      setFees(feesRes?.fees || [])
      setSummary(summaryRes)
      setPayments(paymentsRes?.payments || [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="page-loader"><div className="loader-card"><h2>Nexus ERP</h2><p>Loading Fee Portal...</p></div></div>
  )

  const statusIcon = (status) => {
    if (status === 'Paid') return <CheckCircle size={16} color="#22c55e" />
    if (status === 'Overdue') return <AlertTriangle size={16} color="#ef4444" />
    return <Clock size={16} color="#facc15" />
  }

  const statusColor = (status) => {
    if (status === 'Paid') return '#22c55e'
    if (status === 'Overdue') return '#ef4444'
    if (status === 'Partial') return '#fb923c'
    return '#facc15'
  }

  return (
    <ErpLayout title="Fee Management" subtitle="View fees, make payments, and track your financial records">

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="card info-card">
          <div className="info-card-title">Total Due</div>
          <div className="info-card-value" style={{ color: '#f87171' }}>₹{summary?.total_due?.toLocaleString() || 0}</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Total Paid</div>
          <div className="info-card-value" style={{ color: '#22c55e' }}>₹{summary?.total_paid?.toLocaleString() || 0}</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Balance</div>
          <div className="info-card-value" style={{ color: '#facc15' }}>₹{summary?.total_balance?.toLocaleString() || 0}</div>
        </div>
        <div className="card info-card">
          <div className="info-card-title">Overdue</div>
          <div className="info-card-value" style={{ color: '#ef4444' }}>{summary?.overdue_count || 0}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['fees', 'payments'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600,
            backgroundColor: tab === t ? 'var(--primary-color)' : 'var(--bg-secondary, #0f1424)',
            color: tab === t ? 'white' : 'var(--text-secondary)',
          }}>
            {t === 'fees' ? '📋 Fee Records' : '💳 Payment History'}
          </button>
        ))}
      </div>

      {/* Fee Records */}
      {tab === 'fees' && (
        <div className="card">
          <h3 className="section-title"><CreditCard size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '6px' }} /> Fee Breakdown</h3>
          {fees.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '30px' }}>
              <p>No fee records found.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Fee</th>
                    <th style={{ padding: '10px 12px' }}>Category</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Paid</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Balance</th>
                    <th style={{ padding: '10px 12px' }}>Due Date</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map(fee => (
                    <tr key={fee.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>{fee.fee_name}</td>
                      <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{fee.category}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{fee.amount_due?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#22c55e' }}>₹{fee.amount_paid?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: fee.balance > 0 ? '#f87171' : '#22c55e' }}>
                        ₹{fee.balance?.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 12px' }}>{fee.due_date || '—'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: statusColor(fee.status) }}>
                          {statusIcon(fee.status)} {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payment History */}
      {tab === 'payments' && (
        <div className="card">
          <h3 className="section-title"><Receipt size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '6px' }} /> Payment History</h3>
          {payments.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '30px' }}>
              <p>No payments recorded yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px' }}>Receipt #</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '10px 12px' }}>Method</th>
                    <th style={{ padding: '10px 12px' }}>Transaction ID</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.85rem' }}>{p.receipt_number}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#22c55e' }}>₹{p.amount?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', textTransform: 'uppercase' }}>{p.payment_method}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{p.transaction_id || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#22c55e' }}>{p.status}</td>
                      <td style={{ padding: '10px 12px' }}>{new Date(p.paid_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </ErpLayout>
  )
}
