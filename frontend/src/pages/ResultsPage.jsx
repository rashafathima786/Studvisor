import ErpLayout from '../components/ErpLayout'

export default function ResultsPage() {
  return (
    <ErpLayout>
      <div className="breadcrumb">RESULTS &gt; ASSESSMENT MARKS</div>

      <div className="linways-table-container">
        <table className="linways-table">
          <thead>
            <tr className="linways-table-header-row">
              <th colSpan="3">Internal Exam 1</th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', width: '50%' }}>Course Name</th>
              <th>Mark Obtained</th>
              <th>Max Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }}>CA-E2 Elective II : b. Software Testing</td>
              <td>59</td>
              <td>60</td>
            </tr>
            <tr style={{ fontWeight: 600, backgroundColor: '#fafafa' }}>
              <td style={{ textAlign: 'left' }}>Total</td>
              <td>59</td>
              <td>60</td>
            </tr>
            <tr style={{ backgroundColor: '#fff' }}>
              <td style={{ textAlign: 'left', fontWeight: 600 }}>Percentage</td>
              <td colSpan="2" style={{ textAlign: 'left', paddingLeft: '24px' }}>98.33 %</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="linways-table-container">
        <table className="linways-table">
          <thead>
            <tr className="linways-table-header-row">
              <th colSpan="3">Presentation 1</th>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', width: '50%' }}>Course Name</th>
              <th>Mark Obtained</th>
              <th>Max Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }}>CA-E2 Elective II : b. Software Testing</td>
              <td>5</td>
              <td>5</td>
            </tr>
            <tr style={{ fontWeight: 600, backgroundColor: '#fafafa' }}>
              <td style={{ textAlign: 'left' }}>Total</td>
              <td>5</td>
              <td>5</td>
            </tr>
            <tr style={{ backgroundColor: '#fff' }}>
              <td style={{ textAlign: 'left', fontWeight: 600 }}>Percentage</td>
              <td colSpan="2" style={{ textAlign: 'left', paddingLeft: '24px' }}>100 %</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ErpLayout>
  )
}
