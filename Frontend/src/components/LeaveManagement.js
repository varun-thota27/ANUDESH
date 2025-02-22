import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import "./LeaveManagement.css";
import leaveService from '../services/leaveService';
import NavBar from "./NavBar";

const Notification = ({ message }) => (
  <div className="notification">{message}</div>
);

const StatusBadge = ({ status }) => {
  if (!status) return <span>No Status</span>; // Handle missing status

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      default: return 'status-unknown';
    }
  };


  return <span className={getStatusClass(status)}>{status}</span>;
};

const LeaveManagement = () => {
  // TODO: Replace with API call
  const [applications, setApplications] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  // TODO: Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
         const data = await leaveService.fetchAtAdmin();
         setApplications(data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleEmployeeClick = useCallback(async (army_no) => {
    try {
      if (!army_no) return;
  
      // Fetch history data
      const data = await leaveService.getDataAtAdmin(army_no);
      // Set states
      // Combine all details and set selected employee
      setSelectedEmployee(data);
  
      setShowApplicationForm(true);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  }, []);
  

  const handleBack = useCallback(() => {
    setShowApplicationForm(false);
    setSelectedEmployee(null);
    setError(null);
  }, []);

  const showNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(""), 2000);
  };

  // TODO: Integrate with backend
  const handleDecision = useCallback(async (id, decision) => {
    try {
      setIsLoading(true);
      
      const currentDate = new Date().toISOString().split("T")[0];
  
      // Call updateDetails only if the decision is "Approved"
        await leaveService.updateDetails(id,decision);
      
      
  
      // Update the selected employee's pending leaves
      setSelectedEmployee((prevEmployee) => ({
        ...prevEmployee,
        pending_leaves: prevEmployee.pending_leaves.map((leave) =>
          leave.leave_id === id
            ? { ...leave, status: decision, approval_date: decision === "APPROVED" ? currentDate : leave.approvalDate }
            : leave
        ),
      }));

      //console.log()
  
      // Show success notification
      showNotification(
        decision === "APPROVED"
          ? "Leave application has been approved!"
          : "Leave application has been rejected."
      );
  
    } catch (err) {
      setError(`Failed to process decision: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  

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
    } else if (status === 'REJECTED') {
      return `
        <div style="
          border: 2px solid #dc3545;
          border-radius: 50%;
          padding: 10px;
          width: 70px;
          height: 70px;
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
                margin: 1cm;
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
                padding: 20px;
                width: 100%;
                max-width: 850px; /* Reduced from 900px */
              }
              .print-header {
                text-align: center;
                margin-bottom: 8px;
                padding: 15px 0;
              }
              .print-header h2 {
                margin: 8px 0;
                font-size: 18px; /* Reduced from 20px */
                font-weight: bold;
                letter-spacing: 0.8px;
                text-decoration: underline;
                text-underline-offset: 4px;
              }
              .print-form {
                page-break-inside: avoid;
                width: 100%;
              }
              .form-row {
                margin: 20px 0; /* Reduced from 25px */
                display: flex;
                align-items: center;
                width: 100%;
                justify-content: flex-start;
                flex-wrap: nowrap;
              }
              .form-row span:not(.underline) {
                white-space: nowrap;
                padding-right: 8px;
                font-size: 15px; /* Reduced from 16px */
              }
              .underline {
                border-bottom: 1px solid black;
                padding: 2px 5px;
                flex: 1;
                min-width: 90px; /* Slightly reduced */
                margin: 0 4px;
                font-size: 15px; /* Reduced from 16px */
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
                margin-top: 80px; /* Reduced from 100px */
                align-items: flex-start;
              }
              .signature-left {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .signature-right {
                text-align: center;
                min-width: 220px; /* Reduced from 250px */
              }
              .signature-box {
                margin-bottom: 15px;
              }
              .part-2 {
                margin-top: 30px; /* Reduced from 40px */
                text-align: center;
                page-break-inside: avoid;
                padding-top: 15px;
              }
              .part-2 h3 {
                font-size: 16px; /* Reduced from 18px */
                font-weight: bold;
                text-decoration: underline;
                text-underline-offset: 4px;
                margin: 12px 0;
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
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  return (
    <div>
      <NavBar/>
    <div className="leave-management">
      {notificationMessage && <Notification message={notificationMessage} />}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
      
      {!showApplicationForm ? (
        <div className="leave-table-container">
          <h2>INDUSTRIAL / NON-INDUSTRIAL PERSONNEL</h2>
          <table className="leave-table">
            <thead>
              <tr>
                <th>S No.</th>
                <th>Army no.</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Section</th>
                <th>Type of Leave</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <button 
                      className="name-button" 
                      onClick={() => handleEmployeeClick(app.army_no)}
                      disabled={isLoading}
                    >
                      {app.army_no} 
                    </button>
                  </td>
                  <td>{app.first_name+" "+app.middle_name+" "+app.last_name}</td>
                  <td>{app.designation}</td>
                  <td>{app.faculty}</td>
                  <td>{app.leave_type}</td>
                  <td>{app.status ? <StatusBadge status={app.status} /> : "No Status"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="application-page">
          <div className="application-header">
            <h3>Leave Application Form</h3>
            <button 
              className="back-button" 
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </button>
          </div>
          {selectedEmployee && (
            <div className="application-content">
              <div className="application-form">
                <div className="form-content">
                  <div className="form-group">
                    <label>Employee Name:</label>
                    <span>{selectedEmployee.pending_leaves[0].first_name+" "+selectedEmployee.pending_leaves[0].middle_name+" "+selectedEmployee.pending_leaves[0].last_name}</span>
                  </div>
                  <div className="form-group">
                    <label>Designation:</label>
                    <span>{selectedEmployee.pending_leaves[0].designation}</span>
                  </div>
                  <div className="form-group">
                    <label>Trade/Designation:</label>
                    <span>{selectedEmployee.pending_leaves[0].faculty}</span>
                  </div>
                  <div className="form-group">
                    <label>Type of Leave:</label>
                    <span>{selectedEmployee.pending_leaves[0].leave_type}</span>
                  </div>
                  <div className="form-group">
                    <label>From Date:</label>
                    <span>{formatDate(selectedEmployee.pending_leaves[0].from_date)}</span>
                  </div>
                  <div className="form-group">
                    <label>To Date:</label>
                    <span>{formatDate(selectedEmployee.pending_leaves[0].to_date)}</span>
                  </div>
                  <div className="form-group">
                    <label>Reason:</label>
                    <span>{selectedEmployee.pending_leaves[0].reason_for_leave}</span>
                  </div>
                  <div className="form-group">
                    <label>Address on Leave:</label>
                    <span>{selectedEmployee.pending_leaves[0].address_on_leave}</span>
                  </div>
                  <div className="form-group">
                    <label>Recommendation:</label>
                    <span>{selectedEmployee.pending_leaves[0].recommendation}</span>
                  </div>
                  <div className="form-group">
                    <label>Section Officer:</label>
                    <span>{selectedEmployee.pending_leaves[0].section_officer}</span>
                  </div>
                  <div className="form-actions">
                  {selectedEmployee.pending_leaves[0].status === "PENDING" && (
                    <>
                      <button 
                        className="submit-button"
                        onClick={() => handleDecision(selectedEmployee.pending_leaves[0].leave_id, "APPROVED")}
                        disabled={isLoading}
                      >
                        Approve
                      </button>
                      <button 
                        className="update-button"
                        onClick={() => handleDecision(selectedEmployee.pending_leaves[0].leave_id, "REJECTED")}
                        disabled={isLoading}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {selectedEmployee.pending_leaves[0].status === "APPROVED" && (
                    <button 
                      className="print-button"
                      onClick={() => handlePrint(selectedEmployee.pending_leaves[0])}
                      disabled={isLoading}
                    >
                      Print
                    </button>
                  )}
                </div>

                </div>
              </div>
              <div className="right-panel">
                <div className="leave-history">
                  <h3>Employee Leave History</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Type of Leave</th>
                        <th>Days Taken</th>
                      </tr>
                    </thead>
                    <tbody>
                    {selectedEmployee?.leaves_taken?.length > 0 ? (
                      selectedEmployee.leaves_taken.map((record, index) => (
                        <tr key={index}>
                          <td>{formatDate(record?.from_date)}</td>
                          <td>{formatDate(record?.to_date)}</td>
                          <td>{record?.leave_type}</td>
                          <td>{record?.no_of_days}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No leave records available</td>
                      </tr>
                    )}

                    </tbody>
                  </table>
                </div>
                <div className="leave-balance">
                  <h3>Employee Leave Balance</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Type of Leave</th>
                        <th>Cumulative Total</th>
                        <th>Remaining Leaves</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.leave_entitlements.map((bal, index) => (
                        <tr key={index}>
                          <td>{bal.leave_type}</td>
                          <td>{bal.days_entitled}</td>
                          <td>{bal.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};


Notification.propTypes = {
  message: PropTypes.string.isRequired
};


export default LeaveManagement;