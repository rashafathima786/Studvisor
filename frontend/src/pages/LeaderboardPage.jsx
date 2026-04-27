import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/api';
import ErpLayout from '../components/ErpLayout';
import { Trophy, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLeaderboard(); }, []);

  const loadLeaderboard = async () => {
    try { const data = await fetchLeaderboard('merit'); setLeaderboard(data?.leaderboard || []); }
    catch (err) { console.error("Failed to load leaderboard", err); }
    finally { setLoading(false); }
  };

  return (
    <ErpLayout title="LEADERBOARD">
      <div className="card">
        <h3 className="section-title">Campus Rankings</h3>
        {loading ? <p>Loading rankings...</p> : leaderboard.length === 0 ? <p>Leaderboard is currently empty.</p> : (
          <div className="linways-table-container">
            <table className="linways-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>RANK</th>
                  <th style={{ textAlign: 'left' }}>STUDENT</th>
                  <th style={{ textAlign: 'left' }}>DEPARTMENT</th>
                  <th>SCORE</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((student, index) => (
                  <tr key={student.id} style={{ backgroundColor: index < 3 ? '#f0f7ff' : 'transparent' }}>
                    <td style={{ fontWeight: 700, color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#333' }}>
                      {index < 3 ? (index === 0 ? <Trophy size={18} color="#FFD700" /> : <Medal size={18} color={index === 1 ? '#C0C0C0' : '#CD7F32'} />) : `#${index + 1}`}
                    </td>
                    <td style={{ textAlign: 'left', fontWeight: 500 }}>{student.name}</td>
                    <td style={{ textAlign: 'left', color: '#777' }}>{student.department} • Year {student.year}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{student.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
