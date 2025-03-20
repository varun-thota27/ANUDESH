import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import manPowerService from '../services/manPowerService';
import NavBar from './NavBar';
import './manPower.css';

const ManPower = () => {
  const [category, setCategory] = useState([]);
  const [categoryWing, setCategoryWing] = useState([]);
  const [NonIndCentral, setNonIndCentral] = useState([]);
  const [NonIndUnit, setNonIndUnit] = useState([]);
  const [IndUnit, setIndUnit] = useState([]);
  const [FireStaff, setFireStaff] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
         const data = await manPowerService.fetchCategory();
         setCategory(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchCategoryWing = async () => {
      try {
         const data = await manPowerService.fetchCategoryWing();
         const tableData = data[0].jsonb_object_agg;
         
         const sortedTableData = Object.fromEntries(
          Object.entries(tableData).sort(([a], [b]) => b.localeCompare(a))
        );
  
        setCategoryWing(sortedTableData);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchCategoryWing();
  }, []);

  useEffect(() => {
    const fetchNonIndCentral = async () => {
      try {
        const data = await manPowerService.fetchNonIndCentral();
        setNonIndCentral(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchNonIndCentral();
  }, []);

  useEffect(() => {
    const fetchNonIndUnit = async () => {
      try {
        const data = await manPowerService.fetchNonIndUnit();
        setNonIndUnit(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchNonIndUnit();
  }, []);

  useEffect(() => {
    const fetchIndUnit = async () => {
      try {
        const data = await manPowerService.fetchIndUnit();
        setIndUnit(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchIndUnit();
  }, []);

  useEffect(() => {
    const fetchFireStaff = async () => {
      try {
        const data = await manPowerService.fetchFireStaff();
        setFireStaff(data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchFireStaff();
  }, []);

  const totals = category.reduce((acc, row) => ({
    auth: acc.auth + Number(row.sum || 0),  // Convert to number before adding
    held: acc.held + Number(row.held || 0),  // Convert to number before adding
    defi: acc.defi + (Number(row.sum || 0) - Number(row.defi || 0)) // Convert both before subtraction
}), { 
    auth: 0, held: 0, defi: 0
});

  const handlePrint = () => {
    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    // Get all tables
    const tables = document.querySelectorAll('.table-wrapper');
    
    // Create print document content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Manpower Tables</title>
          <style>
            @page {
              size: A4;
              margin: 1.5cm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .print-container {
              width: 100%;
            }
            .table-wrapper {
              width: 100%;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .table-wrapper:nth-child(2n)::after {
              content: '';
              display: block;
              page-break-after: always;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid black;
              padding: 4px;
              font-size: 10pt;
              text-align: left;
            }
            h3 {
              margin: 0 0 10px 0;
              font-size: 12pt;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${Array.from(tables).map(table => table.outerHTML).join('')}
          </div>
        </body>
      </html>
    `;

    // Write to iframe and print
    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(printContent);
    frameDoc.close();

    // Wait for images and styles to load
    printFrame.onload = () => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (e) {
        console.error('Print failed:', e);
      }
    };

    // Remove iframe after printing
    const cleanup = () => {
      if (printFrame && printFrame.parentNode === document.body) {
        document.body.removeChild(printFrame);
      }
    };
    printFrame.contentWindow.onafterprint = cleanup;
    // Backup cleanup in case onafterprint doesn't fire
    setTimeout(() => {
      cleanup();
    }, 2000);
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/tradeInfo");
  };

  const faculties = ["HQ ADM", "HQ TRG", "FEMT", "FEL", "FEME", "FAE", "CTW", "SDD", "FDE"];

  return (
    <div>
      <NavBar />
    <div className="manpower-container">
    <div className="button-container">
  <button className="print-button5" onClick={handlePrint}>Print Tables</button>
  <button className="info-button5" onClick={handleNavigate}>Trade Info</button>
</div>
      <div className="tables-container">
        <div className="table-wrapper">
          <h3>MANPOWER STATE : CIV</h3>
          <table>
            <thead>
              <tr>
                <th>Cat</th>
                <th>Auth as per PE</th>
                <th>Auth as per UPP</th>
                <th>Held</th>
                <th>Defi/Sur</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
            {category.map((app, index) => (
                <tr key={index}>
                  <td>{app.cat}</td>
                  <td contentEditable="true">{app.sum}</td>
                  <td>--</td>
                  <td contentEditable="true">{app.held}</td>
                  <td>(-) {(Number(app.sum,10)||0)-(Number(app.defi,10)||0)}</td>
                  <td contentEditable="true"></td>
                </tr>
              ))}
              <tr>
              <td><b>Total</b></td>
              <td><b>{totals.auth}</b></td>
              <td><b>--</b></td>
              <td><b>{totals.held}</b></td>
              <td><b>{totals.defi}</b></td>
              <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 2: MANPOWER SUMMARY STATE : CIV DEF EMP */}
        <div className="table-wrapper">
          <h3>MANPOWER SUMMARY STATE : CIV DEF EMP</h3>
          <table>
          <thead>
        <tr>
          <th rowSpan="2">Cat</th>
          {faculties.map((faculty) => (
            <th colSpan="2" key={faculty}>{faculty}</th>
          ))}
          <th colSpan="2">TOTAL</th>
        </tr>
        <tr>
          {faculties.map(() => (
            <>
              <th>A</th>
              <th>H</th>
            </>
          ))}
          <th>A</th>
          <th>H</th>
        </tr>
      </thead>
      <tbody>
  {Object.entries(categoryWing)
    .sort(([a], [b]) => {
      if (a === "Total") return 1; // Move TOTAL to the bottom
      if (b === "Total") return -1;
      return b.localeCompare(a); // Sort remaining categories in descending order
    })
    .map(([category, values]) => (
      <tr key={category}>
        <td>{category}</td>
        {faculties.map((faculty) => {
          const facultyData = values.find((item) => item.faculty === faculty) || { auth: 0, employee_count: 0 };
          return (
            <React.Fragment key={faculty}>
              <td>{facultyData.auth}</td>
              <td>{facultyData.employee_count}</td>
            </React.Fragment>
          );
        })}
        <td>{values.reduce((sum, item) => sum + Number(item.auth || 0), 0)}</td>
        <td>{values.reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</td>
      </tr>
    ))}

  {/* TOTAL ROW */}
  <tr>
    <td><b>Total</b></td>
    {faculties.map((faculty) => {
      const total = Object.values(categoryWing).flat().reduce(
        (acc, row) => {
          if (row.faculty === faculty) {
            acc.auth += Number(row.auth || 0);
            acc.held += Number(row.employee_count || 0);
          }
          return acc;
        },
        { auth: 0, held: 0 }
      );
      return (
        <React.Fragment key={faculty}>
          <td><b>{total.auth}</b></td>
          <td><b>{total.held}</b></td>
        </React.Fragment>
      );
    })}
    <td><b>{Object.values(categoryWing).flat().reduce((sum, item) => sum + Number(item.auth || 0), 0)}</b></td>
    <td><b>{Object.values(categoryWing).flat().reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</b></td>
  </tr>
</tbody>

    </table>
        </div>

        {/* Table 3: MANPOWER DISTR : NON IND CENTRALLY CONTROLLED */}
        <div className="table-wrapper">
          <h3>MANPOWER DISTR : NON IND CENTRALLY CONTROLLED</h3>
          <table>
              <thead>
            <tr>
              <th rowSpan="2">Trade</th>
              {faculties.map((faculty) => (
                <th colSpan="2" key={faculty}>{faculty}</th>
              ))}
              <th colSpan="2">TOTAL</th>
            </tr>
            <tr>
              {faculties.map(() => (
                <>
                  <th>A</th>
                  <th>H</th>
                </>
              ))}
              <th>A</th>
              <th>H</th>
            </tr>
          </thead>
          <tbody>
      {Object.entries(NonIndCentral)
        .sort(([a], [b]) => {
          if (a === "Total") return 1; // Move TOTAL to the bottom
          if (b === "Total") return -1;
          return a.localeCompare(b); // Sort remaining categories in descending order
        })
        .map(([category, values]) => (
          <tr key={category}>
            <td>{category}</td>
            {faculties.map((faculty) => {
              const facultyData = values.find((item) => item.faculty === faculty) || { auth: 0, employee_count: 0 };
              return (
                <React.Fragment key={faculty}>
                  <td contentEditable='true'>{facultyData.auth}</td>
                  <td contentEditable='true'>{facultyData.employee_count}</td>
                </React.Fragment>
              );
            })}
            <td>{values.reduce((sum, item) => sum + Number(item.auth || 0), 0)}</td>
            <td>{values.reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</td>
          </tr>
        ))}

      {/* TOTAL ROW */}
      <tr>
        <td><b>Total</b></td>
        {faculties.map((faculty) => {
          const total = Object.values(NonIndCentral).flat().reduce(
            (acc, row) => {
              if (row.faculty === faculty) {
                acc.auth += Number(row.auth || 0);
                acc.held += Number(row.employee_count || 0);
              }
              return acc;
            },
            { auth: 0, held: 0 }
          );
          return (
            <React.Fragment key={faculty}>
              <td><b>{total.auth}</b></td>
              <td><b>{total.held}</b></td>
            </React.Fragment>
          );
        })}
        <td><b>{Object.values(NonIndCentral).flat().reduce((sum, item) => sum + Number(item.auth || 0), 0)}</b></td>
        <td><b>{Object.values(NonIndCentral).flat().reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</b></td>
      </tr>
    </tbody>

    </table>
    <td  contentEditable='true'>@ Foot notes
                </td>
        </div>

        {/* Table 4: MANPOWER DISTR: NON IND UNIT CONTROLLED */}
        <div className="table-wrapper">
          <h3>MANPOWER DISTR: NON IND UNIT CONTROLLED </h3>
            <table>
                <thead>
              <tr>
                <th rowSpan="2">Trade</th>
                {faculties.map((faculty) => (
                  <th colSpan="2" key={faculty}>{faculty}</th>
                ))}
                <th colSpan="2">TOTAL</th>
              </tr>
              <tr>
                {faculties.map(() => (
                  <>
                    <th>A</th>
                    <th>H</th>
                  </>
                ))}
                <th>A</th>
                <th>H</th>
              </tr>
            </thead>
            <tbody>
        {Object.entries(NonIndUnit)
          .sort(([a], [b]) => {
            if (a === "Total") return 1; // Move TOTAL to the bottom
            if (b === "Total") return -1;
            return a.localeCompare(b); // Sort remaining categories in descending order
          })
          .map(([category, values]) => (
            <tr key={category}>
              <td>{category}</td>
              {faculties.map((faculty) => {
                const facultyData = values.find((item) => item.faculty === faculty) || { auth: 0, employee_count: 0 };
                return (
                  <React.Fragment key={faculty}>
                    <td contentEditable='true'>{facultyData.auth}</td>
                    <td contentEditable='true'>{facultyData.employee_count}</td>
                  </React.Fragment>
                );
              })}
              <td>{values.reduce((sum, item) => sum + Number(item.auth || 0), 0)}</td>
              <td>{values.reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</td>
            </tr>
          ))}

        {/* TOTAL ROW */}
        <tr>
          <td><b>Total</b></td>
          {faculties.map((faculty) => {
            const total = Object.values(NonIndUnit).flat().reduce(
              (acc, row) => {
                if (row.faculty === faculty) {
                  acc.auth += Number(row.auth || 0);
                  acc.held += Number(row.employee_count || 0);
                }
                return acc;
              },
              { auth: 0, held: 0 }
            );
            return (
              <React.Fragment key={faculty}>
                <td><b>{total.auth}</b></td>
                <td><b>{total.held}</b></td>
              </React.Fragment>
            );
          })}
          <td><b>{Object.values(NonIndUnit).flat().reduce((sum, item) => sum + Number(item.auth || 0), 0)}</b></td>
          <td><b>{Object.values(NonIndUnit).flat().reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</b></td>
        </tr>
      </tbody>

      </table>
                <td  contentEditable='true'>@ Foot notes
                </td>
        </div>

        {/* Table 5: MANPOWER DISTR -IND UNIT CONTROLLED*/}
        <div className="table-wrapper">
          <h3>MANPOWER DISTR : IND UNIT CONTROLLED</h3>
          <table>
                <thead>
              <tr>
                <th rowSpan="2">Trade</th>
                {faculties.map((faculty) => (
                  <th colSpan="2" key={faculty}>{faculty}</th>
                ))}
                <th colSpan="2">TOTAL</th>
              </tr>
              <tr>
                {faculties.map(() => (
                  <>
                    <th>A</th>
                    <th>H</th>
                  </>
                ))}
                <th>A</th>
                <th>H</th>
              </tr>
            </thead>
            <tbody>
        {Object.entries(IndUnit)
          .sort(([a], [b]) => {
            if (a === "Total") return 1; // Move TOTAL to the bottom
            if (b === "Total") return -1;
            return a.localeCompare(b); // Sort remaining categories in descending order
          })
          .map(([category, values]) => (
            <tr key={category}>
              <td>{category}</td>
              {faculties.map((faculty) => {
                const facultyData = values.find((item) => item.faculty === faculty) || { auth: 0, employee_count: 0 };
                return (
                  <React.Fragment key={faculty}>
                    <td contentEditable='true'>{facultyData.auth}</td>
                    <td contentEditable='true'>{facultyData.employee_count}</td>
                  </React.Fragment>
                );
              })}
              <td>{values.reduce((sum, item) => sum + Number(item.auth || 0), 0)}</td>
              <td>{values.reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</td>
            </tr>
          ))}

        {/* TOTAL ROW */}
        <tr>
          <td><b>Total</b></td>
          {faculties.map((faculty) => {
            const total = Object.values(IndUnit).flat().reduce(
              (acc, row) => {
                if (row.faculty === faculty) {
                  acc.auth += Number(row.auth || 0);
                  acc.held += Number(row.employee_count || 0);
                }
                return acc;
              },
              { auth: 0, held: 0 }
            );
            return (
              <React.Fragment key={faculty}>
                <td><b>{total.auth}</b></td>
                <td><b>{total.held}</b></td>
              </React.Fragment>
            );
          })}
          <td><b>{Object.values(IndUnit).flat().reduce((sum, item) => sum + Number(item.auth || 0), 0)}</b></td>
          <td><b>{Object.values(IndUnit).flat().reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</b></td>
        </tr>
      </tbody>

      </table>
          
                <td  contentEditable='true'>@ Foot notes
                </td>
        </div>

        {/* Table 6: MANPOWER DISTR: FIRE STAFF */}
        <div className="table-wrapper">
          <h3>MANPOWER DISTR : FIRE STAFF</h3>
          <table>
                <thead>
              <tr>
                <th rowSpan="2">Trade</th>
                {faculties.map((faculty) => (
                  <th colSpan="2" key={faculty}>{faculty}</th>
                ))}
                <th colSpan="2">TOTAL</th>
              </tr>
              <tr>
                {faculties.map(() => (
                  <>
                    <th>A</th>
                    <th>H</th>
                  </>
                ))}
                <th>A</th>
                <th>H</th>
              </tr>
            </thead>
            <tbody>
        {Object.entries(FireStaff)
          .sort(([a], [b]) => {
            if (a === "Total") return 1; // Move TOTAL to the bottom
            if (b === "Total") return -1;
            return a.localeCompare(b); // Sort remaining categories in descending order
          })
          .map(([category, values]) => (
            <tr key={category}>
              <td>{category}</td>
              {faculties.map((faculty) => {
                const facultyData = values.find((item) => item.faculty === faculty) || { auth: 0, employee_count: 0 };
                return (
                  <React.Fragment key={faculty}>
                    <td contentEditable='true'>{facultyData.auth}</td>
                    <td contentEditable='true'>{facultyData.employee_count}</td>
                  </React.Fragment>
                );
              })}
              <td>{values.reduce((sum, item) => sum + Number(item.auth || 0), 0)}</td>
              <td>{values.reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</td>
            </tr>
          ))}

        {/* TOTAL ROW */}
        <tr>
          <td><b>Total</b></td>
          {faculties.map((faculty) => {
            const total = Object.values(FireStaff).flat().reduce(
              (acc, row) => {
                if (row.faculty === faculty) {
                  acc.auth += Number(row.auth || 0);
                  acc.held += Number(row.employee_count || 0);
                }
                return acc;
              },
              { auth: 0, held: 0 }
            );
            return (
              <React.Fragment key={faculty}>
                <td><b>{total.auth}</b></td>
                <td><b>{total.held}</b></td>
              </React.Fragment>
            );
          })}
          <td><b>{Object.values(FireStaff).flat().reduce((sum, item) => sum + Number(item.auth || 0), 0)}</b></td>
          <td><b>{Object.values(FireStaff).flat().reduce((sum, item) => sum + Number(item.employee_count || 0), 0)}</b></td>
        </tr>
      </tbody>

      </table>
          
                <td  contentEditable='true'>@ Foot notes
                </td>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManPower;