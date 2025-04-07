import React, { useState, useEffect } from 'react';
import './Fetch.css';
import infoService from '../services/infoService';
import NavBarUser from './NavBarUser';

function UserFetchDetails() {
  const [searchTerm, setSearchTerm] = useState('');
  const [designationFilter, setTradeFilter] = useState('');
  const [categoryFilter, setCasteFilter] = useState('');
  const [pay_levelFilter, setPayLevelFilter] = useState('');
  const [serviceCriteriaFilter, setServiceCriteriaFilter] = useState('');
  const [indFilter, setIndustrialFilter] = useState('');

  const [trade, setTrade] = useState([]);

  useEffect(() => {
    const fetchTrades = async () => {
      const response = await infoService.trade();
      console.log("Fetched Trade:", response); // Log to verify it's an array
      setTrade(Array.isArray(response) ? response : []); // Ensure it’s an array
    };
    fetchTrades();
  }, []);

  // Function to calculate years between two dates
  const calculateYears = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const yearsDiff = (end - start) / (365.25 * 24 * 60 * 60 * 1000);
    return yearsDiff;
  };
  const calculateAuditYears = (startDate,startDate2, endDate) => {
    const start = new Date(startDate);
    const start2 = new Date(startDate2);
    const end = new Date(endDate);
    const yearsDiff = (end - start) / (365.25 * 24 * 60 * 60 * 1000);
    const yearsDiff2 = (end - start2) / (365.25 * 24 * 60 * 60 * 1000);
    if(yearsDiff<yearsDiff2)
    return yearsDiff;
    return yearsDiff2;
  };

  // Function to check if person meets service criteria
  const meetsServiceCriteria = (row, criteria) => {
    const currentDate = new Date(); // Using the current date from metadata

    switch(criteria) {
      case '4_years_audit':
        return calculateAuditYears(row.date_of_appointment,row.date_of_audit, currentDate) >= 4;
      
      case '18_years_qualifying':
        return calculateYears(row.date_of_appointment, currentDate) >= 18;
      
      case '5_years_before_retirement':
        const age = calculateYears(row.date_of_birth, currentDate);
        return age >= 55;
      
      case '30_years_service':
        return calculateYears(row.date_of_appointment, currentDate) >= 30;
      
      default:
        return true;
    }
  };

  // Function to format date to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle empty input
  
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date'; // Handle invalid date
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  };
  

  const [emp, setEmp] = useState([]);

    useEffect(() => {
        const fetchEmp = async () => {
          try {
            const data = await infoService.employees_per_faculty(); // Fetch faculty list from API
            setEmp(data);
          } catch (error) {
            console.error("Error fetching faculties:", error);
          }
        };
    
        fetchEmp();
      }, []);



  const filteredData = emp.filter((row) => {
    // Only apply search term filter if there is a search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesArmyNumber = row.army_no && row.army_no.toLowerCase().includes(searchTermLower);
      const matchesGpfPran = row.gpf_pran && row.gpf_pran.toLowerCase().includes(searchTermLower);
      if (!matchesArmyNumber && !matchesGpfPran) {
        return false;
      }
    }

    // Apply other filters only if they are set
    if (designationFilter && row.designation !== designationFilter) return false;
    if (categoryFilter && row.category !== categoryFilter) return false;
    if (pay_levelFilter && row.pay_level !== pay_levelFilter) return false;
    if (indFilter && row.ind !== indFilter) return false;
    if (serviceCriteriaFilter && !meetsServiceCriteria(row, serviceCriteriaFilter)) return false;

    return true;
  });

  // Function to handle print
  const handlePrint = () => {
    window.print();
  };

  // Add console log to debug
  console.log('Filtered Data:', filteredData);

  return (
    <div className="fetch-details-container">

      <NavBarUser/>

        <>
          <div className="search-filter no-print">
            <input
              type="text"
              placeholder="Search by Army Number or GPF/PRAN NO"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
    value={designationFilter}
    onChange={(e) => setTradeFilter(e.target.value)}
    className="filter-select"
  >
    <option value="">Select Designation</option>
    {trade.length > 0 ? (
      trade.map((tra, index) => (
        <option key={index} value={tra.trade}>
          {tra.trade}
        </option>
      ))
    ) : (
      <option disabled>Loading...</option>
    )}
  </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCasteFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Castes</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
            <select
              value={pay_levelFilter}
              onChange={(e) => setPayLevelFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Pay Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
              <option value="7">Level 7</option>
              <option value="8">Level 8</option>
              <option value="9">Level 9</option>
              <option value="10">Level 10</option>
            </select>
            <select
              value={serviceCriteriaFilter}
              onChange={(e) => setServiceCriteriaFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Service Criteria</option>
              <option value="4_years_audit">4+ Years Service (Audit)</option>
              <option value="18_years_qualifying">18+ Years Qualifying Service</option>
              <option value="5_years_before_retirement">5 Years Before Retirement</option>
              <option value="30_years_service">30+ Years Service</option>
            </select>
            <select
              value={indFilter}
              onChange={(e) => setIndustrialFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Industrial">Industrial</option>
              <option value="Non-Industrial">Non-Industrial</option>
            </select>
          </div>
          <div className="table-section">
            <div className="table-head">
              <h2>Fetch Details</h2>
              <button onClick={handlePrint} className="print-button no-print">
                <i className="fas fa-print"></i> Print
              </button>
            </div>
            <div className="table-wrapper-fetch">
              {filteredData.length > 0 ? (
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Army Number</th>
                      <th>Fac/Wing</th>
                      <th>Trade</th>
                      <th>Name</th>
                      <th>GPF/PRAN No</th>
                      <th>Caste</th>
                      <th>DoB</th>
                      <th>DoA</th>
                      <th>DoR</th>
                      <th>DoP</th>
                      <th>Industrial/Non-Industrial</th>
                      <th>Pay Level</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td> {/* Auto-generated serial number */}
                      <td>{row.army_no}</td>
                      <td>{row.faculty}</td>
                      <td>{row.designation}</td>
                      <td>{row.first_name+" "+row.middle_name+" "+row.last_name}</td>
                      <td>{row.gpf_pran}</td>
                      <td>{row.category}</td>
                      <td>{formatDate(row.date_of_birth)}</td>
                      <td>{formatDate(row.date_of_appointment)}</td>
                      <td>{formatDate(row.date_of_retirement)}</td>
                      <td>
                        {formatDate(row.latest_promotion_date) === "01-01-0" ? "-" : formatDate(row.latest_promotion_date)}
                      </td>
                      <td>{row.ind}</td>
                      <td>{row.pay_level}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-results">
                  <p>No details found for the given search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </>
    </div>
  );
}

export default UserFetchDetails;