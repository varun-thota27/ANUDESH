import pool from "../db.js";

const manPowerController = {
  getCategory: async (req, res) => {
    try {
      const query1=`SELECT c.cat,sum("HQ ADM"+"HQ TRG"+"FEMT"+"FEL"+"FEME"+"FAE"+"CTW"+"SDD"+"FDE") as sum, 
      (SELECT count(e.ind) FROM employees e where e.ind=c.cat) as held FROM category c group by cat order by cat desc`;
      const result = await pool.query(query1);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getCategoryWing: async (req, res) => {
    try {
      const query1=`WITH aggregated_data AS (
    SELECT 
        COALESCE(c.cat, 'Unknown') AS cat, 
        f.faculty,
        COUNT(e.ind) AS employee_count,
        CASE f.faculty
            WHEN 'HQ ADM' THEN c."HQ ADM"
            WHEN 'HQ TRG' THEN c."HQ TRG"
            WHEN 'FEMT' THEN c."FEMT"
            WHEN 'FEL' THEN c."FEL"
            WHEN 'FEME' THEN c."FEME"
            WHEN 'FAE' THEN c."FAE"
            WHEN 'CTW' THEN c."CTW"
            WHEN 'SDD' THEN c."SDD"
            WHEN 'FDE' THEN c."FDE"
            ELSE NULL
        END AS auth
    FROM category c
    CROSS JOIN faculty_wing f
    LEFT JOIN employees e 
        ON c.cat = e.ind 
        AND e.faculty = f.wing
    WHERE f.faculty IN (SELECT dept_name FROM head_departments)
    GROUP BY c.cat, f.faculty, c."HQ ADM", c."HQ TRG", c."FEMT", c."FEL", c."FEME", c."FAE", c."CTW", c."SDD", c."FDE"
)
SELECT jsonb_object_agg(
    cat, data ORDER BY cat DESC 
) 
FROM (
    SELECT 
        cat,
        jsonb_agg(
            jsonb_build_object(
                'faculty', faculty,
                'employee_count', employee_count,
                'auth', auth
            ) ORDER BY faculty DESC 
        ) AS data
    FROM aggregated_data
    GROUP BY cat
    ORDER BY cat DESC  
) AS grouped_data;

`;
      const result = await pool.query(query1);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching category wing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getNonIndCentral: async (req, res) => {
    try {
        const query1 = `
        WITH aggregated_data AS (
            SELECT 
                COALESCE(d.trade, 'Unknown') AS trade, 
                f.faculty,
                COUNT(DISTINCT e.army_no) AS employee_count,
                CASE f.faculty
                    WHEN 'HQ ADM' THEN d."HQ ADM"
                    WHEN 'HQ TRG' THEN d."HQ TRG"
                    WHEN 'FEMT' THEN d."FEMT"
                    WHEN 'FEL' THEN d."FEL"
                    WHEN 'FEME' THEN d."FEME"
                    WHEN 'FAE' THEN d."FAE"
                    WHEN 'CTW' THEN d."CTW"
                    WHEN 'SDD' THEN d."SDD"
                    WHEN 'FDE' THEN d."FDE"
                    ELSE NULL
                END AS auth
            FROM designation_manpower d
            CROSS JOIN faculty_wing f
            LEFT JOIN designation d1 
                ON d1.manpower_group = d.trade
            LEFT JOIN employees e 
                ON e.designation = d1.trade 
                AND e.faculty = f.wing
            WHERE f.faculty IN (SELECT dept_name FROM head_departments) 
            AND d.cat = 'Non-Ind(Centrally Controlled)'
            GROUP BY d.trade, f.faculty, d."HQ ADM", d."HQ TRG", d."FEMT", d."FEL", d."FEME", d."FAE", d."CTW", d."SDD", d."FDE"
        ),
        grouped_data AS (
            SELECT 
                trade,
                JSONB_AGG(
                    JSONB_BUILD_OBJECT(
                        'faculty', faculty,
                        'employee_count', employee_count,
                        'auth', auth
                    ) ORDER BY faculty ASC
                ) AS faculty_list
            FROM aggregated_data
            GROUP BY trade
        )
        SELECT JSONB_OBJECT_AGG(trade, faculty_list) AS result FROM grouped_data;
        `;

        const result = await pool.query(query1);

        res.json(result.rows[0].result);
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
},
getNonIndUnit: async (req, res) => {
  try {
      const query1 = `
      WITH aggregated_data AS (
          SELECT 
              COALESCE(d.trade, 'Unknown') AS trade, 
              f.faculty,
              COUNT(DISTINCT e.army_no) AS employee_count,
              CASE f.faculty
                  WHEN 'HQ ADM' THEN d."HQ ADM"
                  WHEN 'HQ TRG' THEN d."HQ TRG"
                  WHEN 'FEMT' THEN d."FEMT"
                  WHEN 'FEL' THEN d."FEL"
                  WHEN 'FEME' THEN d."FEME"
                  WHEN 'FAE' THEN d."FAE"
                  WHEN 'CTW' THEN d."CTW"
                  WHEN 'SDD' THEN d."SDD"
                  WHEN 'FDE' THEN d."FDE"
                  ELSE NULL
              END AS auth
          FROM designation_manpower d
          CROSS JOIN faculty_wing f
          LEFT JOIN designation d1 
              ON d1.manpower_group = d.trade
          LEFT JOIN employees e 
              ON e.designation = d1.trade 
              AND e.faculty = f.wing
          WHERE f.faculty IN (SELECT dept_name FROM head_departments) 
          AND d.cat = 'Non-Ind(Unit Controlled)'
          GROUP BY d.trade, f.faculty, d."HQ ADM", d."HQ TRG", d."FEMT", d."FEL", d."FEME", d."FAE", d."CTW", d."SDD", d."FDE"
      ),
      grouped_data AS (
          SELECT 
              trade,
              JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                      'faculty', faculty,
                      'employee_count', employee_count,
                      'auth', auth
                  ) ORDER BY faculty ASC
              ) AS faculty_list
          FROM aggregated_data
          GROUP BY trade
      )
      SELECT JSONB_OBJECT_AGG(trade, faculty_list) AS result FROM grouped_data;
      `;

      const result = await pool.query(query1);

      if (result.rows.length === 0 || !result.rows[0].result) {
        return res.status(404).json({ message: "No data found." });
    }
    
    res.json(result.rows[0].result);
    
  } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
},
getIndUnit: async (req, res) => {
  try {
      const query1 = `
      WITH aggregated_data AS (
          SELECT 
              COALESCE(d.trade, 'Unknown') AS trade, 
              f.faculty,
              COUNT(DISTINCT e.army_no) AS employee_count,
              CASE f.faculty
                  WHEN 'HQ ADM' THEN d."HQ ADM"
                  WHEN 'HQ TRG' THEN d."HQ TRG"
                  WHEN 'FEMT' THEN d."FEMT"
                  WHEN 'FEL' THEN d."FEL"
                  WHEN 'FEME' THEN d."FEME"
                  WHEN 'FAE' THEN d."FAE"
                  WHEN 'CTW' THEN d."CTW"
                  WHEN 'SDD' THEN d."SDD"
                  WHEN 'FDE' THEN d."FDE"
                  ELSE NULL
              END AS auth
          FROM designation_manpower d
          CROSS JOIN faculty_wing f
          LEFT JOIN designation d1 
              ON d1.manpower_group = d.trade
          LEFT JOIN employees e 
              ON e.designation = d1.trade 
              AND e.faculty = f.wing
          WHERE f.faculty IN (SELECT dept_name FROM head_departments) 
          AND d.cat = 'Ind(Unit Controlled)'
          GROUP BY d.trade, f.faculty, d."HQ ADM", d."HQ TRG", d."FEMT", d."FEL", d."FEME", d."FAE", d."CTW", d."SDD", d."FDE"
      ),
      grouped_data AS (
          SELECT 
              trade,
              JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                      'faculty', faculty,
                      'employee_count', employee_count,
                      'auth', auth
                  ) ORDER BY faculty ASC
              ) AS faculty_list
          FROM aggregated_data
          GROUP BY trade
      )
      SELECT JSONB_OBJECT_AGG(trade, faculty_list) AS result FROM grouped_data;
      `;

      const result = await pool.query(query1);

      if (result.rows.length === 0 || !result.rows[0].result) {
        return res.status(404).json({ message: "No data found." });
    }
    
    res.json(result.rows[0].result);
    
  } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
},
getFireStaff: async (req, res) => {
  try {
      const query1 = `
      WITH aggregated_data AS (
          SELECT 
              COALESCE(d.trade, 'Unknown') AS trade, 
              f.faculty,
              COUNT(DISTINCT e.army_no) AS employee_count,
              CASE f.faculty
                  WHEN 'HQ ADM' THEN d."HQ ADM"
                  WHEN 'HQ TRG' THEN d."HQ TRG"
                  WHEN 'FEMT' THEN d."FEMT"
                  WHEN 'FEL' THEN d."FEL"
                  WHEN 'FEME' THEN d."FEME"
                  WHEN 'FAE' THEN d."FAE"
                  WHEN 'CTW' THEN d."CTW"
                  WHEN 'SDD' THEN d."SDD"
                  WHEN 'FDE' THEN d."FDE"
                  ELSE NULL
              END AS auth
          FROM designation_manpower d
          CROSS JOIN faculty_wing f
          LEFT JOIN designation d1 
              ON d1.manpower_group = d.trade
          LEFT JOIN employees e 
              ON e.designation = d1.trade 
              AND e.faculty = f.wing
          WHERE f.faculty IN (SELECT dept_name FROM head_departments) 
          AND d.cat = 'Fire Staff'
          GROUP BY d.trade, f.faculty, d."HQ ADM", d."HQ TRG", d."FEMT", d."FEL", d."FEME", d."FAE", d."CTW", d."SDD", d."FDE"
      ),
      grouped_data AS (
          SELECT 
              trade,
              JSONB_AGG(
                  JSONB_BUILD_OBJECT(
                      'faculty', faculty,
                      'employee_count', employee_count,
                      'auth', auth
                  ) ORDER BY faculty ASC
              ) AS faculty_list
          FROM aggregated_data
          GROUP BY trade
      )
      SELECT JSONB_OBJECT_AGG(trade, faculty_list) AS result FROM grouped_data;
      `;

      const result = await pool.query(query1);

      if (result.rows.length === 0 || !result.rows[0].result) {
        return res.status(404).json({ message: "No data found." });
    }
    
    res.json(result.rows[0].result);
    
  } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
},
getTradeInfo: async (req, res) => {
    try {
     const { category} = req.query;
      const query1=`WITH faculty_filtered AS (
    SELECT wing FROM faculty_wing WHERE faculty = $2
),
aggregated_data AS (
    SELECT 
        COALESCE(d.trade, 'Unknown') AS trade, 
        f.faculty,
        COUNT(DISTINCT e.army_no) AS employee_count
    FROM designation_manpower d
    JOIN faculty_wing f 
        ON f.wing = ANY(ARRAY(SELECT wing FROM faculty_filtered))
    LEFT JOIN designation d1 
        ON d1.manpower_group = d.trade
    LEFT JOIN employees e 
        ON e.designation = d1.trade 
        AND e.faculty = f.faculty
    WHERE d.cat = $1
    GROUP BY d.trade, f.faculty
),
grouped_data AS (
    SELECT 
        trade,
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'faculty', faculty,
                'employee_count', employee_count
            ) ORDER BY faculty ASC
        ) AS faculty_list
    FROM aggregated_data
    GROUP BY trade
)
SELECT JSONB_OBJECT_AGG(trade, faculty_list) AS result FROM grouped_data;
`;
      const result = await pool.query(query1,[category.category,category.faculty]);
      //console.log(result.rows);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

};

export default manPowerController;