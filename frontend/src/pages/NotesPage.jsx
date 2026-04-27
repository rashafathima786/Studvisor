import { useState, useEffect } from 'react';
import { fetchNotes, createNote, rateNote } from '../services/api';
import Header from '../components/Header';
import { BookOpen, ThumbsUp, ThumbsDown, Download, PlusCircle, FileText } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes();
      setNotes(data?.notes || []);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNote = async (e) => {
    e.preventDefault();
    if (!title || !subject || !link) return;

    try {
      await createNote({ title, subject, file_url: link });
      setShowModal(false);
      setTitle('');
      setSubject('');
      setLink('');
      await loadNotes();
    } catch (err) {
      alert("Failed to upload note.");
    }
  };

  const handleRate = async (noteId, isHelpful) => {
    try {
      await rateNote(noteId, isHelpful);
      await loadNotes();
    } catch (err) {
      alert("Failed to rate note.");
    }
  };

  return (
    <div className="page-container">
      <Header title="Notes Sharing" subtitle="Collaborate and share study materials" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <FileText size={24} color="var(--primary-color)" /> Study Resources
        </h2>
        
        <button 
          onClick={() => setShowModal(true)}
          style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={18} /> Upload Notes
        </button>
      </div>

      {loading ? (
        <div className="card"><p>Loading resources...</p></div>
      ) : notes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3>No notes shared yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Be the first to share helpful study materials with your peers!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {notes.map((note) => (
            <div key={note.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{note.title}</h3>
                <span className="pill-badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-color)' }}>
                  {note.subject}
                </span>
              </div>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', flexGrow: 1 }}>
                Uploaded by: <strong style={{ color: 'var(--text-color)' }}>{note.uploader_name || 'Anonymous'}</strong>
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleRate(note.id, true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success-color, #52c41a)' }}>
                    <ThumbsUp size={16} /> {note.helpful_count || 0}
                  </button>
                  <button onClick={() => handleRate(note.id, false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--danger-color, #ff4d4f)' }}>
                    <ThumbsDown size={16} /> {note.not_helpful_count || 0}
                  </button>
                </div>
                
                <a href={note.file_url} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  <Download size={16} /> Open
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Upload Study Material</h2>
            <form onSubmit={handlePostNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title / Topic</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 4 Summary" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Subject</label>
                <input required type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics 101" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Document Link (Google Drive / PDF)</label>
                <input required type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-secondary)', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
