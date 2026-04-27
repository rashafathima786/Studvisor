import { useState, useEffect } from 'react';
import { fetchAssignments, submitAssignment } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { CheckCircle, Clock } from 'lucide-react';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAssignments(); }, []);

  const loadAssignments = async () => {
    try { const data = await fetchAssignments(); setAssignments(data?.assignments || []); }
    catch (err) { console.error("Failed to load assignments", err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (assignmentId) => {
    try { await submitAssignment(assignmentId); await loadAssignments(); }
    catch (err) { alert("Failed to submit assignment."); }
  };

  return (
    <ErpLayout title="ASSESSMENTS">
      {loading ? <div className="card"><p>Loading assignments...</p></div> : assignments.length === 0 ? (
        <div className="card"><p>You have no assignments right now. Enjoy your free time!</p></div>
      ) : (
        <div className="linways-table-container">
          <table className="linways-table">
            <thead>
              <tr className="linways-table-header-row"><th colSpan="5">MY ASSIGNMENTS</th></tr>
              <tr>
                <th style={{ textAlign: 'left' }}>TITLE</th>
                <th>SUBJECT</th>
                <th>DUE DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => {
                const isSubmitted = assignment.status === "Submitted";
                const isOverdue = new Date(assignment.due_date) < new Date() && !isSubmitted;
                return (
                  <tr key={assignment.id}>
                    <td style={{ textAlign: 'left', fontWeight: 500, textDecoration: isSubmitted ? 'line-through' : 'none', color: isSubmitted ? '#888' : '#333' }}>{assignment.title}</td>
                    <td>{assignment.subject}</td>
                    <td style={{ color: isOverdue ? '#ef4444' : '#333' }}><Clock size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />{new Date(assignment.due_date).toLocaleDateString()}</td>
                    <td>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: isSubmitted ? '#dcfce7' : isOverdue ? '#fee2e2' : '#fef9c3', color: isSubmitted ? '#22c55e' : isOverdue ? '#ef4444' : '#ca8a04' }}>
                        {isSubmitted ? 'Submitted' : isOverdue ? 'Overdue' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {!isSubmitted ? (
                        <button className="filter-btn" onClick={() => handleSubmit(assignment.id)}>Submit</button>
                      ) : (
                        <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}><CheckCircle size={14} /> Done</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ErpLayout>
  );
}
