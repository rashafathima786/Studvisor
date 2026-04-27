import { useState, useEffect } from 'react';
import { fetchEvents, rsvpEvent } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { CalendarDays, MapPin, Users, CheckCircle } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try { const data = await fetchEvents(); setEvents(data?.events || []); }
    catch (err) { console.error("Failed to load events", err); }
    finally { setLoading(false); }
  };

  const handleRsvp = async (eventId) => {
    try { await rsvpEvent(eventId); await loadEvents(); }
    catch (err) { alert("Failed to RSVP. Please try again later."); }
  };

  return (
    <ErpLayout title="CAMPUS EVENTS">
      {loading ? <div className="card"><p>Loading events...</p></div> : events.length === 0 ? (
        <div className="card"><p>No upcoming events scheduled right now.</p></div>
      ) : (
        <div className="course-grid">
          {events.map((evt) => {
            const isRsvped = evt.user_rsvped;
            const eventDate = new Date(evt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={evt.id} className="course-card" style={{ display: 'flex', flexDirection: 'column' }}>
                {evt.image_url ? (
                  <img src={evt.image_url} alt={evt.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
                ) : (
                  <div style={{ width: '100%', height: '80px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '12px' }}>
                    <CalendarDays size={32} color="#ccc" />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div className="course-title">{evt.title}</div>
                  <span className="faculty-badge">{evt.category || 'General'}</span>
                </div>
                <p className="course-subtitle" style={{ flexGrow: 1 }}>{evt.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', fontSize: '0.85rem', color: '#777' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={14} /> {eventDate}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {evt.location || 'TBA'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {evt.rsvp_count || 0} Attending</div>
                </div>
                <button onClick={() => !isRsvped && handleRsvp(evt.id)} disabled={isRsvped} className={isRsvped ? "linways-btn-outline" : "linways-btn-primary"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isRsvped ? <><CheckCircle size={16} color="#22c55e" /> RSVP Confirmed</> : 'RSVP Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ErpLayout>
  );
}
