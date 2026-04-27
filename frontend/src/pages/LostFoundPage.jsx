import { useState, useEffect } from 'react';
import { fetchLostFound, createLostFoundItem } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { MapPin, Calendar, PlusCircle } from 'lucide-react';

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState('lost');
  const [location, setLocation] = useState('');

  useEffect(() => { loadItems(); }, [filter]);

  const loadItems = async () => {
    setLoading(true);
    try { const data = await fetchLostFound(filter === 'all' ? null : filter); setItems(data?.items || []); }
    catch (err) { console.error("Failed to load lost & found", err); }
    finally { setLoading(false); }
  };

  const handlePostItem = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) return;
    try {
      await createLostFoundItem({ title, description, item_type: itemType, location, date: new Date().toISOString().split('T')[0] });
      setShowModal(false); setTitle(''); setDescription(''); setLocation(''); await loadItems();
    } catch (err) { alert("Failed to post item."); }
  };

  return (
    <ErpLayout title="LOST & FOUND">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="tabs-container" style={{ marginBottom: 0, flex: 1 }}>
          {['all', 'lost', 'found'].map(f => (
            <div key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>{f === 'all' ? 'All Items' : f}</div>
          ))}
        </div>
        <button className="filter-btn" onClick={() => setShowModal(true)}><PlusCircle size={14} /> Report Item</button>
      </div>

      {loading ? <div className="card"><p>Loading items...</p></div> : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}><h3>No items found</h3><p style={{ color: '#888' }}>No {filter !== 'all' ? filter : ''} items reported currently.</p></div>
      ) : (
        <div className="course-grid">
          {items.map((item) => (
            <div key={item.id} className="course-card" style={{ borderTop: `4px solid ${item.item_type === 'lost' ? '#ef4444' : '#22c55e'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div className="course-title">{item.title}</div>
                <span className="faculty-badge" style={{ color: item.item_type === 'lost' ? '#ef4444' : '#22c55e', borderColor: item.item_type === 'lost' ? '#ef4444' : '#22c55e' }}>{item.item_type.toUpperCase()}</span>
              </div>
              <p className="course-subtitle">{item.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: '#888' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {item.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {item.date}</div>
              </div>
              <button className="filter-btn" style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}>Contact Finder/Owner</button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 className="section-title">Report an Item</h3>
            <form onSubmit={handlePostItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={itemType === 'lost'} onChange={() => setItemType('lost')} /> Lost</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="radio" checked={itemType === 'found'} onChange={() => setItemType('found')} /> Found</label>
              </div>
              <div className="linways-input-group"><label>Title</label><input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blue Water Bottle" /></div>
              <div className="linways-input-group"><label>Description</label><input required type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed description..." /></div>
              <div className="linways-input-group"><label>Location</label><input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Where was it lost/found?" /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="linways-btn-outline" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                <button type="submit" className="linways-btn-primary" style={{ width: 'auto', padding: '8px 20px' }}>Post Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
