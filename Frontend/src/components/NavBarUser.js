import { useNavigate } from "react-router-dom";
import { useState } from "react";
import './Fetch.css';
import authService from '../services/authService'; 
//import UserLeaveManagement from './UserLeaveManagement'; 

function NavBar() {
  const navigate = useNavigate(); // ✅ Use the hook inside the component

  const [showLeaveDropdown, setShowLeaveDropdown] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const Notification = ({ message }) => {
    return message ? <div className="notification">{message}</div> : null;
  };

  const handleLeaveOptionClick = (option) => {
    setShowLeaveDropdown(false); 
    if (option === 'application') {
      navigate('/user-leave', { state: { activePage: 'application' } });
    } else if (option === 'status') {
      navigate('/user-leave', { state: { activePage: 'status' } });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout(); 
      setNotificationMessage('Logout Successful!');
      setTimeout(() => navigate("/"), 900); 
    } catch (err) {
      console.log('Logout error:', err.message);
    }
  };

  return (
    <div className="dashboard-menu no-print">
      <Notification message={notificationMessage} />
      <div className="menu-logo">
          <img src="/image.png" alt="Logo" />
        </div>
      <button onClick={() => navigate("/userFetch")}>Fetch Details</button>
      <button onClick={() => navigate("/FacultyAttendance")}>Attendance</button>

      <div className="leave-dropdown-container">
        <button
          className={`leave-button ${showLeaveDropdown ? 'active' : ''}`}
          onMouseEnter={() => setShowLeaveDropdown(true)}
          onClick={() => setShowLeaveDropdown(!showLeaveDropdown)}
        >
          Leave
        </button>
        {showLeaveDropdown && (
          <div 
            className="leave-dropdown-menu"
            onMouseLeave={() => setShowLeaveDropdown(false)}
          >
            <button onClick={() => handleLeaveOptionClick('application')}>
              Leave Application Form
            </button>
            <button onClick={() => handleLeaveOptionClick('status')}>
              Leave Status
            </button>
          </div>
        )}
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default NavBar;
