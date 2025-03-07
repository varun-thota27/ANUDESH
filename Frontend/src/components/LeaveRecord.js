import React, { useState } from 'react';
import './LeaveManagement.css';
import NavBar from './NavBar';
import leaveService from '../services/leaveService';

const LeaveRecord = () => {
  const [searchArmyNo, setSearchArmyNo] = useState('');
  const [selectedLeaveType, setSelectedLeaveType] = useState('ALL');
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); 
  const leaveTypes = ['ALL','EL', 'ML', 'CL', 'RH', 'CCL', 'PL'];

  // Dummy records with more varied leave types

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle empty input
  
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date'; // Handle invalid date
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
 
  const handleSubmit = async () => {
    // Validate required fields
    if (!selectedFromDate || !selectedToDate) {
      setErrorMessage('Both From Date and To Date are required.');
      return;
    }
  
    setErrorMessage(''); // Clear previous error messages
  
    try {
      const response = await leaveService.fetchRecords({
        army_no: searchArmyNo || null,
        fromDate: selectedFromDate,
        toDate: selectedToDate,
        leave_type: selectedLeaveType
      });
  
      console.log("Fetched Leave Records:", response);
      setLeaveRecords(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching leave records:", error);
      setErrorMessage("Failed to fetch leave records. Please try again.");
    }
  };
  

  const filteredRecords = leaveRecords || [];

  const createPrintIframe = (content) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.write('<html><head><title>Leave Record</title>');
    doc.write('<style>');
    doc.write(`
      @media print {
        @page { 
          size: A4; 
          margin: 1cm; 
        }
        body { 
          margin: 0; 
          padding: 0;
          font-family: Arial, sans-serif;
        }
        table { 
          width: 100%; 
          border-collapse: collapse;
          margin-bottom: 15px;
          page-break-inside: avoid;
          border: 2px solid black;
        }
        th, td { 
          border: 1px solid black;
          padding: 6px; 
          text-align: center; 
          font-size: 11px;
        }
        th {
          font-weight: bold;
          background-color: #f5f5f5;
          border-bottom: 2px solid black;
        }
        tr:last-child td {
          border-bottom: 2px solid black;
        }
        td:first-child, th:first-child {
          border-left: 2px solid black;
        }
        td:last-child, th:last-child {
          border-right: 2px solid black;
        }
        h2 { 
          text-align: center; 
          margin: 10px 0;
          font-size: 14px;
          text-transform: uppercase;
        }
        .section {
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .person-info {
          margin: 5px 0 15px 0;
          text-align: center;
          font-size: 12px;
          display: flex;
          justify-content: center;
          gap: 30px;
          font-weight: bold;
        }
        
      }
    `);
    doc.write('</style></head><body>');
    doc.write(content);
    doc.write('</body></html>');
    doc.close();
    
    iframe.contentWindow.print();
    iframe.onafterprint = () => {
      document.body.removeChild(iframe);
    };
  };

  const handlePrint = () => {
    const content = `
      <div class="section">
        <h2><u>MILITARY COLLEGE OF EME, SECUNDERABAD</u></h2>

        <table>
          <thead>
            <tr>
              <th>ARMY NO</th>
              <th>NAME</th>
              <th>FROM</th>
              <th>TO</th>
              <th>TYPE OF LEAVE</th>
              <th>NO OF DAYS</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRecords.map(record => `
              <tr>
                <td>${record.army_no}</td>
                <td>${record.name}</td>
                <td>${formatDate(record.from_date)}</td>
                <td>${formatDate(record.to_date)}</td>
                <td>${record.leave_type}</td>
                <td>${record.no_of_days}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    createPrintIframe(content);
  };


  return (
    <div>
      <NavBar />
      <div className="leave-record-main-container">
        <div className="leave-record-header">
          <h2 className="college-name">MILITARY COLLEGE OF EME, SECUNDERABAD</h2>
        </div>

        <div className="controls-container">
          <input
            type="text"
            placeholder="Search by Pers No (Optional)"
            value={searchArmyNo}
            onChange={(e) => setSearchArmyNo(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            value={selectedFromDate}
            onChange={(e) => setSelectedFromDate(e.target.value)}
            className="date-input"
            placeholder="From Date"
          />
          <input
            type="date"
            value={selectedToDate}
            onChange={(e) => setSelectedToDate(e.target.value)}
            className="date-input"
            placeholder="To Date"
          />
          <select
            value={selectedLeaveType}
            onChange={(e) => setSelectedLeaveType(e.target.value)}
            className="leave-type-select"
          >
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button onClick={handleSubmit} className="submit-button">Submit</button>
          <button onClick={handlePrint} className="print-button">Print Record</button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {leaveRecords.length > 0 && (
          <div className="table-container">
            <table className="leave-table">
              <thead>
                <tr>
                  <th>ARMY NO</th>
                  <th>NAME</th>
                  <th>FROM</th>
                  <th>TO</th>
                  <th>TYPE OF LEAVE</th>
                  <th>NO OF DAYS</th>
                </tr>
              </thead>
              <tbody>
                {leaveRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.army_no || 'N/A'}</td>
                    <td>{record.name}</td>
                    <td>{formatDate(record.from_date)}</td>
                    <td>{formatDate(record.to_date)}</td>
                    <td>{record.leave_type}</td>
                    <td>{record.no_of_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

};

export default LeaveRecord;