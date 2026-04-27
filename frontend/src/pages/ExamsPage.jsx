import { useState, useEffect } from 'react';
import { fetchExams } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { Clock, MapPin, BookOpen } from 'lucide-react';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadExams(); }, []);

  const loadExams = async () => {
    try { const data = await fetchExams(); setExams(data?.exams || []); }
    catch (err) { console.error("Failed to load exams", err); }
    finally { setLoading(false); }
  };

  const getDaysUntil = (dateString) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const examDate = new Date(dateString);
    return Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <ErpLayout title="EXAM SCHEDULE">
      {loading ? <div className="card"><p>Loading exam schedule...</p></div> : exams.length === 0 ? (
        <div className="card"><p>No exams currently scheduled. Relax!</p></div>
      ) : (
        <div className="linways-table-container">
          <table className="linways-table">
            <thead>
              <tr className="linways-table-header-row"><th colSpan="6">EXAM TIMETABLE</th></tr>
              <tr>
                <th>SUBJECT</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>ROOM</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => {
                const daysUntil = getDaysUntil(exam.date);
                const isPast = daysUntil < 0;
                const isUrgent = daysUntil >= 0 && daysUntil <= 3;
                return (
                  <tr key={exam.id} style={{ opacity: isPast ? 0.6 : 1 }}>
                    <td style={{ textAlign: 'left', fontWeight: 500 }}><BookOpen size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />{exam.subject}</td>
                    <td>{exam.exam_type}</td>
                    <td>{exam.date}</td>
                    <td><Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />{exam.time}</td>
                    <td><MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />{exam.room || 'TBA'}</td>
                    <td style={{ color: isPast ? '#888' : isUrgent ? '#ef4444' : '#22c55e', fontWeight: 600 }}>
                      {isPast ? 'Completed' : daysUntil === 0 ? 'TODAY' : daysUntil === 1 ? 'TOMORROW' : `In ${daysUntil} days`}
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
