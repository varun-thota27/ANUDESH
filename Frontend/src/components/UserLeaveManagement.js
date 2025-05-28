import React, { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import NavBarUser from './NavBarUser';
import "./UserLeaveManagement.css";
import leaveService from '../services/leaveService';
import axios from "axios";

const LeaveHistory = ({ armyNo }) => {
  const [selectedType, setSelectedType] = useState("");
  const [history, setHistory] = useState([]);  // Store fetched leave history
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const leaveTypes = ["EL", "CML","HPL", "CL", "RH", "CCL", "PL","ML","EOL on PA","EOL on MC"];

  // Fetch leave history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/leave-history/${armyNo}`, {
          withCredentials: true,
        });
        setHistory(Array.isArray(response.data) ? response.data : []); // Assuming backend returns an array
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leave history:", err);
        setError(err.message || "Failed to fetch leave history");
        setLoading(false);
      }
    };

    if (armyNo) {
      fetchHistory();
    }
  }, [armyNo]);

  const filteredHistory = selectedType
  ? history.filter((entry) => entry.leave_type.toLowerCase() === selectedType.toLowerCase())
  : history;

  if (loading) return <p>Loading leave history...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="userleave-history-container">
      <div className="userleave-controls">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="userleave-filter-select"
        >
          <option value="">All Leave Types</option>
          {leaveTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="userleave-printable-content">
        <div className="userleave-print-only-header print-only">
          <h2 className="userleave-college-title">
            MILITARY COLLEGE OF EME, SECUNDERABAD
          </h2>
        </div>
        <h3 className="userleave-record-title">
          {selectedType ? `${selectedType} LEAVE RECORD ` : "LEAVE RECORD "}
        </h3>
        <div className="userleave-pers-info">
          <div>ARMY NO: {armyNo}</div>
        </div>
        <table className="userleave-record-table">
          <thead>
            <tr>
              <th>Days Entitled</th>
              <th>Type of Leave</th>
              <th>No of Days</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.days_entitled}</td>
                  <td>{entry.leave_type}</td>
                  <td>{entry.no_of_days}</td>
                  <td>{entry.balance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getEstOfficerStamp = (status) => {
  if (status === 'APPROVED') {
    return `
      <div style="
        border: 2px solid #173B45;
        border-radius: 50%;
        padding: 10px;
        width: 75px;
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        font-weight: bold;
        color: #173B45;
        text-align: center;
        font-size: 10px;
      ">
        APPROVED<br>
        Est Officer<br>
        MCEME
      </div>
    `;
  } else if (status === 'Rejected') {
    return `
      <div style="
        border: 2px solid #dc3545;
        border-radius: 50%;
        padding: 10px;
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        font-weight: bold;
        color: #dc3545;
        text-align: center;
        font-size: 10px;
      ">
        REJECTED<br>
        Est Officer<br>
        MCEME
      </div>
    `;
  }
  return '';
};

const LeaveStatus = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [leaveRequests,setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await leaveService.getRequests();
        setLeaveRequests(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Error fetching leave history:", err);
        setError("Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = statusFilter 
    ? leaveRequests.filter(request => request.status.toLowerCase() === statusFilter.toLowerCase())
    : leaveRequests;

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
    };

    


  const handlePrint = (request) => {
    try {
      if (!request) {
        throw new Error("Invalid request data for printing");
      }

      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      
      // Write content to iframe
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Leave Application</title>
            <style>
              @page {
                size: A4;
                margin: 1.5cm;
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: Arial, sans-serif;
                width: 100%;
                height: 100%;
              }
              .print-content {
                text-align: left;
                margin: 0 auto;
                padding: 30px;
                width: 100%;
                max-width: 900px;
              }
              .print-header {
                text-align: center;
                margin-bottom: 10px;
                padding: 20px 0;
              }
              .print-header h2 {
                margin: 10px 0;
                font-size: 20px;
                font-weight: bold;
                letter-spacing: 1px;
                text-decoration: underline;
                text-underline-offset: 5px;
              }
              .print-form {
                page-break-inside: avoid;
                width: 100%;
              }
              .form-row {
                margin: 25px 0;
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: flex-start;
                flex-wrap: nowrap;
              }
              .form-row span:not(.underline) {
                white-space: nowrap;
                padding-right: 10px;
                font-size: 16px;
              }
              .underline {
                border-bottom: 1px solid black;
                padding: 2px 5px;
                flex: 1;
                min-width: 100px;
                margin: 0 5px;
                font-size: 16px;
              }
              .form-row-group {
                display: flex;
                align-items: center;
                flex: 1;
              }
              .signature-row {
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-top: 100px;
                align-items: flex-start;
              }
              .signature-left {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .signature-right {
                text-align: center;
                min-width: 250px;
              }
              .signature-box {
                margin-bottom: 20px;
              }
              .part-2 {
                margin-top: 40px;
                text-align: center;
                page-break-inside: avoid;
                padding-top: 20px;
              }
              .part-2 h3 {
                font-size: 18px;
                font-weight: bold;
                text-decoration: underline;
                text-underline-offset: 5px;
                margin: 15px 0;
                text-transform: uppercase;
              }
            </style>
          </head>
          <body>
            <div class="print-content">
              <div class="print-header">
                <h2>LEAVE APPLICATION</h2>
                <h2>INDUSTRIAL AND NON INDUSTRIAL PERSONNEL</h2>
              </div>
              
              <div class="print-form">
                <div class="form-row">
                  <span>No</span>
                  <span class="underline" data-field="no">${request.army_no || ''}</span>
                  <span>Designation</span>
                  <span class="underline" data-field="rank">${request.designation || ''}</span>
                  <span>Name</span>
                  <span class="underline" data-field="name">${request.first_name+' ' +request.middle_name+' '+request.last_name|| ''}</span>
                </div>
                
                <div class="form-row">
                  <span>Sec</span>
                  <span class="underline" data-field="section">${request.faculty || ''}</span>
                  <span>here by request for</span>
                  <span class="underline">
                    <span class="leave-type selected">${request.leave_type}</span> leave
                  </span>
                </div>
                
                <div class="form-row">
                <span> Extension of leave</span>
                  <span class="underline">${request.is_extended ?'yes':'no'}</span>
                  <span> from</span>
                  <span class="underline" data-field="date">${formatDate(request.from_date) || ''}</span>
                  <span>to</span>
                  <span class="underline" data-field="date">${formatDate(request.to_date) || ''}</span>
                </div>
                
                <div class="form-row">
                  <span>Reason</span>
                  <span class="underline" data-field="reason" style="flex: 2">${request.reason_for_leave || ''}</span>
                </div>
                
                <div class="form-row">
                  <span>Address on leave:</span>
                  <span class="underline" data-field="address" style="flex: 2">${request.address_on_leave || ''}</span>
                </div>

                <div class="part-2">
                  <h3>PART II</h3>
                  <div class="recommendation-row">
                    <span class="recommend-option selected">${request.recommendation || ''}</span>
                  </div>
                  
                  <div class="signature-row">
                    <div class="signature-left">
                      <span>Dated:</span>
                      <span class="underline" data-field="date">${formatDate(request.recommendation_date) || 'Pending'}</span>
                    </div>
                    <div class="signature-right">
                      <div class="signature-box">${request.sectionOfficerSignature || ''}</div>
                      <div class="signature-line">(Signature of section officer)</div>
                    </div>
                  </div>
                </div>

                <div class="part-2">
                  <h3>PART III</h3>
                  <div class="approval-row">
                    <span class="approval-status">${request.status}</span>
                  </div>

                  <div class="signature-row">
                    <div class="signature-left">
                      <span>Dated:</span>
                      <span class="underline" data-field="date">${formatDate(request.approval_date) || 'Pending'}</span>
                    </div>
                    <div class="signature-right">
                      <div class="signature-box">
                        ${getEstOfficerStamp(request.status)}
                      </div>
                      <div class="signature-line">(Signature of est officer(Civ))</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
      
      iframe.contentDocument.write(printContent);
      iframe.contentDocument.close();

      // Print and remove iframe
      iframe.contentWindow.onafterprint = () => {
        document.body.removeChild(iframe);
      };
      
      iframe.contentWindow.print();

    } catch (err) {
      console.error(`Failed to print: ${err.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

  return (
    <div className="userleave-history-container">
      <div className="userleave-controls">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="userleave-filter-select"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      
      <div className="userleave-printable-content">
        <div className="userleave-print-only-header print-only">
          <h2 className="userleave-college-title">MILITARY COLLEGE OF EME, SECUNDERABAD</h2>
        </div>
        <h3 className="userleave-record-title">
          {statusFilter ? ` ${statusFilter} LEAVE STATUS `: 'LEAVE STATUS'}
        </h3>
        <table className="userleave-attendance-table">
          <thead>
            <tr>
              <th>Army NO</th>
              <th>Employee Name</th>
              <th>Designation</th>
              <th>Section</th>
              <th>Type of Leave</th>
              <th>Status</th>
                <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request,index) => (
              <tr key={index}>
                <td>{request.army_no}</td>
                <td>{request.first_name+" "+request.middle_name+" "+request.last_name}</td>
                <td>{request.designation}</td>
                <td>{request.faculty}</td>
                <td>{request.leave_type}</td>

                <td className={ `status-${request.status.toLowerCase()} `}>
                  {request.status}
                </td>
                {(request.status==='APPROVED') ? (
                  <td>
                    <button onClick={() => handlePrint(request)} className="userleave-print-button">
                      Print
                    </button>
                  </td>
                ):(request.status==='APPROVED') ? (
                  <td>REJECTED</td>
                ):(
                  <td>TO BE APPROVED</td>
                )}
              </tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Notification = ({ message }) => {
  return (
    <div className="notification">
      {message}
    </div>
  );
};

const LeaveApplicationForm = () => {
  const [formData, setFormData] = useState({
    armyNo: '',
    name: '',
    section: '',
    trade: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    reason: '',
    address: '',
    recommendation: '',
    sectionOfficerName: '',
  });

  const [showTables, setShowTables] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [employees, setEmployees] = useState([]);

  const leaveTypes = ["EL", "CML","HPL", "CL", "RH", "CCL", "PL","ML","EOL on PA","EOL on MC", "Extension of Leave"];

  // Fetch employees list on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await leaveService.fetchEmployees(); // Fetch employee list from API
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Autofill data when an army number is selected
    if (name === 'armyNo') {
      const selectedEmployee = employees.find(emp => emp.army_no === value);
      if (selectedEmployee) {
        setFormData({
          armyNo: selectedEmployee.army_no,
          name: selectedEmployee.first_name + ' ' + (selectedEmployee.middle_name || '') + ' ' + selectedEmployee.last_name,
          section: selectedEmployee.faculty || '',
          trade: selectedEmployee.designation || '',
          leaveType: '',
          fromDate: '',
          toDate: '',
          reason: '',
          address: '',
          recommendation: '',
          sectionOfficerName: '',
        });

        setShowTables(true);
      } else {
        setShowTables(false);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await leaveService.submitForm(formData);
      setNotificationMessage('Form submitted successfully!');
      
      setFormData({
        armyNo: '',
        name: '',
        section: '',
        trade: '',
        leaveType: '',
        fromDate: '',
        toDate: '',
        reason: '',
        address: '',
        recommendation: '',
        sectionOfficerName: '',
      });
  
      setShowTables(false);
      
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    } catch (err) {
      console.error("Form submission failed:", err);
      setNotificationMessage('Form submission failed');
      setTimeout(() => {
        setNotificationMessage('');
      }, 3000);
    }
  };
  

  return (
    <div className="userleave-form-container">
      {notificationMessage && <Notification message={notificationMessage} />}
      <div className="userleave-form-section">
        <h2>Leave Application Form</h2>
        <form onSubmit={handleSubmit} className="userleave-form">
          {/* Army No Dropdown */}
          <div className="userleave-form-row">
            <label>ARMY NO:</label>
            <select
              name="armyNo"
              value={formData.armyNo}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Army No</option>
              {employees.map((emp) => (
                <option key={emp.army_no} value={emp.army_no}>
                  {emp.army_no}
                </option>
              ))}
            </select>
          </div>

          {/* Autofilled Fields */}
          <div className="userleave-form-row">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} readOnly />
          </div>

          <div className="userleave-form-row">
            <label>Section:</label>
            <input type="text" name="section" value={formData.section} readOnly />
          </div>

          <div className="userleave-form-row">
            <label>Trade/Designation:</label>
            <input type="text" name="trade" value={formData.trade} readOnly />
          </div>

          {/* Leave Details */}
          <div className="userleave-form-row">
            <label>Type of Leave:</label>
            <select name="leaveType" value={formData.leaveType} onChange={handleInputChange} required>
              <option value="">Select Leave Type</option>
              {leaveTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="userleave-form-row">
            <label>From Date:</label>
            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleInputChange} required />
          </div>

          <div className="userleave-form-row">
            <label>To Date:</label>
            <input type="date" name="toDate" value={formData.toDate} onChange={handleInputChange} required />
          </div>

          <div className="userleave-form-row full-width">
            <label>Reason for Leave:</label>
            <textarea name="reason" value={formData.reason} onChange={handleInputChange} required />
          </div>

          <div className="userleave-form-row full-width">
            <label>Address on Leave:</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} required />
          </div>

          <div className="userleave-form-row">
            <label>Recommendation:</label>
            <select name="recommendation" value={formData.recommendation} onChange={handleInputChange} required>
              <option value="">Select Recommendation</option>
              <option value="recommended">Recommended</option>
              <option value="not_recommended">Not Recommended</option>
            </select>
          </div>

          {formData.recommendation === 'recommended' && (
            <div className="userleave-form-row">
              <label>Section Officer Name:</label>
              <input type="text" name="sectionOfficerName" value={formData.sectionOfficerName} onChange={handleInputChange} required />
              <div className="userleave-digital-stamp">
                <span>Digital Stamp</span>
              </div>
            </div>
          )}

          <div className="userleave-form-actions full-width">
            <button type="submit" className="userleave-submit-button">
              Submit Application
            </button>
          </div>
        </form>
      </div>

      {showTables && (
        <div className={`userleave-tables-section ${showTables ? 'show' : ''}`}>
          <LeaveHistory armyNo={formData.armyNo} />
        </div>
      )}
    </div>
  );
};

const UserLeaveManagement = () => {
  const location = useLocation();
  const { activePage } = location.state || {}; // Retrieve activePage from navigation state

  return (
    <div>
      <NavBarUser/>
    <div className="userleave-management">
      <div className="userleave-main-content">
        {activePage === 'application' && <LeaveApplicationForm />}
        {activePage === 'status' && <LeaveStatus />}
      </div>
    </div>
    </div>
  );
};

export default UserLeaveManagement;