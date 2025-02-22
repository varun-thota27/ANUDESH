import React, { useState, useEffect } from 'react';
import './attendance.css';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';
import attendanceService from '../services/attendanceService';
import NavBarUser from './NavBarUser';
import UserAttendance from './UserAttendance';

function Attendance() {
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedFac, setSelectedFac] = useState(null);
  
  const [faculty, setFaculty] = useState([]); // List of faculties
  const [attendanceData, setAttendanceData] = useState([]); // Attendance records

  // Fetch Faculty List
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await attendanceService.faculties();
        setFaculty(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };
    fetchFaculties();
  }, []);

  // Fetch Attendance Data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await attendanceService.getAttendance();
        setAttendanceData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendance();
  }, []);
  
  const [membersData,setMembersData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await attendanceService.getMembers();
        setMembersData(data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    fetchAttendance();
  }, []);

  // Map Faculty to Attendance Summary
  const mainTableData = faculty.map((fac, index) => {
    // Find the matching faculty entry in attendanceData
    const attendanceEntry = attendanceData.find(a => a.faculty.trim().toUpperCase() === fac.wing.trim().toUpperCase());

    return {
        id: index + 1,
        facSecWing: fac.wing, // Use fac.wing for faculty name
        totalStrength: attendanceEntry ? parseInt(attendanceEntry.total_strength) : 0,
        present: attendanceEntry ? parseInt(attendanceEntry.present) : 0,
        leave: attendanceEntry ? parseInt(attendanceEntry.leave_count) : 0,
        absent: attendanceEntry ? parseInt(attendanceEntry.absent) : 0,
        wOff: attendanceEntry ? parseInt(attendanceEntry.w_off) : 0
    };
});

  // Totals Calculation
  const totals = mainTableData.reduce((acc, row) => ({
    totalStrength: acc.totalStrength + row.totalStrength,
    present: acc.present + row.present,
    leave: acc.leave + row.leave,
    absent: acc.absent + row.absent,
    wOff: acc.wOff + row.wOff
  }), { totalStrength: 0, present: 0, leave: 0, absent: 0, wOff: 0 });

  const formatMilitaryDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleFacClick = async (fac) => {
    setSelectedFac(fac);
    setShowDetailView(true);
    setLoading(true); // Ensure loading starts
  
    try {
      const { exists } = await attendanceService.checkAttendanceExists(fac);
      console.log("CheckAttendanceExists Result:", exists);
      setAttendanceExists(exists);
    } catch (error) {
      console.error("Error fetching attendance status:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleBack = () => {
    setShowDetailView(false);
    setLoading(false);
    setSelectedFac(null);
  };

  const handlePrint = () => {
    window.print();
  };

  //eslint-disable-next-line
  const [attendanceExists, setAttendanceExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStatus = async () => {
      try {
        const { exists } = await attendanceService.checkAttendanceExists(selectedFac);
        console.log("Attendance Exists Check for", selectedFac, ":", exists);
        setAttendanceExists(exists);
      } catch (error) {
        console.error("Error checking attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFac) {
      fetchAttendanceStatus();
    }
  }, [selectedFac]);

  return (
    <div>
      <NavBarUser />
      <div className="attendance-container">
        {!showDetailView ? (
          <div className="main-table-container">
            <div className="table-head">
              <h2>PARADE STATE FOR {formatMilitaryDate(new Date())} OF CDEs MCEME</h2>
              <button onClick={handlePrint} className="print-button3 no-print">
                <FaPrint /> Print
              </button>
            </div>
            <div className="table-wrapper">
              {mainTableData.length > 0 ? (
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Fac/Sec/Wing</th>
                      <th>Total Strength</th>
                      <th>Present</th>
                      <th>Leave</th>
                      <th>Absent</th>
                      <th>W/Off</th>
                      <th className='no-print'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainTableData.map((row) => (
                      <tr key={row.id} onClick={() => handleFacClick(row.facSecWing)} style={{ cursor: 'pointer' }}>
                        <td>{row.id}</td>
                        <td>{row.facSecWing}</td>
                        <td>{row.totalStrength}</td>
                        <td>{row.present}</td>
                        <td>{row.leave}</td>
                        <td>{row.absent}</td>
                        <td>{row.wOff}</td>
                        <td 
                          style={{
                            color: row.absent + row.present + row.leave + row.wOff === 0 ? 'red' : 'green',
                            fontWeight: 'bold'
                          }}
                        >
                          {row.absent + row.present + row.leave + row.wOff === 0 ? 'Pending' : 'Updated'}
                        </td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan={2}>Total</td>
                      <td>{totals.totalStrength}</td>
                      <td>{totals.present}</td>
                      <td>{totals.leave}</td>
                      <td>{totals.absent}</td>
                      <td>{totals.wOff}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="no-results">
                  <p>No attendance details found for any faculty.</p>
                </div>
              )}
            </div>
          </div>
        ) : loading ? (
          <p>Loading...</p>
        ) :  attendanceExists ? (
          <div className="detail-view-container">
            <div className="table-head">
              <h2>{selectedFac} STAFF PARADE STATE AS ON {formatMilitaryDate(new Date())}</h2>
              <div className="button-group">
                <button onClick={handleBack} className="back-button3">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={handlePrint} className="print-button3">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Army No</th>
                    <th>Department</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {membersData
                    .filter(m => m.dept_name === selectedFac)
                    .map((row, index) => (
                      <tr key={index}>
                        <td>{row.army_no}</td>
                        <td>{row.dept_name}</td>
                        <td>{`${row.first_name || ''} ${row.middle_name || ''} ${row.last_name || ''}`.trim()}</td>
                        <td>{row.status}</td>
                        <td>{row.remarks}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <UserAttendance userFaculty={selectedFac} />
        )}
      </div>
    </div>
  );
}

export default Attendance;