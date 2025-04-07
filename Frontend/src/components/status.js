import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./status.css";
import KinderedRollService from "../services/kinderedRollService.js";

function Status() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await KinderedRollService.getAllRecords();
        setData(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchRequests();
  }, []);

  const handlePrint = async (potNo, status) => {
    if (status.toLowerCase() === 'rejected') return;

    try {
      const recordDetails = await KinderedRollService.getRecordById(potNo);
      const categoryDisplay = recordDetails.category === 'Ind' ? 'INDUSTRIAL' : 
                            recordDetails.category === 'Non-Ind' ? 'NON-INDUSTRIAL' : 
                            recordDetails.category || 'N/A';
      
      const printContent = `<div style="padding: 20px; font-family: Arial, sans-serif;">
<h1 style="text-align: center; margin: 0 0 10px 0;">Restricted</h1>
<h2 style="text-align: center; margin: 0 0 10px 0;">Daily Orders Part-II</h2>
<div style="display: flex; justify-content: space-between; margin: 5px 0;">
<div><strong>MCEME</strong></div>
<div><strong>POT No:</strong> ${recordDetails.pot_no || 'N/A'}</div>
</div>
<div style="text-align: right; margin: 5px 0;"><strong>Date:</strong> ${recordDetails.status_date ? new Date(recordDetails.status_date).toLocaleDateString('en-GB') : 'N/A'}</div>
<hr style="margin: 10px 0; border: 1px solid black;" />
<h3 style="text-align: center; font-size: 1.8em; font-weight: bold; color: #000; margin: 5px 0;">${categoryDisplay}</h3>
<h3 style="text-align: center; font-weight: bold; margin: 5px 0;">${recordDetails.type === 'KINDERED' ? 'Kindred' : 'Marital'}</h3>
${recordDetails.type === 'KINDERED' ? 
`<div style="margin: 10px 0;">
<h3 style="margin: 5px 0;">Personal Information</h3>
<table style="width: 100%; border-collapse: collapse;">
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Army Number:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.army_number || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.name || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Trade:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.trade || 'N/A'}</td></tr>
</table></div>
<div style="margin: 10px 0;">
<h3 style="margin: 5px 0;">Child Information</h3>
<table style="width: 100%; border-collapse: collapse;">
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Child Relation:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.child_relation || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Name of Child:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.child_name || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Date of Birth:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.date_of_birth || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Place of Birth:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.place_of_birth || 'N/A'}</td></tr>
</table></div>
<div style="margin: 10px 0;">
<h3 style="margin: 5px 0;">Proof of Certificate</h3>
<table style="width: 100%; border-collapse: collapse;">
<tr>
<td style="padding: 4px; border: 1px solid #ddd;"><strong>Proof of Certificate:</strong></td>
<td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.proof_certificate || 'N/A'}</td>
</tr>
${[
  { label: 'Application Number', value: recordDetails.application_no },
  { label: 'Registration Number', value: recordDetails.regn_no },
  { label: 'Date of Registration', value: recordDetails.date_of_registration },
  { label: 'Place of Registration', value: recordDetails.place_of_registration }
].filter(item => item.value).map(item => 
`<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>${item.label}:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${item.value}</td></tr>`
).join('')}
</table></div>` : 
`<div style="margin: 10px 0;">
<h3 style="margin: 5px 0;">Personal Information</h3>
<table style="width: 100%; border-collapse: collapse;">
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Army Number:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.army_number || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.name || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Trade:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.trade || 'N/A'}</td></tr>
</table></div>
<div style="margin: 10px 0;">
<h3 style="margin: 5px 0;">Spouse Information</h3>
<table style="width: 100%; border-collapse: collapse;">
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Name of Spouse:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.spousename || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Marriage Date:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.marriage_date || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Place of Marriage:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.place_of_marriage || 'N/A'}</td></tr>
</table></div>
<div style="margin: 10px 0;">
<h3 style="margin: 5px 0;">Registration Details</h3>
<table style="width: 100%; border-collapse: collapse;">
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Registration Number:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.regn_no || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Date of Registration:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.date_of_registration || 'N/A'}</td></tr>
<tr><td style="padding: 4px; border: 1px solid #ddd;"><strong>Place of Registration:</strong></td><td style="padding: 4px; border: 1px solid #ddd;">${recordDetails.place_of_registration || 'N/A'}</td></tr>
</table></div>`}
</div>`;

      const printWindow = window.open('', '', 'height=600,width=800');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              td { padding: 4px; border: 1px solid #ddd; }
              h1, h2, h3 { text-align: center; color: #333; }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

    } catch (error) {
      console.error('Error printing details:', error);
      alert('Failed to load printing details');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="status-container">
        <div className="table-container">
          <h2>Status Details</h2>
          <table className="status-table">
            <thead>
              <tr>
                <th>Sl No</th>
                <th>PTO No</th>
                <th>Army Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Status date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((request, index) => (
                <tr 
                  key={index}
                  className="table-row"
                >
                  <td>{index + 1}</td>
                  <td>{request.pot_no}</td>
                  <td>{request.army_number}</td>
                  <td>{request.type}</td>
                  <td className={`status ${request.status.toLowerCase()}`}>{request.status}</td>
                  <td>{request.status_date ? new Date(request.status_date).toLocaleDateString('en-GB').split('T')[0] : 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => handlePrint(request.pot_no, request.status)}
                      disabled={request.status.toLowerCase() === 'rejected'}
                      style={{
                        opacity: request.status.toLowerCase() === 'rejected' ? 0.5 : 1,
                        cursor: request.status.toLowerCase() === 'rejected' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Status;