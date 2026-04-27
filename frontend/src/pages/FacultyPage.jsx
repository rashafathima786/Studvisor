import { useState, useEffect } from 'react';
import { fetchFaculty } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { Users, Mail, Phone, BookOpen, Search } from 'lucide-react';

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadFaculty(); }, []);

  const loadFaculty = async () => {
    try { const data = await fetchFaculty(); setFacultyList(data?.faculty || []); }
    catch (err) { console.error("Failed to load faculty", err); }
    finally { setLoading(false); }
  };

  const filteredFaculty = facultyList.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ErpLayout title="FACULTY DIRECTORY">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <div className="sidebar-search" style={{ background: 'white', border: '1px solid var(--border-light)', maxWidth: '300px', width: '100%' }}>
          <Search size={16} color="#aaa" />
          <input type="text" placeholder="Search by name or department..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ color: '#333' }} />
        </div>
      </div>

      {loading ? <div className="card"><p>Loading faculty directory...</p></div> : filteredFaculty.length === 0 ? <div className="card"><p>No faculty members found.</p></div> : (
        <div className="course-grid">
          {filteredFaculty.map((person) => (
            <div key={person.id} className="course-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {person.image_url ? (
                <img src={person.image_url} alt={person.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Users size={40} color="#ccc" />
                </div>
              )}
              <div className="course-title">{person.name}</div>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', margin: '4px 0 12px' }}>{person.designation}</p>
              <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#777', textAlign: 'left', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={14} /> {person.department}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> <a href={`mailto:${person.email}`} style={{ color: '#333', textDecoration: 'none' }}>{person.email || 'N/A'}</a></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {person.phone || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ErpLayout>
  );
}
