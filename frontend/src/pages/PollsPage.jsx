import { useState, useEffect } from 'react';
import { fetchPolls, votePoll } from '../services/api';
import ErpLayout from '../components/ErpLayout';

export default function PollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPolls(); }, []);

  const loadPolls = async () => {
    try { const data = await fetchPolls(); setPolls(data?.polls || []); }
    catch (err) { console.error("Failed to load polls", err); }
    finally { setLoading(false); }
  };

  const handleVote = async (pollId, optionId) => {
    try { await votePoll(pollId, optionId); await loadPolls(); }
    catch (err) { alert("Failed to cast vote. You might have already voted."); }
  };

  return (
    <ErpLayout title="CAMPUS POLLS">
      <div className="card">
        <h3 className="section-title">Active Polls</h3>
        {loading ? <p>Loading polls...</p> : polls.length === 0 ? <p>No active polls at the moment.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              return (
                <div key={poll.id} style={{ border: '1px solid var(--border-light)', borderRadius: '4px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{poll.question}</h4>
                    <span className="faculty-badge">{poll.category}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {poll.options.map((opt) => {
                      const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                      const hasVoted = poll.user_voted;
                      return (
                        <div key={opt.id} style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--border-light)', cursor: hasVoted ? 'default' : 'pointer' }} onClick={() => !hasVoted && handleVote(poll.id, opt.id)}>
                          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${percentage}%`, backgroundColor: 'var(--primary)', opacity: 0.1, zIndex: 0, transition: 'width 0.5s ease' }}></div>
                          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <span style={{ fontWeight: 500 }}>{opt.text}</span>
                            {hasVoted ? <span style={{ fontSize: '0.85rem', color: '#888' }}>{percentage}% ({opt.votes} votes)</span> : <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Vote</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#888' }}>Total votes: {totalVotes}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
