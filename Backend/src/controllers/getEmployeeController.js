import pool from "../db.js";
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
      // First, find the GPF/PRAN using the army number
      const armyNo = String(id);  // Convert to string
      const gpfQuery = `SELECT gpf_pran FROM employees WHERE army_no = $1`;
      const gpfResult = await pool.query(gpfQuery, [armyNo]);

      if (gpfResult.rows.length === 0) {
          return res.status(404).json({ error: "Employee not found" });
      }

      const gpfPran = gpfResult.rows[0].gpf_pran;

      // Now, fetch employee details using the GPF/PRAN
      const employeeQuery = `SELECT * FROM employees WHERE gpf_pran = $1`;
      const employeeResult = await pool.query(employeeQuery, [gpfPran]);

      if (employeeResult.rows.length === 0) {
          return res.status(404).json({ error: "Employee details not found" });
      }

      const employee = employeeResult.rows[0];

      // Fetch related data (probations, promotions, postings, family members) using GPF/PRAN
      const probationQuery = `SELECT * FROM probations WHERE gpf_pran = $1`;
      const promotionQuery = `SELECT * FROM promotions WHERE gpf_pran = $1`;
      const postingQuery = `SELECT * FROM postings WHERE gpf_pran = $1`;
      const familyMemberQuery = `SELECT * FROM family_members WHERE gpf_pran = $1`;

      const [probationResult, promotionResult, postingResult, familyMemberResult] = await Promise.all([
          pool.query(probationQuery, [gpfPran]),
          pool.query(promotionQuery, [gpfPran]),
          pool.query(postingQuery, [gpfPran]),
          pool.query(familyMemberQuery, [gpfPran])
      ]);

      employee.probations = probationResult.rows;
      employee.promotions = promotionResult.rows;
      employee.postings = postingResult.rows;
      employee.familyMembers = familyMemberResult.rows;

      res.status(200).json(employee);
  } catch (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
