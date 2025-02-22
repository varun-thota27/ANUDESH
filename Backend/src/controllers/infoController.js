import pool from "../db.js";

const infoController = {
  // GET /info/dept - Fetch all departments
  getDepartments: async (req, res) => {
    try {
      const result = await pool.query("SELECT dept_name FROM department");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTrade: async (req, res) => {
    try {
      const result = await pool.query("SELECT trade FROM designation");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getEmp: async (req, res) => {
    try {
      const result = await pool.query(`SELECT 
    e.army_no, e.faculty, e.designation, e.first_name, e.middle_name, 
    e.last_name, e.gpf_pran, e.category, e.date_of_birth, e.date_of_appointment, 
    e.date_of_retirement, MAX(p.date) AS latest_promotion_date, 
    e.pay_level, e.ind, e.date_of_audit
FROM employees e
LEFT JOIN promotions p ON e.gpf_pran = p.gpf_pran  -- Correct JOIN condition
GROUP BY 
    e.army_no, e.faculty, e.designation, e.first_name, e.middle_name, 
    e.last_name, e.gpf_pran, e.category, e.date_of_birth, e.date_of_appointment, 
    e.date_of_retirement, e.pay_level, e.ind, e.date_of_audit;
`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getEmpFac: async (req, res) => {
    try {
      const faculty = req.user.faculty; // Extract faculty from JWT (auth middleware should set this)

        if (!faculty) {
            return res.status(400).json({ error: "Faculty is required" });
        }
      const query =`SELECT 
    e.army_no, e.faculty, e.designation, e.first_name, e.middle_name, 
    e.last_name, e.gpf_pran, e.category, e.date_of_birth, e.date_of_appointment, 
    e.date_of_retirement, MAX(p.date) AS latest_promotion_date, 
    e.pay_level, e.ind, e.date_of_audit
FROM employees e
LEFT JOIN promotions p ON e.gpf_pran = p.gpf_pran 
WHERE e.faculty = $1
GROUP BY 
    e.army_no, e.faculty, e.designation, e.first_name, e.middle_name, 
    e.last_name, e.gpf_pran, e.category, e.date_of_birth, e.date_of_appointment, 
    e.date_of_retirement, e.pay_level, e.ind, e.date_of_audit;
`;
const result = await pool.query(query, [faculty]); // ✅ Pass faculty as a parameter
res.json(result.rows);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  // POST /info/dept - Add a new department
};

export default infoController;
