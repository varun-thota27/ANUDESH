import pool from "../db.js";

const attendanceController = {
  getFaculties: async (req, res) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const role = req.user.role;
      const faculty = req.user.faculty;
      let result;

      if (role === 'admin') {
        result = await pool.query("SELECT dept_name as wing FROM department");
      } else {
        result = await pool.query("SELECT wing FROM faculty_wing WHERE faculty = $1", [faculty]);
      }

      return res.json(result.rows);
      
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getAttendance: async (req, res) => {
    try {
      const result = await pool.query(`SELECT 
        e.faculty,
        COUNT(e.army_no) AS total_strength, 
        SUM(CASE WHEN COALESCE(a.status, '') = 'Present' THEN 1 ELSE 0 END) AS present,
        SUM(CASE WHEN COALESCE(a.status, '') = 'Leave' THEN 1 ELSE 0 END) AS leave_count,
        SUM(CASE WHEN COALESCE(a.status, '') = 'Absent' THEN 1 ELSE 0 END) AS absent,
        SUM(CASE WHEN COALESCE(a.status, '') = 'W/Off' THEN 1 ELSE 0 END) AS w_off
    FROM employees e
    LEFT JOIN attendance a ON DATE(a.timestamp) = CURRENT_DATE AND e.army_no = a.army_no 
    GROUP BY e.faculty;`
    );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getMembers: async (req, res) => {
    try {
      const result = await pool.query(`SELECT 
    a.dept_name, e.first_name, e.middle_name, e.last_name, a.status, a.army_no, a.remarks
FROM attendance a LEFT JOIN employees e ON e.army_no = a.army_no where DATE(a.timestamp) = CURRENT_DATE;`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getData: async (req, res) => {
    try {
      const { faculty } = req.params;
      const result = await pool.query(`SELECT 
                e.first_name, 
                e.middle_name, 
                e.last_name, 
                e.army_no, 
                e.designation,
                COALESCE(l.leave_type, 'None') AS status
            FROM employees e
            LEFT JOIN leave_history l 
                ON e.army_no = l.army_no 
                AND CURRENT_DATE BETWEEN l.from_date AND l.to_date
                AND l.status = 'APPROVED' -- Only include approved leaves
            WHERE e.faculty = $1;
            `, [faculty] // Parameterized query to prevent SQL injection
        );
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  submit: async (req, res) => {
    try {
        const { faculty, date, members } = req.body;

        if (!faculty || !date || !Array.isArray(members)) {
            return res.status(400).json({ error: "Invalid request data" });
        }

        const timestamp = new Date(date).toISOString();

        const queries = members.map(async (row) => {
            // Fetch all leave records if the person is on approved leave
            const leaveRecords = await pool.query(
                `SELECT leave_id, from_date, to_date,leave_type FROM leave_history 
                 WHERE army_no = $1 
                 AND CURRENT_DATE BETWEEN from_date AND to_date
                 AND status = 'APPROVED'`, 
                [row.armyNo]
            );

            if(row.status === "Absent")
            {
              await pool.query(
                `INSERT INTO absent (army_no,date) values ($1,CURRENT_DATE)
                 `,[row.armyNo]
            );
            }

            if (row.status === "Present" && leaveRecords.rows.length > 0) {
                // Process each leave record separately
                for (const leave of leaveRecords.rows) {
                  if (leave.to_date > leave.from_date) {
                    //  First Query - Update leave status
                    const client = await pool.connect();
                    try {
                      await client.query("BEGIN"); // Start transaction
                  
                      await client.query(
                        `UPDATE leave_history 
                         SET to_date = CURRENT_DATE - INTERVAL '1 day',
                             status = 'PENDING' 
                         WHERE leave_id = $1`, 
                        [leave.leave_id]
                      );
                  
                      //  Second Query - Update no_of_days only if leave type is not 'RH' or 'CL'
                      if (leave.leave_type !== 'RH' && leave.leave_type !== 'CL') {
                        const fromDate = new Date(leave.from_date);
                  
                        // Properly fetch `to_date` from the database
                        const result = await client.query(
                          `SELECT to_date FROM leave_history WHERE leave_id = $1`, 
                          [leave.leave_id]
                        );
                  
                        if (result.rows.length === 0 || !result.rows[0].to_date) {
                          throw new Error("No valid to_date found for the given leave_id.");
                        }
                  
                        const toDate = new Date(result.rows[0].to_date);
                  
                        if (isNaN(fromDate) || isNaN(toDate)) {
                          throw new Error("Invalid dates provided.");
                        }
                  
                        const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
                  
                        await client.query(
                          `UPDATE leave_history 
                           SET no_of_days = $2
                           WHERE leave_id = $1`,
                          [leave.leave_id, days] 
                        );
                      } 
                  
                      await client.query("COMMIT"); //  Commit transaction
                    } catch (error) {
                      await client.query("ROLLBACK"); 
                      console.error("Transaction failed:", error);
                    } finally {
                      client.release(); 
                    }
                  }
                                  

                    // Re-fetch updated leave record
                    const updatedLeave = await pool.query(
                        `SELECT from_date, to_date FROM leave_history 
                         WHERE leave_id = $1`, 
                        [leave.leave_id]
                    );

                    // If the updated leave period is invalid, delete it
                    if (updatedLeave.rows.length > 0 && updatedLeave.rows[0].to_date < updatedLeave.rows[0].from_date) {
                        await pool.query(
                            `DELETE FROM leave_history WHERE leave_id = $1`, 
                            [leave.leave_id]
                        );
                    }
                }
            } else if (row.status === "Leave") {
                // If status is "Absent" or any type of leave, increment leave count using leave_id
                for (const leave of leaveRecords.rows) {
                  if(leave.leave_type === 'RH' || leave.leave_type === 'CL')
                    await pool.query(
                        `UPDATE leave_history 
                         SET no_of_days = no_of_days + 1 
                         WHERE leave_id = $1`, 
                        [leave.leave_id]
                    );
                }
            }

            // Insert or update attendance record
            return pool.query(
                `INSERT INTO attendance (army_no, dept_name, status, remarks, timestamp)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (army_no) 
                DO UPDATE 
                SET 
                    status = EXCLUDED.status, 
                    remarks = EXCLUDED.remarks, 
                    timestamp = EXCLUDED.timestamp`,
                [row.armyNo, faculty, row.status || "None", ` ${row.status} `, timestamp]
            );
        });

        await Promise.all(queries);

        res.json({ message: "Attendance data stored successfully" });
    } catch (error) {
        console.error("Error inserting attendance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},
check: async (req, res) => {
  try {
    const { faculty } = req.query; // Change from req.body to req.query
    if (!faculty) {
      return res.status(400).json({ error: "Faculty is required" });
    }

    const result = await pool.query(
      `SELECT COUNT(*) FROM attendance WHERE DATE(timestamp) = CURRENT_DATE AND dept_name = $1`,
      [faculty]
    );

    const exists = result.rows[0].count > 0;
    res.json({ exists });
  } catch (error) {
    console.error("Error checking attendance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


};

export default attendanceController;
