import React, { useState, useRef, useEffect } from 'react'

// ── Date helpers ──────────────────────────────────────────────────────
const getMonday = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

const addWeeks = (date, n) => addDays(date, n * 7)

const monthName = (date) =>
  date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()

const monthYear = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const dayLabel = (date) => {
  const wd = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return `${wd}, ${date.getDate()}`
}

// ── Types ─────────────────────────────────────────────────────────────
// Removed CalEvent interface for JS

// ── Pastel avatar palette ─────────────────────────────────────────────
const AVATAR_COLORS = [
  ['#d4c5a9','#1a1a18'],
  ['#c5b8a9','#1a1a18'],
  ['#a9b8c5','#1a1a18'],
  ['#b8a9c5','#1a1a18'],
  ['#a9c5b8','#1a1a18'],
  ['#c5a9b8','#1a1a18'],
]

// ── Default events (user can edit via dialog) ─────────────────────────
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'DATA STRUCTURES & ALGO',
    dayIndex: 0,
    startHour: 10,
    duration: 2,
    avatarLetters: ['H','R','A'],
    avatarColors: ['0','1','2'],
  },
  {
    id: 2,
    title: 'DESIGN TEAM SYNC',
    dayIndex: 2,
    startHour: 12,
    duration: 2,
    avatarLetters: ['K','M','S'],
    avatarColors: ['3','4','5'],
  },
  {
    id: 3,
    title: 'OPERATING SYSTEMS',
    dayIndex: 1,
    startHour: 9,
    duration: 1.5,
    avatarLetters: ['P'],
    avatarColors: ['2'],
  },
  {
    id: 4,
    title: 'PROJECT MENTORING',
    dayIndex: 3,
    startHour: 13,
    duration: 1.5,
    avatarLetters: ['T','V'],
    avatarColors: ['1','4'],
  },
  {
    id: 5,
    title: 'AI WORKSHOP',
    dayIndex: 4,
    startHour: 10,
    duration: 1.5,
    avatarLetters: ['N','L'],
    avatarColors: ['0','5'],
  },
]

const HOUR_LABELS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM']
const START_HOUR = 8
const END_HOUR   = 16   // 8 visible hours

// ── Avatar bubble ─────────────────────────────────────────────────────
function Avatar({ letter, colorIdx }) {
  const [bg, fg] = AVATAR_COLORS[parseInt(colorIdx) % AVATAR_COLORS.length]
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: bg, color: fg,
      border: '2.5px solid #1a1a18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700, marginLeft: -8, flexShrink: 0,
      fontFamily: 'inherit',
    }}>
      {letter}
    </div>
  )
}

// ── Event pill ────────────────────────────────────────────────────────
function EventPill({
  ev, topPx, heightPx, onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: topPx + 3,
        left: 6,
        right: 6,
        height: Math.max(heightPx - 6, 36),
        background: '#1a1a18',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px 0 20px',
        cursor: 'pointer',
        zIndex: 10,
        userSelect: 'none',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <span style={{
        color: '#f0ede4', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.07em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        fontFamily: 'DM Sans, sans-serif',
        flex: 1,
      }}>
        {ev.title}
      </span>
      {ev.avatarLetters.length > 0 && (
        <div style={{ display: 'flex', marginLeft: 12, paddingLeft: 8, flexShrink: 0 }}>
          {ev.avatarLetters.map((l, i) => (
            <Avatar key={i} letter={l} colorIdx={ev.avatarColors[i] || '0'} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Add/Edit Event Dialog ─────────────────────────────────────────────
function EventDialog({
  event, onSave, onDelete, onClose,
}) {
  const isNew = !event?.id
  const [title, setTitle]     = useState(event?.title || '')
  const [day, setDay]         = useState(event?.dayIndex ?? 0)
  const [startHour, setStart] = useState(event?.startHour ?? 9)
  const [duration, setDur]    = useState(event?.duration ?? 1)

  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN']
  const hourOptions = Array.from({ length: (END_HOUR - START_HOUR) * 2 }, (_, i) => {
    const h = START_HOUR + i * 0.5
    const hr = Math.floor(h)
    const mn = h % 1 === 0.5 ? '30' : '00'
    const ampm = hr < 12 ? 'AM' : 'PM'
    const displayHr = hr > 12 ? hr - 12 : hr
    return { value: h, label: `${displayHr}:${mn} ${ampm}` }
  })
  const durationOptions = [0.5,1,1.5,2,2.5,3,3.5,4].map(d => ({ value: d, label: `${d}h` }))

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      id: event?.id || Date.now(),
      title: title.trim().toUpperCase(),
      dayIndex: day,
      startHour,
      duration,
      avatarLetters: event?.avatarLetters || ['H'],
      avatarColors: event?.avatarColors || ['0'],
    })
  }

  const inp = {
    width: '100%', padding: '8px 12px',
    background: '#f0ede4', border: '1px solid #d8d4c8',
    borderRadius: 8, fontSize: 12, color: '#1a1a18',
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    boxSizing: 'border-box',
  }
  const sel = { ...inp, appearance: 'none', cursor: 'pointer' }
  const lbl = { fontSize: 10, color: '#8b8b82', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5, display: 'block' }
  const fld = { marginBottom: 14 }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,26,24,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }}
      onClick={onClose}
    >
      <div style={{
        background: '#f8f5ee', borderRadius: 18, padding: 28, width: 360,
        border: '1px solid #e0dcd2', fontFamily: 'DM Sans, sans-serif',
      }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a18', margin: 0, fontFamily: 'DM Serif Display, serif' }}>
            {isNew ? 'New Class' : 'Edit Class'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, color: '#8b8b82', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={fld}>
          <label style={lbl}>Subject Name</label>
          <input style={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Machine Learning" autoFocus />
        </div>

        <div style={fld}>
          <label style={lbl}>Day</label>
          <select style={sel} value={day} onChange={e => setDay(Number(e.target.value))}>
            {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={lbl}>Start Time</label>
            <select style={sel} value={startHour} onChange={e => setStart(Number(e.target.value))}>
              {hourOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Duration</label>
            <select style={sel} value={duration} onChange={e => setDur(Number(e.target.value))}>
              {durationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '10px 0', background: '#1a1a18', color: '#f0ede4',
            border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', cursor: 'pointer', textTransform: 'uppercase',
          }}>
            {isNew ? 'Add Class' : 'Save Changes'}
          </button>
          {!isNew && (
            <button onClick={() => onDelete(event.id)} style={{
              padding: '10px 16px', background: '#f5e8e8', color: '#c0392b',
              border: '1px solid #f0d0d0', borderRadius: 10, fontSize: 11,
              fontWeight: 700, cursor: 'pointer',
            }}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main TimetableWidget ──────────────────────────────────────────────
export default function TimetableWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents]           = useState(DEFAULT_EVENTS)
  const [dialog, setDialog]           = useState(null)
  const [dragInfo, setDragInfo]       = useState(null)
  const gridRef = useRef(null)

  const monday = getMonday(currentDate)
  const week   = Array.from({ length: 7 }, (_, i) => addDays(monday, i))

  const prevMonth = monthName(addDays(monday, -7))
  const nextMonth = monthName(addDays(monday,  7))

  // pixel constants
  const ROW_HEIGHT = 52   // px per hour
  const COL_WIDTH  = 0    // auto via grid
  const TIME_WIDTH = 82   // px for time column

  const hourToPx = (h) => (h - START_HOUR) * ROW_HEIGHT
  const pxToHour = (px) => Math.round((px / ROW_HEIGHT + START_HOUR) * 2) / 2

  // Click on empty cell → new event
  const handleCellClick = (dayIndex, e) => {
    if (e.target.closest('.ev-pill')) return
    const rect = e.currentTarget.getBoundingClientRect()
    const py = e.clientY - rect.top
    const snapped = Math.round((py / ROW_HEIGHT + START_HOUR) * 2) / 2
    setDialog({ event: { dayIndex, startHour: Math.min(snapped, END_HOUR - 1) } })
  }

  const handleSave = (ev) => {
    setEvents(prev => prev.some(e => e.id === ev.id)
      ? prev.map(e => e.id === ev.id ? ev : e)
      : [...prev, ev])
    setDialog(null)
  }

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    setDialog(null)
  }

  const totalH = (END_HOUR - START_HOUR) * ROW_HEIGHT

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #e8e5de; }
        .tt-root {
          font-family: 'DM Sans', sans-serif;
          background: #e8e5de;
          border-radius: 20px;
          padding: 24px 24px 20px;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
        }
        /* HEADER */
        .tt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .tt-nav {
          background: #fff;
          border: none;
          border-radius: 40px;
          padding: 12px 22px;
          font-size: 12px;
          font-weight: 700;
          color: #1a1a18;
          cursor: pointer;
          letter-spacing: 0.06em;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .tt-nav:hover { background: #f0ede4; }
        .tt-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #1a1a18;
          font-weight: 400;
          text-align: center;
          flex: 1;
          letter-spacing: -0.01em;
        }
        /* GRID WRAPPER */
        .tt-grid-outer {
          display: flex;
          gap: 0;
        }
        /* TIME COLUMN */
        .tt-times {
          width: ${TIME_WIDTH}px;
          flex-shrink: 0;
          padding-top: 32px; /* offset for day headers */
        }
        .tt-time-cell {
          height: ${ROW_HEIGHT}px;
          display: flex;
          align-items: flex-start;
          padding-top: 2px;
          font-size: 11px;
          color: #8b8b82;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        /* DAYS GRID */
        .tt-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          flex: 1;
          gap: 0;
        }
        /* DAY COLUMN */
        .tt-day-col {
          display: flex;
          flex-direction: column;
          border-left: 1px dashed rgba(26,26,24,0.15);
        }
        .tt-day-col:first-child { border-left: none; }
        /* DAY HEADER */
        .tt-day-head {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #8b8b82;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .tt-day-head.today {
          color: #1a1a18;
        }
        /* EVENTS AREA */
        .tt-events-area {
          position: relative;
          height: ${totalH}px;
          cursor: pointer;
        }
        /* HOUR LINES */
        .tt-hour-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: rgba(26,26,24,0.08);
        }
        /* TODAY HIGHLIGHT */
        .tt-today-col .tt-events-area {
          background: rgba(255,255,255,0.18);
          border-radius: 4px;
        }
        /* ADD BTN */
        .tt-add-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #1a1a18;
          color: #f0ede4;
          border: none;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          transition: transform 0.15s;
        }
        .tt-add-btn:hover { transform: scale(1.08); }
        /* NOW LINE */
        .tt-now-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: #e8948a;
          z-index: 5;
        }
        .tt-now-dot {
          position: absolute;
          left: -4px;
          top: -4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #e8948a;
        }
      `}</style>

      <div className="tt-root">
        {/* HEADER */}
        <div className="tt-header">
          <button className="tt-nav" onClick={() => setCurrentDate(addWeeks(currentDate, -1))}>
            {'< '}{prevMonth}
          </button>
          <h2 className="tt-title">{monthYear(monday)}</h2>
          <button className="tt-nav" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
            {nextMonth}{' >'}
          </button>
        </div>

        {/* GRID */}
        <div className="tt-grid-outer" ref={gridRef}>
          {/* Time column */}
          <div className="tt-times">
            {HOUR_LABELS.map(h => (
              <div key={h} className="tt-time-cell">{h}</div>
            ))}
          </div>

          {/* Day columns */}
          <div className="tt-days-grid">
            {week.map((day, dIdx) => {
              const isToday = day.toDateString() === new Date().toDateString()
              const dayEvs = events.filter(e => e.dayIndex === dIdx)

              // current time line
              const now = new Date()
              const nowH = now.getHours() + now.getMinutes() / 60
              const showNow = isToday && nowH >= START_HOUR && nowH <= END_HOUR
              const nowPx = hourToPx(nowH)

              return (
                <div key={dIdx} className={`tt-day-col${isToday ? ' tt-today-col' : ''}`}>
                  {/* Header */}
                  <div className={`tt-day-head${isToday ? ' today' : ''}`}>
                    {dayLabel(day)}
                  </div>

                  {/* Events area */}
                  <div
                    className="tt-events-area"
                    onClick={e => handleCellClick(dIdx, e)}
                  >
                    {/* Hour lines */}
                    {HOUR_LABELS.map((_, i) => (
                      <div key={i} className="tt-hour-line" style={{ top: i * ROW_HEIGHT }} />
                    ))}

                    {/* Now line */}
                    {showNow && (
                      <div className="tt-now-line" style={{ top: nowPx }}>
                        <div className="tt-now-dot" />
                      </div>
                    )}

                    {/* Events */}
                    {dayEvs.map(ev => {
                      const topPx    = hourToPx(ev.startHour)
                      const heightPx = ev.duration * ROW_HEIGHT
                      return (
                        <div key={ev.id} className="ev-pill">
                          <EventPill
                            ev={ev}
                            topPx={topPx}
                            heightPx={heightPx}
                            onClick={() => setDialog({ event: ev })}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating add button */}
        <button className="tt-add-btn" onClick={() => setDialog({ event: {} })}>+</button>
      </div>

      {/* Dialog */}
      {dialog && (
        <EventDialog
          event={dialog.event}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setDialog(null)}
        />
      )}
    </>
  )
}