import { useState, useEffect } from 'react';
import { fetchAchievements } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { Award, Star, Zap, BookOpen } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAchievements(); }, []);

  const loadAchievements = async () => {
    try { const data = await fetchAchievements(); setAchievements(data?.achievements || []); }
    catch (err) { console.error("Failed to load achievements", err); }
    finally { setLoading(false); }
  };

  return (
    <ErpLayout title="ACHIEVEMENTS">
      {loading ? <div className="card"><p>Loading achievements...</p></div> : achievements.length === 0 ? (
        <div className="card"><p>No recent achievements to display.</p></div>
      ) : (
        <div className="course-grid">
          {achievements.map((item) => (
            <div key={item.id} className="course-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '16px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', gap: '12px', margin: '-24px -24px 16px -24px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.category === 'sports' ? <Zap size={20} /> : item.category === 'academic' ? <BookOpen size={20} /> : <Star size={20} />}
                </div>
                <div>
                  <div className="course-title" style={{ margin: 0 }}>{item.title}</div>
                  <div className="course-subtitle" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>{item.category}</div>
                </div>
              </div>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.5', flexGrow: 1 }}>{item.description}</p>
              <div style={{ padding: '12px', backgroundColor: '#f0f7ff', borderRadius: '4px', borderLeft: '4px solid var(--primary)', marginTop: '8px' }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>{item.winner_name}</p>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.8rem' }}>Awarded on {item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ErpLayout>
  );
}
