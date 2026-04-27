# 🎓 STUDVISOR v3.0
### Next-Gen AI-Powered College ERP & Student Engagement Platform

**Studvisor** is an industrial-grade enterprise resource planning (ERP) system designed for modern educational institutions. It goes beyond simple management by integrating **Predictive Analytics**, **AI Tutoring**, and **Social Engagement** into a unified three-tier RBAC architecture.

---

## 🚀 Advanced Backend Architecture

The backend is built with **FastAPI** and **PostgreSQL**, utilizing a modular service-oriented architecture designed for multi-tenancy and high security.

### 🛡️ Security & Integrity Layer
- **Three-Layer RBAC**: JWT Claim verification → Route-level Guards → Database Scoping.
- **Audit Middleware**: Every state-changing request is logged with actor metadata, IP, and resource IDs.
- **Attendance Hardening**: 24-hour amendment window with a HOD-governed approval workflow for historical corrections.
- **Rotating HMAC Anonymity**: Daily-rotating salts for anonymous campus wall posts to prevent deanonymization.

### 🧠 AI Engine (Anthropic Claude-3 / Ollama)
- **Predictive Intervention**: Nightly batch jobs compute Dropout Risk, Academic Failure Risk, and Disengagement scores.
- **Context-Aware Chat**: Streaming AI assistant with real-time access to student performance data and institutional knowledge.
- **Plagiarism Detection**: High-fidelity semantic comparison of student assignments.
- **Auto-Question Generator**: Generates balanced exam papers based on syllabus coverage and Bloom's Taxonomy.
- **Sentiment Routing**: AI-powered grievance escalation for critical student complaints.

### 📅 Smart Academic Services
- **Conflict-Aware Timetable**: Automated scheduling engine that prevents room double-bookings and faculty overlaps.
- **Merit System**: Gamified engagement tracking with badges, XP, and leaderboards.
- **Placement Matcher**: AI-driven fitting of student profiles against open job drives.
- **GPA Forecaster**: Interactive GPA projections based on hypothetical targets.

---

## 📂 Project Structure

```text
backend/
├── api/
│   ├── routes/          # RBAC-guarded endpoint controllers
│   │   ├── admin.py     # Institutional management & analytics
│   │   ├── faculty.py   # Grading, attendance, & class health
│   │   ├── student.py   # Profiles, mood check-ins, recovery
│   │   ├── ai_engine.py # LLM orchestration & streaming
│   │   └── reports.py   # High-fidelity HTML/PDF generators
├── core/
│   ├── security.py      # JWT, RBAC logic, & scope helpers
│   ├── middleware.py    # Audit logging & CORS
│   └── ai_context.py    # RAG system for LLM context
├── services/            # Business logic & AI algorithms
│   ├── predictive.py    # Risk scoring algorithms
│   ├── merit.py         # Gamification engine
│   └── timetable.py     # Conflict resolution engine
└── app/
    ├── models.py        # 45+ SQLAlchemy models
    └── schemas.py       # Pydantic validation layer
```

---

## 🛠️ Deployment

### Prerequisites
- Python 3.9+
- PostgreSQL
- Anthropic API Key (optional, falls back to Mock AI)

### Quick Start
1. **Clone & Setup**:
   ```bash
   pip install -r requirements.txt
   cp .env.example .env
   ```
2. **Initialize Database**:
   ```bash
   python -m backend.seed_all
   ```
3. **Run Server**:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Docker
```bash
docker-compose up --build
```

---

## 📊 High-Fidelity Reports
Studvisor generates premium, CSS-styled academic documents:
- **Digital Marksheets**: Professional layouts with Inter/Outfit typography.
- **Attendance Certificates**: Verified attendance summaries for scholarship/visa.
- **Fee Receipts**: Glassmorphism-styled transactional documents.

---

## 📜 Audit Log
All sensitive operations are tracked in the `audit_logs` table, viewable via the Admin Analytics dashboard.

---
*Created by Antigravity AI for Studvisor Institute.*

