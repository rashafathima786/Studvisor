import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { AlertCircle, Info, CalendarClock } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAnnouncements(); }, []);

  const loadAnnouncements = async () => {
    try { const data = await fetchAnnouncements(); setAnnouncements(data?.announcements || []); }
    catch (err) { console.error("Failed to load announcements", err); }
    finally { setLoading(false); }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'urgent': return <AlertCircle size={20} color="#ef4444" />;
      case 'academic': return <CalendarClock size={20} color="var(--primary)" />;
      default: return <Info size={20} color="#007bff" />;
    }
  };

  return (
    <ErpLayout title="ANNOUNCEMENTS">
      {loading ? <div className="card"><p>Loading announcements...</p></div> : announcements.length === 0 ? (
        <div className="card"><p>No recent announcements.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: '16px', borderLeft: `4px solid ${item.type === 'urgent' ? '#ef4444' : 'var(--primary)'}` }}>
              <div style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#f8f9fa', height: 'fit-content' }}>
                {getIconForType(item.type)}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: item.type === 'urgent' ? '#ef4444' : '#333' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>{item.date}</span>
                </div>
                <p style={{ margin: 0, color: '#555', lineHeight: '1.5', fontSize: '0.9rem' }}>{item.content}</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <span className="faculty-badge">{item.department || 'General'}</span>
                  {item.type === 'urgent' && <span className="faculty-badge" style={{ color: '#ef4444', borderColor: '#ef4444' }}>IMPORTANT</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ErpLayout>
  );
}
