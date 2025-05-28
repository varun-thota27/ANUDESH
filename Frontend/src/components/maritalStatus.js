import React, { useState,useEffect } from "react";
import NavBar from "./NavBar";
import "./kindredRoll.css";
import infoService from '../services/infoService';
import kinderedRollService from "../services/kinderedRollService";



const MaritalStatus = () => {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formData, setFormData] = useState({
    serviceNo: "",
    name: "",
    trade: "",
    category: "",
    spouseName: "",
    marriageDate: "",
    placeOfMarriage: "",
    proofCertificate: "",
    regnNo: "",
    dateOfRegistration: "",
    placeOfRegistration: "",
  });

 const [trades, setTrade] = useState([]);

    useEffect(() => {
        const fetchTrades = async () => {
          try {
            const data = await infoService.trade(); // Fetch faculty list from API
            setTrade(data);
          } catch (error) {
            console.error("Error fetching faculties:", error);
          }
        };
    
        fetchTrades();
      }, []);
  const proofTypes = ["Marriage Certificate"];

  // Notification component
  const Notification = ({ message }) => {
    return message ? <div className="notification">{message}</div> : null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      serviceNo: "",
      name: "",
      trade: "",
      category: "",
      spouseName: "",
      marriageDate: "",
      placeOfMarriage: "",
      proofCertificate: "",
      applicationNo: "",
      regnNo: "",
      dateOfRegistration: "",
      placeOfRegistration: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value === "" ? null : value])
    );
    try {
       await kinderedRollService.submitForm(cleanedFormData);
      setNotificationMessage('Form submitted successfully!');
      resetForm();
    } catch (error) {
      setNotificationMessage('Error submitting form: ' + error.message);
    }
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotificationMessage('');
    }, 3000);
  };

  return (
    <div>
      <NavBar />
      <Notification message={notificationMessage} />
      <div className="kindered-form-container">
        <div className="kindered-form-section">
          {/* <div className="print-button-container">
            <button onClick={handlePrint} className="print-button6">
              Print
            </button>
          </div> */}
          <h2>Marital Status Registration Form</h2>
          <form onSubmit={handleSubmit} className="kindered-form">
            <div className="kindered-form-row">
              <label>Service No:</label>
              <input
                type="text"
                name="serviceNo"
                value={formData.serviceNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Trade:</label>
              <select name="trade" value={formData.trade} onChange={handleInputChange}>
                                <option value="">Select Designation</option>
                                    {trades.map((tra, index) => (
                                <option key={index} value={tra.trade}>
                                    {tra.trade}
                                </option>
                            ))}
                            </select>
            </div>

            <div className="kindered-form-row">
              <label>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select </option>
                                <option value="Non-Ind(Centrally Controlled)">Non-Ind(Centrally Controlled)</option>
                                <option value="Non-Ind(Unit Controlled)">Non-Ind(Unit Controlled)</option>
                                <option value="Ind(Unit Controlled)">Ind(Unit Controlled)</option>
                                <option value="Fire Staff">Fire Staff</option>
                
              </select>
            </div>

            <div className="kindered-form-row">
              <label>Name of Spouse:</label>
              <input
                type="text"
                name="spouseName"
                value={formData.spouseName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Marriage Date:</label>
              <input
                type="date"
                name="marriageDate"
                value={formData.marriageDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Place of Marriage:</label>
              <input
                type="text"
                name="placeOfMarriage"
                value={formData.placeOfMarriage}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Proof of Certificate:</label>
              <select
                name="proofCertificate"
                value={formData.proofCertificate}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Proof Type</option>
                {proofTypes.map((proof) => (
                  <option key={proof} value={proof}>
                    {proof}
                  </option>
                ))}
              </select>
            </div>

            <div className="kindered-form-row">
              <label>Registration No:</label>
              <input
                type="text"
                name="regnNo"
                value={formData.regnNo}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Date of Registration:</label>
              <input
                type="date"
                name="dateOfRegistration"
                value={formData.dateOfRegistration}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-row">
              <label>Place of Registration:</label>
              <input
                type="text"
                name="placeOfRegistration"
                value={formData.placeOfRegistration}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="kindered-form-actions">
              <button type="submit" className="kindered-submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MaritalStatus;