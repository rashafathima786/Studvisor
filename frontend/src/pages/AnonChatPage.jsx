import { useState, useEffect, useRef } from 'react'
import ErpLayout from '../components/ErpLayout'
import { fetchAnonPosts, createAnonPost, reactToPost } from '../services/api'
import { Send, Search, MoreVertical, ThumbsUp, Heart, Smile, AlertTriangle, Shield } from 'lucide-react'

export default function AnonChatPage() {
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState("General")
  const [newContent, setNewContent] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const channels = [
    { id: "General", name: "Campus General", desc: "Open discussions", icon: "🏫" },
    { id: "Confessions", name: "Confessions", desc: "Anonymous secrets", icon: "🤫" },
    { id: "Questions", name: "Academic Q&A", desc: "Help with studies", icon: "📚" },
    { id: "Clubs", name: "Club Activities", desc: "Events & updates", icon: "🎭" },
    { id: "Funny", name: "Memes & Jokes", desc: "Campus humor", icon: "😂" }
  ]

  const emojis = { 
    "thumbs_up": <ThumbsUp size={12} />, 
    "heart": <Heart size={12} />, 
    "laugh": <Smile size={12} /> 
  }

  function loadWall() {
    fetchAnonPosts(category, "recent").then(res => {
      // Reverse so newest is at the bottom like WhatsApp
      setPosts((res?.posts || []).reverse())
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    loadWall()
  }, [category])

  useEffect(() => {
    // Scroll to bottom when posts change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [posts])

  async function handleSend(e) {
    e.preventDefault()
    if (!newContent.trim()) return
    try {
      await createAnonPost({ content: newContent, category })
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
      console.error(err)
    }
  }

  const activeChannel = channels.find(c => c.id === category) || channels[0]

  return (
    <ErpLayout title="Campus Connect" subtitle="Anonymous real-time messaging platform">
      <div className="wa-container">
        
        {/* Sidebar: Channel List */}
        <div className="wa-sidebar">
          <div className="wa-sidebar-header">
            <h2>Channels</h2>
            <MoreVertical size={20} color="#6b7280" style={{ cursor: 'pointer' }} />
          </div>
          
          <div style={{ padding: '12px 16px' }}>
            <div className="input-with-icon" style={{ borderRadius: '99px', padding: '0 12px' }}>
              <Search size={16} />
              <input type="text" placeholder="Search channels..." style={{ padding: '10px 0', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div className="wa-chat-list">
            {channels.map(c => (
              <div 
                key={c.id} 
                className={`wa-chat-item ${category === c.id ? 'active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <div className="wa-chat-icon">{c.icon}</div>
                <div className="wa-chat-info">
                  <div className="wa-chat-name">{c.name}</div>
                  <div className="wa-chat-preview">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="wa-chat-area">
          
          <div className="wa-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="wa-chat-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', color: '#fff' }}>
                {activeChannel.icon}
              </div>
              <div className="wa-chat-header-info">
                <h3>{activeChannel.name}</h3>
                <p>Protected by AI Moderation</p>
              </div>
            </div>
            <Search size={20} color="#6b7280" style={{ cursor: 'pointer' }} />
          </div>

          <div className="wa-messages">
            {loading ? (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>Syncing messages...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>No messages yet. Say hi!</div>
            ) : (
              posts.map((post, idx) => {
                // Simulate "incoming" vs "outgoing" randomly for visual variety since it's anonymous
                // We'll use post.id to deterministically assign outgoing vs incoming
                const isOutgoing = (post.id % 3) === 0
                const reacts = post.reactions || {}
                
                return (
                  <div key={post.id} className={`wa-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                    {post.censored_content && post.censored_content !== post.content && (
                      <div style={{ fontSize: '0.7rem', color: '#ef4444', marginBottom: '4px', alignSelf: isOutgoing ? 'flex-end' : 'flex-start' }}>
                        <Shield size={10} style={{ display: 'inline', marginRight: '2px' }} /> Auto-Censored
                      </div>
                    )}
                    
                    <div className={`wa-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`}>
                      {post.censored_content || post.content}
                      <div className="wa-bubble-meta">
                        <span>Anonymous ID: {post.id.toString().padStart(4, '0')}</span>
                        <span>{new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    
                    {/* Reactions Pill */}
                    <div className="wa-bubble-reactions">
                      {['thumbs_up', 'heart', 'laugh'].map(rt => {
                        const count = (reacts[rt] || []).length
                        if (count === 0) return null
                        return (
                          <div key={rt} className="wa-reaction-pill" onClick={() => handleReact(post.id, rt)}>
                            {emojis[rt]} {count}
                          </div>
                        )
                      })}
                      <div className="wa-reaction-pill" onClick={() => handleReact(post.id, 'thumbs_up')} style={{ opacity: 0.5 }}>+</div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="wa-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              className="wa-input" 
              placeholder="Type an anonymous message..." 
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="wa-send-btn" disabled={!newContent.trim() || loading}>
              <Send size={20} />
            </button>
          </form>

        </div>
      </div>
    </ErpLayout>
  )
}
