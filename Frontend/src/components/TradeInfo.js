import React, { useState } from "react";
import "./LeaveManagement.css";
import NavBar from "./NavBar";
import manPowerService from "../services/manPowerService";

const TradeInfo = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tradeRecords, setTradeRecords] = useState({}); // Ensure it's an object

  const categories = [
    "Non-Ind(Centrally Controlled)",
    "Non-Ind(Unit Controlled)",
    "Ind(Unit Controlled)",
    "Fire Staff",
  ];

  const faculties = [
    "HQ ADM",
    "HQ TRG",
    "FEMT",
    "FEL",
    "FEME",
    "FAE",
    "CTW",
    "SDD",
    "FDE",
  ];

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedFaculty) {
      setErrorMessage("Please fill in all fields before submitting.");
      return;
    }

    try {
      const res = await manPowerService.tradeInfo({
        category: selectedCategory,
        faculty: selectedFaculty,
      });

      const response=res[0].result;
      console.log("Fetched Leave Records:", response);
      setTradeRecords(response && typeof response === "object" ? response : {});
    } catch (error) {
      console.error("Error fetching leave records:", error);
    }
  };

  // Extract faculties dynamically
  const faculty1 = [
    ...new Set(
      Object.values(tradeRecords)
        .flatMap((records) => (Array.isArray(records) ? records : [])) // Ensure records is an array
        .map((item) => item.faculty)
    ),
  ];

  return (
    <div>
      <NavBar />
      <div className="leave-record-main-container">
        <div className="controls-container">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Faculty Dropdown */}
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="faculty-select"
          >
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>

          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                {faculty1.map((faculty) => (
                  <th key={faculty}>{faculty}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tradeRecords).map(([category, records]) => {
                if (!Array.isArray(records)) return null; // Ensure records is an array

                return (
                  <tr key={category}>
                    <td>{category}</td>
                    {faculty1.map((faculty) => {
                      const facultyData =
                        records.find((item) => item.faculty === faculty) || { employee_count: 0 };
                      return <td key={faculty}>{facultyData.employee_count}</td>;
                    })}
                    <td>{records.reduce((sum, item) => sum + item.employee_count, 0)}</td>
                  </tr>
                );
              })}

              {/* TOTAL ROW */}
              <tr>
                <td>
                  <b>Total</b>
                </td>
                {faculty1.map((faculty) => {
                  const total = Object.values(tradeRecords)
                    .flatMap((records) => (Array.isArray(records) ? records : [])) // Ensure records is an array
                    .filter((item) => item.faculty === faculty)
                    .reduce((sum, item) => sum + item.employee_count, 0);

                  return (
                    <td key={faculty}>
                      <b>{total}</b>
                    </td>
                  );
                })}
                <td>
                  <b>
                    {Object.values(tradeRecords)
                      .flatMap((records) => (Array.isArray(records) ? records : [])) // Ensure records is an array
                      .reduce((sum, item) => sum + item.employee_count, 0)}
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeInfo;
