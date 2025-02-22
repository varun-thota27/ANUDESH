import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './attendance.css';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';
//import NavBarUser from './NavBarUser';
import attendanceService from '../services/attendanceService';

const Notification = ({ message }) => {
  return <div className="notification">{message}</div>;
};

function UserAttendance({userFaculty}) {
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [attendanceData, setAttendanceData] = useState({
    faculty: userFaculty,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
    members: [],
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const data = await attendanceService.getData(userFaculty);
        setFacultyData(data);
        setAttendanceData((prevState) => ({
          ...prevState,
          members: data.map((row) => ({
            id: row.id,
            armyNo: row.army_no,
            tradeFac: row.designation,
            name: `${row.first_name} ${row.middle_name} ${row.last_name}`.trim(),
            status: row.status === "None" ? "None" : "Leave", // Default "Leave" if fetched, otherwise "None"
            remarks: row.status === "None" ? '' : `${row.status}`,
          })),
        }));
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchFacultyData();
}, [userFaculty]);


  const formatMilitaryDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handlePrint = () => window.print();

  const handleChange = (armyNo, field, value) => {
    setAttendanceData(prevState => {
        const updatedMembers = prevState.members.map(row =>
            row.armyNo === armyNo ? { ...row, [field]: value } : row
        ); // Debugging
        return { ...prevState, members: updatedMembers };
    });
};

  const handleSubmit = async () => {
    try {
      await attendanceService.submitAttendance(attendanceData);
      setNotificationMessage('Attendance submitted successfully!');
      setTimeout(() => setNotificationMessage(''), 3000);
      navigate("/Facultyattendance");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setNotificationMessage('Error submitting attendance. Please try again.');
    }
  };

  if (!facultyData) {
    return (
      <div className="attendance-container">
        <div className="error-message">
          <h2>Faculty Not Found</h2>
          <p>No data available for faculty: {userFaculty}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="attendance-container">
        {notificationMessage && <Notification message={notificationMessage} />}
        <div className="detail-view-container">
          <div className="table-head">
            <h2>{`${userFaculty} STAFF PARADE STATE AS ON ${formatMilitaryDate(new Date())}`}</h2>
            <div className="button-group">
                <button onClick={() => window.location.reload()} className="back-button3">
                  <FaArrowLeft /> Back
                </button>
                <button onClick={handlePrint} className="print-button3">
                  <FaPrint /> Print
                </button>
              </div>
            </div>
          </div>
          <div className="table-wrapper">
            {attendanceData.members.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Army no.</th>
                    <th>Trade/Fac</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.members.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.armyNo}</td>
                      <td>{row.tradeFac}</td>
                      <td>{row.name}</td>
                      <td>
                        <select 
                          value={row.status}
                          onChange={(e) => handleChange(row.armyNo,"status", e.target.value)}
                          className="status-select"
                        >
                          <option value="None">None</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                          <option value="W/Off">W/Off</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleChange(row.armyNo,"remarks", e.target.value)}
                          className="remarks-input"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance data available.</p>
            )}
            {attendanceData.members.length > 0 && (
              <button onClick={handleSubmit} className="attendance-submit no-print">
                Submit Attendance
              </button>
            )}
          </div>
        </div>
      </div>
  );
}

export default UserAttendance;
