import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import './Retirement.css';
import RetirementService from '../services/retirementservice';

const Retirement = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [retirementData, setRetirementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const years = Array.from({ length: 81 }, (_, i) => 2005 + i); // Changed length to 81 to include years from 2005 to 2085
  const types = ['Industrial ', 'Non Industrial'];
  const categories = [
    'gaz unit controlled',
    'non gaz centrally controlled',
    'non gaz unit controlled',
    'gaz centrally controlled'
  ];

  useEffect(() => {
    fetchRetirementData();
  }, [selectedYear, selectedType, selectedCategory]);

  const fetchRetirementData = async () => {
    try {
      setLoading(true);
      const data = await RetirementService.getRetirementsByYear(
        selectedYear || null,
        selectedType || null,
        selectedCategory || null
      );
      setRetirementData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRetirementData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // Add any specific print preparation if needed
    window.print();
  };

  const handleReset = () => {
    setSelectedYear('');
    setSelectedType('');
    setSelectedCategory('');
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    setSelectedYear(value);
    if (!value) {
      // Clear other filters when year is cleared
      setSelectedType('');
      setSelectedCategory('');
    }
  };

  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  const currentDate = new Date(); // Automatically sets today's date
  const formattedDate = formatDate(currentDate);

  const getTableTitle = () => {
    const parts = [];
    if (selectedType) parts.push(selectedType);
    if (selectedCategory) parts.push(`(${selectedCategory.toUpperCase()})`);
    return parts.length > 0 ? `${parts.join(' ')} PERS` : 'ALL PERSONNEL';
  };

  return (
    <div className="retirement-container">
      <NavBar />
      <div className="header-container">
        <h1 className="retirement-main-heading">RETIREMENT OF CIVILIANS</h1>
        <button className="print-button" onClick={handlePrint}>
          Print
        </button>
      </div>
      
      <div className="filters-container">
        <select 
          value={selectedYear} 
          onChange={handleYearChange}
          className="filter-select"
        >
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="filter-select"
          disabled={!selectedYear}
        >
          <option value="">Select Type</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
          disabled={!selectedYear}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <button 
          className="reset-button" 
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <>
        <h2 className="selected-filters-heading">{getTableTitle()}</h2>
        {!selectedYear ? (
          <div className="no-filter-message">
            Please select a year to view retirement data
          </div>
        ) : (
          <div className="table-content">
            <table className="retirement-table">
              <thead>
                <tr>
                  <th>Ser</th>
                  <th>Servie No.</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Date of Birth</th>
                  <th>Date of Appt</th>
                  <th>Date of Ret</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan="5">{error}</td></tr>
                ) : retirementData.length === 0 ? (
                  <tr><td colSpan="5">No retirement data found</td></tr>
                ) : (
                  retirementData.map((employee, index) => (
                    <tr key={employee._id}>
                      <td>{index + 1}</td>
                      <td>{employee.army_no}</td>
                      <td>{employee.first_name}</td>
                      <td>{employee.designation}</td>
                      <td>{formatDate(new Date(employee.date_of_birth))}</td>
                      <td>{formatDate(new Date(employee.date_of_appointment))}</td>
                      <td>{formatDate(new Date(employee.date_of_retirement))}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Hidden print content */}
        <div className="print-content">
          <div className="doc-header">
            <div className="restricted-text">RESTRICTED</div>
            <div className="daily-orders">DAILY ORDERS PART II</div>
          </div>

          <div className="header-info">
            <div className="left-info">MCEME</div>
            <div className="right-info">Date: {formattedDate}</div>
          </div>
          
          <hr className="header-line" />

          <div className="title-section">
            <h2 className="retirement-heading">RETIREMENT OF CIVILIANS</h2>
            <h3 className="retirement-subheading">{getTableTitle()}</h3>
          </div>
          
          <div className="table-wrapper">
            <table className="retirement-table">
              <thead>
                <tr>
                  <th>Ser</th>
                  <th>Service No.</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Date of Birth</th>
                  <th>Date of Appt</th>
                  <th>Date of Ret</th>
                </tr>
              </thead>
              <tbody>
                {retirementData.map((employee, index) => (
                  <tr key={employee._id}>
                    <td>{index + 1}</td>
                    <td>{employee.army_no}</td>
                    <td>{employee.first_name}</td>
                    <td>{employee.designation}</td>
                    <td>{formatDate(new Date(employee.date_of_birth))}</td>
                    <td>{formatDate(new Date(employee.date_of_appointment))}</td>
                    <td>{formatDate(new Date(employee.date_of_retirement))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    </div>
  );
};

export default Retirement;