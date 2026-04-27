import { Bell, Grid } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchProfile } from '../services/api'

export default function Header() {
  const [profile, setProfile] = useState({ name: "AVVARI NAGA HA..", student_id: "CAUG23-1492" })

  useEffect(() => {
    fetchProfile().then(res => {
      if(res) {
        setProfile({
          name: res.name || res.full_name || "AVVARI NAGA HA..",
          student_id: res.student_id || res.username || "CAUG23-1492"
        })
      }
    }).catch(() => {})
  }, [])

  return (
    <div className="dashboard-header">
      <div className="header-title">CHRIST ACADEMY INSTITUTE FOR ADVANCED STUDIES</div>

      <div className="header-actions">
        <div className="student-pill">STUDENT</div>
        
        <div className="header-icon">
          <Bell size={20} />
          <div className="notif-dot"></div>
        </div>

        <div className="header-icon">
          <Grid size={20} />
        </div>

        <div className="profile-area">
          <img 
            src="https://ui-avatars.com/api/?name=Avvari+Naga&background=f4f6f8&color=333" 
            alt="Profile" 
            className="profile-pic"
          />
          <div className="profile-info">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-id">Adm No: {profile.student_id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
