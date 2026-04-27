import { Filter } from 'lucide-react'
import ErpLayout from '../components/ErpLayout'

export default function DashboardPage() {
  const courses = [
    { code: "6BCA-ML", title: "MACHINE LEARNING", subtitle: "6BCA-ML - Machine Learning", faculty: "ROSHINI B" },
    { code: "6BCA-PW", title: "PROJECT WORK", subtitle: "6BCA-PW - Project Work", faculty: "Dr.KAVIPRIYA K" },
    { code: "6BCA-INT", title: "INTERNSHIP", subtitle: "6BCA-INT - Internship", faculty: "SANTHYA S NAIR" },
    { code: "6BCA-MAD", title: "MOBILE APPLICATION D...", subtitle: "6BCA-MAD - Mobile Application Development", faculty: "Dr. M.A.JOSEPHINE SATHYA" },
    { code: "6BCA-MLLAB", title: "MACHINE LEARNING ...", subtitle: "6BCA-MLLAB - Machine Learning Lab", faculty: "ROSHINI B" },
    { code: "6BCA-PLA", title: "PLACEMENT TRAINING", subtitle: "6BCA-PLA - Placement Training", faculty: "Dr.JUDE ASHMI E" },
    { code: "6BCA-ECD", title: "CA-V2 VOCATION COURS...", subtitle: "6BCA-ECD - CA-V2 Vocation Course II : Electronic Content ...", faculty: "Dr Sudha V" },
    { code: "6BCA-ST", title: "CA-E2 ELECTIVE II : B. SOF...", subtitle: "6BCA-ST - CA-E2 Elective II : b. Software Testing", faculty: "Dr.UMARANI C" },
    { code: "6BCA-MADLAB", title: "MOBILE APPLICATI...", subtitle: "6BCA-MADLAB - Mobile Application Development Lab", faculty: "Dr. M.A.JOSEPHINE SATHYA" },
    { code: "6BCA-LIB", title: "LIBRARY", subtitle: "6BCA-LIB - Library", faculty: "SHYLAJA C" },
    { code: "6BCA-SPORTS", title: "SPORTS", subtitle: "6BCA-SPORTS - SPORTS", faculty: "Dr.DEVARAJ N D" },
    { code: "6BCA-IS", title: "INDUSTRIAL SPECIALIZATI...", subtitle: "6BCA-IS - Industrial Specialization", faculty: "Sanjay" },
  ]

  return (
    <ErpLayout>
      <div className="breadcrumb">HOME</div>
      
      <div className="tabs-container">
        <div className="tab active">My Courses</div>
        <div className="tab">Dashboard / Overview</div>
      </div>

      <div className="program-info">
        Program: <strong>BCA - IS</strong>, Batch: <strong>BCA (IS) - 2023-26</strong>, Current Semester: <strong>S6</strong>
      </div>

      <div className="filter-row">
        <button className="filter-btn">
          <Filter size={14} /> Show Filters
        </button>
      </div>

      <div className="course-grid">
        {courses.map(course => (
          <div className="course-card" key={course.code}>
            <div className="course-title">{course.code} - {course.title}</div>
            <div className="course-subtitle">{course.subtitle}</div>
            <div className="faculty-badge">{course.faculty}</div>
          </div>
        ))}
      </div>
    </ErpLayout>
  )
}
