import { useState, useEffect } from 'react';
import { fetchSyllabus, toggleSyllabusTopic } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { CheckCircle2, Circle } from 'lucide-react';

export default function SyllabusPage() {
  const [syllabusData, setSyllabusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSyllabus(); }, []);

  const loadSyllabus = async () => {
    try {
      const data = await fetchSyllabus();
      setSyllabusData(data?.syllabus || []);
    } catch (err) { console.error("Failed to load syllabus", err); }
    finally { setLoading(false); }
  };

  const handleToggle = async (topicId) => {
    try {
      setSyllabusData(prev => prev.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic => 
          topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
        )
      })));
      await toggleSyllabusTopic(topicId);
    } catch (err) {
      await loadSyllabus();
      alert("Failed to update topic status.");
    }
  };

  return (
    <ErpLayout title="CURRICULUM / ACADEMIC PATHWAY">
      {loading ? (
        <div className="card"><p>Loading syllabus...</p></div>
      ) : syllabusData.length === 0 ? (
        <div className="card"><p>No syllabus data available.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {syllabusData.map((subject) => {
            const completedCount = subject.topics.filter(t => t.completed).length;
            const totalCount = subject.topics.length;
            const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

            return (
              <div key={subject.subject_id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="section-title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{subject.subject_name}</h3>
                  <span style={{ fontWeight: 'bold', color: progress === 100 ? '#22c55e' : 'var(--primary)' }}>
                    {progress}% Completed
                  </span>
                </div>

                <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: progress === 100 ? '#22c55e' : 'var(--primary)', transition: 'width 0.3s ease' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {subject.topics.map((topic) => (
                    <div 
                      key={topic.id} 
                      onClick={() => handleToggle(topic.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '4px', border: '1px solid var(--border-light)', cursor: 'pointer', backgroundColor: topic.completed ? 'rgba(34, 197, 94, 0.05)' : 'transparent' }}
                    >
                      {topic.completed ? <CheckCircle2 size={20} color="#22c55e" /> : <Circle size={20} color="#888" />}
                      <span style={{ fontSize: '0.9rem', color: topic.completed ? '#888' : '#333', textDecoration: topic.completed ? 'line-through' : 'none' }}>
                        {topic.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ErpLayout>
  );
}
