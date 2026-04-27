import { useState, useEffect } from 'react';
import { fetchNotes, createNote, rateNote } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { ThumbsUp, ThumbsDown, Download, PlusCircle } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => { loadNotes(); }, []);

  const loadNotes = async () => {
    try { const data = await fetchNotes(); setNotes(data?.notes || []); }
    catch (err) { console.error("Failed to load notes", err); }
    finally { setLoading(false); }
  };

  const handlePostNote = async (e) => {
    e.preventDefault();
    if (!title || !subject || !link) return;
    try { await createNote({ title, subject, file_url: link }); setShowModal(false); setTitle(''); setSubject(''); setLink(''); await loadNotes(); }
    catch (err) { alert("Failed to upload note."); }
  };

  const handleRate = async (noteId, isHelpful) => {
    try { await rateNote(noteId, isHelpful); await loadNotes(); }
    catch (err) { alert("Failed to rate note."); }
  };

  return (
    <ErpLayout title="STUDY RESOURCES">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="filter-btn" onClick={() => setShowModal(true)}><PlusCircle size={14} /> Upload Notes</button>
      </div>

      {loading ? <div className="card"><p>Loading resources...</p></div> : notes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No notes shared yet</h3>
          <p style={{ color: '#888' }}>Be the first to share helpful study materials with your peers!</p>
        </div>
      ) : (
        <div className="course-grid">
          {notes.map((note) => (
            <div key={note.id} className="course-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div className="course-title">{note.title}</div>
                <span className="faculty-badge">{note.subject}</span>
              </div>
              <p className="course-subtitle" style={{ flexGrow: 1 }}>Uploaded by: <strong>{note.uploader_name || 'Anonymous'}</strong></p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleRate(note.id, true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e' }}><ThumbsUp size={16} /> {note.helpful_count || 0}</button>
                  <button onClick={() => handleRate(note.id, false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}><ThumbsDown size={16} /> {note.not_helpful_count || 0}</button>
                </div>
                <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="filter-btn"><Download size={14} /> Open</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 className="section-title">Upload Study Material</h3>
            <form onSubmit={handlePostNote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="linways-input-group"><label>Title / Topic</label><input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 4 Summary" /></div>
              <div className="linways-input-group"><label>Subject</label><input required type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Physics 101" /></div>
              <div className="linways-input-group"><label>Document Link (Google Drive / PDF)</label><input required type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="linways-btn-outline" style={{ width: 'auto', padding: '8px 20px' }}>Cancel</button>
                <button type="submit" className="linways-btn-primary" style={{ width: 'auto', padding: '8px 20px' }}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
