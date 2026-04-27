import { useState, useEffect } from 'react';
import { fetchLostFound, createLostFoundItem } from '../services/api';
import Header from '../components/Header';
import { Search, MapPin, Calendar, PlusCircle } from 'lucide-react';

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState('lost');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadItems();
  }, [filter]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchLostFound(filter === 'all' ? null : filter);
      setItems(data?.items || []);
    } catch (err) {
      console.error("Failed to load lost & found", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostItem = async (e) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    try {
      await createLostFoundItem({
        title,
        description,
        item_type: itemType,
        location,
        date: new Date().toISOString().split('T')[0]
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setLocation('');
      await loadItems();
    } catch (err) {
      alert("Failed to post item.");
    }
  };

  return (
    <div className="page-container">
      <Header title="Lost & Found" subtitle="Help the community recover lost items" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setFilter('all')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'all' ? 'var(--text-color)' : 'var(--bg-secondary)', color: filter === 'all' ? 'white' : 'var(--text-color)', cursor: 'pointer', fontWeight: 'bold' }}>
            All
          </button>
          <button 
            onClick={() => setFilter('lost')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'lost' ? 'var(--danger-color, #ff4d4f)' : 'var(--bg-secondary)', color: filter === 'lost' ? 'white' : 'var(--text-color)', cursor: 'pointer', fontWeight: 'bold' }}>
            Lost
          </button>
          <button 
            onClick={() => setFilter('found')}
            style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'found' ? 'var(--success-color, #52c41a)' : 'var(--bg-secondary)', color: filter === 'found' ? 'white' : 'var(--text-color)', cursor: 'pointer', fontWeight: 'bold' }}>
            Found
          </button>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={18} /> Report Item
        </button>
      </div>

      {loading ? (
        <div className="card"><p>Loading items...</p></div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Search size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3>No items found</h3>
          <p style={{ color: 'var(--text-muted)' }}>There are no {filter !== 'all' ? filter : ''} items reported currently.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ borderTop: `4px solid ${item.item_type === 'lost' ? '#ff4d4f' : '#52c41a'}`, padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.title}</h3>
                <span className="pill-badge" style={{ backgroundColor: item.item_type === 'lost' ? 'rgba(255, 77, 79, 0.1)' : 'rgba(82, 196, 26, 0.1)', color: item.item_type === 'lost' ? '#ff4d4f' : '#52c41a', textTransform: 'uppercase' }}>
                  {item.item_type}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px', flexGrow: 1 }}>{item.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {item.location}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {item.date}</div>
              </div>
              
              <button style={{ width: '100%', padding: '10px', marginTop: '16px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>
                Contact Finder/Owner
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Report Item Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Report an Item</h2>
            <form onSubmit={handlePostItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Item Type</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" checked={itemType === 'lost'} onChange={() => setItemType('lost')} /> Lost
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" checked={itemType === 'found'} onChange={() => setItemType('found')} /> Found
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Blue Water Bottle" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Detailed description of the item..." rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Location</label>
                <input required type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Where was it lost/found?" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Post Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
