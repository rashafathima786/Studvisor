import { useState, useEffect } from 'react'
import ErpLayout from '../components/ErpLayout'
import { fetchAnonPosts, createAnonPost, reactToPost, fetchMeritStatus } from '../services/api'
import { 
  MessageSquare, Flame, Clock, Hash, AlertTriangle, 
  ThumbsUp, Heart, Smile, Frown, Shield
} from 'lucide-react'

export default function AnonChatPage() {
  const [posts, setPosts] = useState([])
  const [merit, setMerit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState("recent")
  const [showModal, setShowModal] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newCategory, setNewCategory] = useState('General')

  const categories = ["All", "General", "Confessions", "Questions", "Clubs", "Funny", "Vent"]

  function loadWall() {
    Promise.all([
      fetchAnonPosts(category === "All" ? null : category, sortBy).catch(() => null),
      fetchMeritStatus().catch(() => null)
    ]).then(([pRes, mRes]) => {
      setPosts(pRes?.posts || [])
      setMerit(mRes || null)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadWall()
  }, [category, sortBy])

  async function handlePost() {
    if (!newContent.trim()) return
    try {
      await createAnonPost({ content: newContent, category: newCategory })
      setShowModal(false)
      setNewContent('')
      loadWall()
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to post")
    }
  }

  async function handleReact(postId, reactionType) {
    try {
      await reactToPost(postId, reactionType)
      loadWall()
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to react")
    }
  }

  if (loading) return (
    <div className="page-loader">
       <div className="loader-card"><h2>Campus Wall</h2><p>Syncing anonymous feed...</p></div>
    </div>
  )

  const emojis = { "thumbs_up": <ThumbsUp size={14} />, "heart": <Heart size={14} />, "laugh": <Smile size={14} />, "shock": <AlertTriangle size={14} />, "flag": <Frown size={14} /> }

  return (
    <ErpLayout title="Campus Wall" subtitle="Anonymous discussions, confessions, and unfiltered campus life. Moderated by Nexus AI.">
      
      <div className="campus-wall-header">
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button className="primary-btn compact-btn" onClick={() => setShowModal(true)}>
            + Create Anonymous Post
          </button>
          
          {merit && (
            <div className={`merit-badge merit-${merit.status === 'Excellent' ? 'green' : merit.status === 'Warning' ? 'orange' : merit.status === 'Critical' ? 'red' : 'blue'}`}>
              <Shield size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
              {merit.tier} Tier ({merit.score} pts)
            </div>
          )}
        </div>

        <div>
          <div className="category-tabs compact">
            {categories.map(c => (
              <button 
                key={c} 
                className={`category-tab ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c === "All" ? "All Posts" : `#${c}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sort-row">
        <button className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`} onClick={() => setSortBy('recent')}>
          <Clock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}/> Recent
        </button>
        <button className={`sort-btn ${sortBy === 'trending' ? 'active' : ''}`} onClick={() => setSortBy('trending')}>
          <Flame size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }}/> Trending
        </button>
      </div>

      <div className="anon-feed">
        {posts.length === 0 ? (
           <div className="empty-state card">No posts found in this category. Be the first to break the silence!</div>
        ) : (
          posts.map(post => {
            const reacts = post.reactions || {}
            return (
              <div key={post.id} className={`anon-post-card ${post.is_flagged ? 'flagged' : ''}`}>
                <div className="anon-post-header">
                  <span className="anon-post-category" style={{ background: 'var(--accent)' }}>#{post.category}</span>
                  <span className="anon-post-time">{new Date(post.created_at).toLocaleString()}</span>
                </div>
                
                {post.censored_content && post.censored_content !== post.content && (
                  <div className="censored-badge">
                    <Shield size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                    Auto-Censored by Nexus AI
                  </div>
                )}
                
                <div className="anon-post-content">
                  {post.censored_content || post.content}
                </div>
                
                <div className="anon-reactions">
                  {['thumbs_up', 'heart', 'laugh', 'shock'].map(rt => (
                    <button key={rt} className="reaction-btn" onClick={() => handleReact(post.id, rt)}>
                      {emojis[rt]} {(reacts[rt] || []).length}
                    </button>
                  ))}
                  
                  <button className="reaction-btn flag-btn" onClick={() => handleReact(post.id, 'flag')}>
                    {emojis['flag']} Flag
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>New Anonymous Post</h3>
            <p className="modal-subtitle">
              Your identity is hidden, but your Merit Score is tied to this post. 
              Violation of guidelines will result in automatic point deductions.
            </p>
            
            <div className="erp-form">
              <label>
                Category
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                  {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              
              <label>
                Message
                <textarea 
                  rows={4} 
                  placeholder="What's on your mind? Keep it respectful."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                />
              </label>
            </div>
            
            <div className="modal-actions">
              <button className="outline-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="primary-btn compact-btn" onClick={handlePost}>Post Anonymously</button>
            </div>
          </div>
        </div>
      )}

    </ErpLayout>
  )
}
