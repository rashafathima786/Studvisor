import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../services/api';
import Header from '../components/Header';
import { Megaphone, AlertCircle, Info, CalendarClock } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data?.announcements || []);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'urgent': return <AlertCircle size={24} color="#ff4d4f" />;
      case 'academic': return <CalendarClock size={24} color="var(--primary-color)" />;
      default: return <Info size={24} color="var(--secondary-color, #1890ff)" />;
    }
  };

  return (
    <div className="page-container">
      <Header title="Announcements" subtitle="Official notices and campus updates" />

      <div className="card" style={{ marginTop: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Megaphone size={24} color="var(--primary-color)" /> Bulletin Board
        </h2>

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No recent announcements.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {announcements.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: `1px solid ${item.type === 'urgent' ? 'rgba(255, 77, 79, 0.3)' : 'var(--border-color)'}`,
                  backgroundColor: item.type === 'urgent' ? 'rgba(255, 77, 79, 0.02)' : 'white'
                }}
              >
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', height: 'fit-content' }}>
                  {getIconForType(item.type)}
                </div>
                
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: item.type === 'urgent' ? '#ff4d4f' : 'var(--text-color)' }}>
                      {item.title}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>
                  
                  <p style={{ margin: 0, color: 'var(--text-color)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                    {item.content}
                  </p>
                  
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <span className="pill-badge" style={{ backgroundColor: 'var(--bg-secondary)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                      {item.department || 'General'}
                    </span>
                    {item.type === 'urgent' && (
                      <span className="pill-badge" style={{ backgroundColor: 'rgba(255, 77, 79, 0.1)', color: '#ff4d4f', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                        Important
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
