import { useState, useEffect } from 'react';
import { fetchExams } from '../services/api';
import Header from '../components/Header';
import { CalendarRange, Clock, MapPin, AlertCircle, BookOpen } from 'lucide-react';

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const data = await fetchExams();
      setExams(data?.exams || []);
    } catch (err) {
      console.error("Failed to load exams", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(dateString);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="page-container">
      <Header title="Exam Schedule" subtitle="Upcoming midterms and final examinations" />

      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <CalendarRange size={24} color="var(--primary-color)" /> Exam Timetable
        </h2>

        {loading ? (
          <p>Loading exam schedule...</p>
        ) : exams.length === 0 ? (
          <p>No exams currently scheduled. Relax!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {exams.map((exam) => {
              const daysUntil = getDaysUntil(exam.date);
              const isUrgent = daysUntil >= 0 && daysUntil <= 3;
              const isPast = daysUntil < 0;

              return (
                <div 
                  key={exam.id} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: '1px solid',
                    borderColor: isPast ? 'var(--border-color)' : isUrgent ? '#ff4d4f' : 'var(--primary-color)',
                    backgroundColor: isPast ? 'var(--bg-secondary)' : 'white',
                    opacity: isPast ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={20} color="var(--primary-color)" /> {exam.subject}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{exam.exam_type} Examination</p>
                    </div>
                    
                    {!isPast && (
                      <span className="pill-badge" style={{ backgroundColor: isUrgent ? 'rgba(255, 77, 79, 0.1)' : 'rgba(var(--primary-rgb), 0.1)', color: isUrgent ? '#ff4d4f' : 'var(--primary-color)', fontWeight: 'bold' }}>
                        {daysUntil === 0 ? 'TODAY' : daysUntil === 1 ? 'TOMORROW' : `In ${daysUntil} days`}
                      </span>
                    )}
                    {isPast && (
                      <span className="pill-badge" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                        Completed
                      </span>
                    )}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', backgroundColor: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
                      <CalendarRange size={18} color="var(--text-muted)" />
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date</div>
                        <div style={{ fontWeight: 'bold' }}>{exam.date}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
                      <Clock size={18} color="var(--text-muted)" />
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time</div>
                        <div style={{ fontWeight: 'bold' }}>{exam.time}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
                      <MapPin size={18} color="var(--text-muted)" />
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room</div>
                        <div style={{ fontWeight: 'bold' }}>{exam.room || 'TBA'}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
                      <AlertCircle size={18} color="var(--text-muted)" />
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Syllabus</div>
                        <div style={{ fontWeight: 'bold' }}>{exam.syllabus_covered || 'Full syllabus'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
