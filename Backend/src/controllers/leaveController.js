import pool from "../db.js";

const leaveController = {
  getEmployees: async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        console.log("Decoded user from request:", req.user); // Debugging

        const role = req.user?.role;  // Ensure `req.user` is available
        const faculty = req.user?.faculty; // Extract faculty from req.user

        if (!faculty && role !== 'admin') {
            console.error("Faculty is missing for non-admin user!");
            return res.status(400).json({ message: "Faculty information is required!" });
        }

        let result;
        if (role !== 'admin') {
            result = await pool.query(
                `SELECT e.army_no, e.first_name, e.middle_name, e.last_name, 
                 e.designation, e.faculty 
                 FROM employees e 
                 JOIN faculty_wing f ON e.faculty=f.wing 
                 WHERE f.faculty = $1`,
                [faculty]  // Use `faculty` from `req.user`
            );
        } else {
            result = await pool.query(
                `SELECT army_no, first_name, middle_name, last_name, designation, faculty FROM employees`
            ); // Admin gets all employees
        }

        return res.json(result.rows);

    } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
},

  submitForm: async (req, res) => {
    try {
        const formData = req.body;
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const armyNo = formData.armyNo;
        const fromDate = new Date(formData.fromDate);
        const toDate = new Date(formData.toDate);

        // Handling Extension of Leave
        if (formData.leaveType === "Extension of Leave") {
            const latestLeaveQuery = `
                SELECT leave_type FROM leave_history 
                WHERE army_no = $1 
                ORDER BY to_date DESC 
                LIMIT 1
            `;

            const { rows } = await pool.query(latestLeaveQuery, [armyNo]);

            if (rows.length > 0) {
                const latestLeaveType = rows[0].leave_type; // Fetch latest leave type
                // Split Extension if it spans two years
                if (fromDate.getFullYear() !== toDate.getFullYear()) {
                    const endOfYear = new Date(fromDate.getFullYear(), 11, 31); // Dec 31 of start year
                    const startOfNextYear = new Date(toDate.getFullYear(), 0, 1); // Jan 1 of next year

                    const absentResult = await pool.query(
                      `SELECT COUNT(*) AS absent_count
                       FROM absent
                       WHERE army_no = $1 AND date BETWEEN $2 AND CURRENT_DATE`,
                      [armyNo, fromDate]
                  );
                  
                  // Extract count and ensure a default value of 0 if no records are found
                  const absentCount = absentResult.rows.length > 0 ? parseInt(absentResult.rows[0].absent_count) : 0;
                  
                  const days1 = (latestLeaveType === 'RH' || latestLeaveType === 'CL')
                      ? absentCount
                      : (Math.ceil((endOfYear - fromDate) / (1000 * 60 * 60 * 24)) + 1);
                  
                    await pool.query(
                        `INSERT INTO leave_history 
                        (army_no, leave_type, from_date, to_date, status, no_of_days, reason_for_leave, 
                        address_on_leave, recommendation, section_officer, recommendation_date, is_extended)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE, $11)`,
                        [armyNo, latestLeaveType, formData.fromDate, endOfYear, 'PENDING', days1,
                        formData.reason, formData.address, formData.recommendation, formData.sectionOfficerName, true]
                    );

                    absentResult = await pool.query(
                      `SELECT COUNT(*) AS absent_count
                       FROM absent
                       WHERE army_no = $1 AND date BETWEEN $2 AND CURRENT_DATE`,
                      [armyNo, startOfNextYear]
                  );
                  absentCount = absentResult.rows.length > 0 ? parseInt(absentResult.rows[0].absent_count) : 0;
                  const days2 = (latestLeaveType === 'RH' || latestLeaveType === 'CL')
                  ? absentCount
                  : (Math.ceil((toDate - startOfNextYear) / (1000 * 60 * 60 * 24)) + 1);

                    await pool.query(
                        `INSERT INTO leave_history 
                        (army_no, leave_type, from_date, to_date, status, no_of_days, reason_for_leave, 
                        address_on_leave, recommendation, section_officer, recommendation_date, is_extended)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE, $11)`,
                        [armyNo, latestLeaveType, startOfNextYear, formData.toDate, 'PENDING', days2,
                        formData.reason, formData.address, formData.recommendation, formData.sectionOfficerName, true]
                    );
                    await pool.query(
                      `DELETE FROM absent WHERE date BETWEEN $1 AND $2;`,
                      [fromDate, toDate]
                  );                  

                    return res.status(200).json({ message: "Extended leave spanning two years submitted successfully" });
                }

                // **Regular Extension (Single Year)**
                const absentResult = await pool.query(
                  `SELECT COUNT(*) AS absent_count
                   FROM absent
                   WHERE army_no = $1 AND date BETWEEN $2 AND CURRENT_DATE`,
                  [armyNo, fromDate]
              );
              
              // Extract count and ensure a default value of 0 if no records are found
              const absentCount = absentResult.rows.length > 0 ? parseInt(absentResult.rows[0].absent_count) : 0;
              
              const days = (latestLeaveType === 'RH' || latestLeaveType === 'CL')
                  ? absentCount
                  : (Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1);
                const extensionQuery = `
                    INSERT INTO leave_history 
                    (army_no, leave_type, from_date, to_date, status, no_of_days, reason_for_leave, 
                    address_on_leave, recommendation, section_officer, recommendation_date, is_extended)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE, $11)
                `;

                await pool.query(extensionQuery, [
                    armyNo,
                    latestLeaveType, // Use the latest leave type
                    formData.fromDate,
                    formData.toDate,
                    'PENDING',
                    days,
                    formData.reason,
                    formData.address,
                    formData.recommendation,
                    formData.sectionOfficerName,
                    true // Mark as an extension
                ]);
                await pool.query(
                  `DELETE FROM absent WHERE date BETWEEN $1 AND $2;`,
                  [fromDate, toDate]
              );
              

                return res.status(200).json({ message: "Leave extended successfully" });
            } else {
                return res.status(400).json({ message: "No previous leave found for extension" });
            }
        }
        const latestLeaveType = formData.leaveType;
        // **Splitting Regular Leave Across Two Years**
        if (fromDate.getFullYear() !== toDate.getFullYear()) {
            const endOfYear = new Date(fromDate.getFullYear(), 11, 31); // Dec 31 of start year
            const startOfNextYear = new Date(toDate.getFullYear(), 0, 1); // Jan 1 of next year
            
            const absentResult = await pool.query(
              `SELECT COUNT(*) AS absent_count
               FROM absent
               WHERE army_no = $1 AND date BETWEEN $2 AND CURRENT_DATE`,
              [armyNo, fromDate]
          );
          
          // Extract count and ensure a default value of 0 if no records are found
          const absentCount = absentResult.rows.length > 0 ? parseInt(absentResult.rows[0].absent_count) : 0;
          
          const days1 = (latestLeaveType === 'RH' || latestLeaveType === 'CL')
              ? absentCount
              : (Math.ceil((endOfYear - fromDate) / (1000 * 60 * 60 * 24)) + 1);

            await pool.query(
                `INSERT INTO leave_history 
                (army_no, leave_type, from_date, to_date, status, no_of_days, reason_for_leave, 
                address_on_leave, recommendation, section_officer, recommendation_date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE)`,
                [armyNo, formData.leaveType, formData.fromDate, endOfYear, 'PENDING', days1,
                formData.reason, formData.address, formData.recommendation, formData.sectionOfficerName]
            );

            absentResult = await pool.query(
                      `SELECT COUNT(*) AS absent_count
                       FROM absent
                       WHERE army_no = $1 AND date BETWEEN $2 AND CURRENT_DATE`,
                      [armyNo, startOfNextYear]
                  );
            absentCount = absentResult.rows.length > 0 ? parseInt(absentResult.rows[0].absent_count) : 0;
            const days2 = (latestLeaveType === 'RH' || latestLeaveType === 'CL')
                  ? absentCount
                  : (Math.ceil((toDate - startOfNextYear) / (1000 * 60 * 60 * 24)) + 1);

            await pool.query(
                `INSERT INTO leave_history 
                (army_no, leave_type, from_date, to_date, status, no_of_days, reason_for_leave, 
                address_on_leave, recommendation, section_officer, recommendation_date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE)`,
                [armyNo, formData.leaveType, startOfNextYear, formData.toDate, 'PENDING', days2,
                formData.reason, formData.address, formData.recommendation, formData.sectionOfficerName]
            );
            await pool.query(
              `DELETE FROM absent WHERE date BETWEEN $1 AND $2;`,
              [fromDate, toDate]
          );
          

            return res.status(200).json({ message: "Leave spanning two years submitted successfully" });
        }

        // **Insert Normal Leave Record**
        const absentResult = await pool.query(
          `SELECT COUNT(*) AS absent_count
           FROM absent
           WHERE army_no = $1 AND date BETWEEN $2 AND CURRENT_DATE`,
          [armyNo, fromDate]
      );
      
      // Extract count and ensure a default value of 0 if no records are found
      const absentCount = absentResult.rows.length > 0 ? parseInt(absentResult.rows[0].absent_count) : 0;
      
      const days = (latestLeaveType === 'RH' || latestLeaveType === 'CL')
          ? absentCount
          : (Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1);
        const insertQuery = `
            INSERT INTO leave_history 
            (army_no, leave_type, from_date, to_date, status, no_of_days, reason_for_leave, 
            address_on_leave, recommendation, section_officer, recommendation_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE)
        `;

        await pool.query(insertQuery, [
            armyNo,
            formData.leaveType,
            formData.fromDate,
            formData.toDate,
            'PENDING',
            days,
            formData.reason,
            formData.address,
            formData.recommendation,
            formData.sectionOfficerName
        ]);
        await pool.query(
          `DELETE FROM absent WHERE date BETWEEN $1 AND $2;`,
          [fromDate, toDate]
      );      


        return res.status(200).json({ message: 'Successfully submitted' });

    } catch (error) {
        console.error("Error submitting leave:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
},

  getById: async (req, res) => {
    const { id } = req.params;
    try {

      let result;
      const armyNo = String(id);
        result = await pool.query(`
            SELECT 
          lh.leave_type,
          CASE 
              WHEN e.cat = 'yes' THEN le.leaves_ph
              ELSE le.total_leaves
          END AS days_entitled,
          SUM(lh.no_of_days) AS no_of_days,
          (CASE 
              WHEN e.cat = 'yes' THEN le.leaves_ph
              ELSE le.total_leaves
          END - SUM(lh.no_of_days)) AS balance
      FROM leave_history lh
      JOIN employees e ON lh.army_no = e.army_no
      JOIN leaves le ON le.type_of_leave = lh.leave_type
      WHERE lh.army_no = $1 
          AND lh.status = 'APPROVED'
          AND EXTRACT(YEAR FROM lh.to_date) = EXTRACT(YEAR FROM CURRENT_DATE) 
      GROUP BY lh.leave_type, e.cat, le.leaves_ph, le.total_leaves;

        `,[armyNo]);

        return res.status(200).json(result.rows);

      
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getRequests: async (req, res) => {
    try { // Log req.user here
  
      const token = req.cookies.jwt;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
      const role = req.user.role;
      const faculty = req.user.faculty;
      let result;
  
      if (role !== 'admin') {
        result = await pool.query(`
          SELECT e.army_no as army_no, e.first_name, e.middle_name, e.last_name, e.designation, 
                 e.faculty, l.leave_type, l.status,l.from_date,l.to_date,l.no_of_days,l.recommendation_date,
                 l.address_on_leave,l.reason_for_leave,l.approval_date,l.is_extended
          FROM employees e 
          JOIN faculty_wing f ON e.faculty = f.wing 
          JOIN leave_history l ON l.army_no = e.army_no 
          WHERE f.faculty = $1 AND l.from_date >= CURRENT_DATE - INTERVAL '2 month';`, [faculty]);
      }
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching employees:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  fetchAtAdmin : async(req,res) => {
    try {
      const leaveQuery = `
        SELECT 
        lh.army_no, e.first_name, e.middle_name, e.last_name, e.designation, e.faculty, lh.leave_type, 
         lh.status
      FROM leave_history lh
      JOIN employees e ON lh.army_no = e.army_no
      WHERE lh.status = 'PENDING'`;
  
      const leaveResult = await pool.query(leaveQuery);
  
      res.status(200).json(leaveResult.rows);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      res.status(500).json({ error: "Failed to fetch leave data" });
    }
  },
  getData : async(req,res) => {
    const { id } = req.params;
    try {
      const armyNo=String(id);
      const leaveQuery = `
             WITH pending_leaves AS (
    SELECT 
        lh.leave_id, 
        lh.army_no, 
        e.first_name, 
        e.middle_name, 
        e.last_name, 
        e.designation, 
        e.faculty, 
        lh.leave_type, 
        lh.status, 
        lh.recommendation, 
        lh.reason_for_leave, 
        lh.address_on_leave, 
        lh.to_date, 
        lh.from_date, 
        lh.section_officer, 
        lh.recommendation_date, 
        lh.is_extended,
        lh.approval_date
    FROM leave_history lh
    JOIN employees e ON lh.army_no = e.army_no
    WHERE lh.army_no = $1 AND lh.status = 'PENDING'
), leave_entitlements AS (
    SELECT 
        e.army_no,
        jsonb_agg(
            jsonb_build_object(
                'leave_type', le.type_of_leave,
                'days_entitled', 
                CASE 
                    WHEN e.cat = 'yes' THEN le.leaves_ph
                    ELSE le.total_leaves
                END,
                'balance', 
                (CASE 
                    WHEN e.cat = 'yes' THEN le.leaves_ph
                    ELSE le.total_leaves
                END - COALESCE(lh_taken.total_taken, 0))
            )
        ) AS entitlements
    FROM employees e
    JOIN leaves le ON 1=1
    LEFT JOIN (
        -- Calculate the total leave days taken for the current year
        SELECT 
            lh.army_no,
            lh.leave_type,
            SUM(lh.no_of_days) AS total_taken
        FROM leave_history lh
        WHERE lh.status = 'APPROVED'
          AND EXTRACT(YEAR FROM lh.to_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY lh.army_no, lh.leave_type
    ) lh_taken 
    ON e.army_no = lh_taken.army_no AND le.type_of_leave = lh_taken.leave_type
    WHERE e.army_no = $1
    GROUP BY e.army_no
), leaves_taken AS (
    SELECT 
        lh.army_no,
        jsonb_agg(
            jsonb_build_object(
                'leave_type', lh.leave_type,
                'from_date', lh.from_date,
                'to_date', lh.to_date,
                'no_of_days', lh.no_of_days
            )
        ) AS taken_leaves
    FROM leave_history lh
    WHERE lh.status = 'APPROVED' 
      AND EXTRACT(YEAR FROM lh.to_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND lh.army_no = $1
      AND lh.leave_type IN (SELECT DISTINCT leave_type FROM pending_leaves) 
    GROUP BY lh.army_no
)
SELECT jsonb_build_object(
    'pending_leaves', COALESCE(jsonb_agg(pl), '[]'::jsonb),
    'leave_entitlements', (SELECT entitlements FROM leave_entitlements LIMIT 1),
    'leaves_taken', (SELECT taken_leaves FROM leaves_taken LIMIT 1)
) AS merged_result
FROM pending_leaves pl;

`;
  
      const leaveResult = await pool.query(leaveQuery,[armyNo]);
  
      res.status(200).json(leaveResult.rows[0].merged_result);
    } catch (error) {
      console.error("Error fetching leave data:", error);
      res.status(500).json({ error: "Failed to fetch leave data" });
    }
  },
  updateDetails : async (req, res) => {
    try {
      const { decision } = req.body; // Extract decision from request body
      const { id } = req.params; // Extract leave_id from URL params
  
      if (!["APPROVED", "REJECTED"].includes(decision)) {
        return res.status(400).json({ error: "Invalid decision value" });
      }
  
      // Update leave status and approval date only if decision is "APPROVED"
      const query = `
        UPDATE leave_history 
        SET approval_date=CURRENT_DATE, 
            status = $1 
        WHERE leave_id = $2
      `;
  
      await pool.query(query, [decision, id]);
  
      return res.status(200).json({ message: `Leave successfully ${decision.toLowerCase()}` });
    } catch (error) {
      console.error("Error updating leave details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  
},
fetchRecords: async (req, res) => {
  try {
    const { army_no, fromDate, toDate, leave_type } = req.query;
    // Validate inputs
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: "Both fromDate and toDate are required." });
    }

    // Base SQL Query
    let query = `
      SELECT 
        lh.from_date, 
        lh.to_date, 
        lh.leave_type, 
        lh.no_of_days, 
        e.army_no,
        CONCAT(e.first_name, ' ', COALESCE(e.middle_name, ''), ' ', e.last_name) AS name,
        e.faculty
      FROM leave_history lh
      JOIN employees e ON lh.army_no = e.army_no
      WHERE lh.from_date BETWEEN $1 AND $2 AND lh.status='APPROVED'
    `;

    let params = [fromDate, toDate];
    let paramIndex = 3;

    // If army_no is provided, add condition
    if (army_no) {
      query += ` AND lh.army_no = $${paramIndex}`;
      params.push(army_no);
      paramIndex++;
    }

    // If leave_type is not "ALL", add condition
    if (leave_type !== 'ALL') {
      query += ` AND lh.leave_type = $${paramIndex}`;
      params.push(leave_type);
    }

    query += ` ORDER BY lh.from_date DESC;`;

    const { rows } = await pool.query(query, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching leave records:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
},



};


export default leaveController;
