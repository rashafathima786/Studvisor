import { Navigate, Route, Routes, useLocation, Link } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AttendancePage from "./pages/AttendancePage";
import CalendarPage from "./pages/CalendarPage";
import FloatingChatWidget from "./components/FloatingChatWidget";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeavePage from "./pages/LeavePage";
import ResultsPage from "./pages/ResultsPage";
import TimetablePage from "./pages/TimetablePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AnonChatPage from "./pages/AnonChatPage";
import FeaturesPage from "./pages/FeaturesPage";
import PollsPage from "./pages/PollsPage";
import "./linways.css";
import EventsPage from "./pages/EventsPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import SyllabusPage from "./pages/SyllabusPage";
import FacultyPage from "./pages/FacultyPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LostFoundPage from "./pages/LostFoundPage";
import NotesPage from "./pages/NotesPage";
import AchievementsPage from "./pages/AchievementsPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ExamsPage from "./pages/ExamsPage";
import GPAPage from "./pages/GPAPage";
import FeesPage from "./pages/FeesPage";
import LibraryPage from "./pages/LibraryPage";
import PlacementPage from "./pages/PlacementPage";
import { getToken } from "./utils/auth";

function ProtectedRoute({ children }) {
  const token = getToken();
  const location = useLocation();
  const contextPage = getContextPage(location.pathname);
  return token ? (
    <>
      {children}
      <FloatingChatWidget contextPage={contextPage} />
    </>
  ) : <Navigate to="/login" replace />;
}

function getContextPage(pathname) {
  if (pathname.startsWith("/attendance")) return "attendance";
  if (pathname.startsWith("/results")) return "results";
  if (pathname.startsWith("/calendar")) return "calendar";
  if (pathname.startsWith("/leave")) return "od";
  if (pathname.startsWith("/timetable")) return "timetable";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/campus-wall")) return "campus";
  if (pathname.startsWith("/hub")) return "hub";
  return "dashboard";
}

export default function App() {
  const token = getToken();

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/leave" element={<ProtectedRoute><LeavePage /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/campus-wall" element={<ProtectedRoute><AnonChatPage /></ProtectedRoute>} />
        <Route path="/hub" element={<ProtectedRoute><FeaturesPage /></ProtectedRoute>} />
        <Route path="/polls" element={<ProtectedRoute><PollsPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/assignments" element={<ProtectedRoute><AssignmentsPage /></ProtectedRoute>} />
        <Route path="/syllabus" element={<ProtectedRoute><SyllabusPage /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute><FacultyPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><LostFoundPage /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
        <Route path="/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
        <Route path="/exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
        <Route path="/gpa" element={<ProtectedRoute><GPAPage /></ProtectedRoute>} />
        <Route path="/fees" element={<ProtectedRoute><FeesPage /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
        <Route path="/placement" element={<ProtectedRoute><PlacementPage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: 'var(--accent, #6366f1)' }}>404</h1>
      <h2 style={{ margin: 0 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: 'var(--accent, #6366f1)', color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>Back to Dashboard</Link>
    </div>
  );
}
