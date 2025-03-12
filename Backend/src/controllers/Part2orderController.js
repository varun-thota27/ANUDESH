import pool from "../db.js";

const leaveController = {
  fetchLeaveRecords: async (req, res) => {
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
          CASE 
              WHEN lh.status = 'APPROVED' THEN lh.leave_type
              ELSE 'Dies Non'
          END AS leave_type,
          e.designation, 
          lh.no_of_days, 
          e.army_no,
          CONCAT(e.first_name, ' ', COALESCE(e.middle_name, ''), ' ', e.last_name) AS name,
          e.faculty
        FROM leave_history lh
        JOIN employees e ON lh.army_no = e.army_no
        WHERE lh.from_date BETWEEN $1 AND $2 
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