import pool from "../db.js"; // Import database pool

export const UpdateEmployee = async (req, res) => {
    const formData = req.body;
    const { id } = req.params;
    const armyNo = String(id); // Ensure ID is properly formatted

    try {

        const employeeQuery = `
            UPDATE employees
            SET command = $1, gpf_pran =$2::TEXT, directorate = $3, designation = $5, faculty = $6,
                first_name = $7, middle_name = $8, last_name = $9, gender = $10, category = $11,
                religion = $12, date_of_birth = TO_DATE($13, 'YYYY-MM-DD'),
                date_of_appointment = TO_DATE($14, 'YYYY-MM-DD'),
                date_of_retirement = TO_DATE($15, 'YYYY-MM-DD'), mode_of_appointment = $16,
                fr56j = $17, employee_group = $18, ind = $19, education = $20, blood_group = $21,
                cat = $22, pan_number = $23, identification_marks = $24, police_verification_no = $25,
                police_verification_date = TO_DATE($26, 'YYYY-MM-DD'), marriage_do_ptii = $27,
                kindred_roll_do_ptii = $28, bank_account_number = $29, bank_name = $30, ifsc_code = $31,
                court_case = $32, court_name = $33, audit_ = $34, date_of_audit = TO_DATE($35, 'YYYY-MM-DD'),
                penalty = $36, penalty_remarks = $37, mobile_no = $38, email_id = $39, uid_no = $40,
                macp = $41, promotion = $42, permanent_address = $43, temporary_address = $44,
                discp_cases = $45, discp_remarks = $46, probation_period = $47,
                confirmed_date = TO_DATE($48, 'YYYY-MM-DD'), ltc_ta_da = $49, toa_sos_in_mceme = $50,
                pay_level = $51, basic_pay = $52
            WHERE army_no = $4 RETURNING *;
        `;

        const employeeValues = [
            formData.command, formData.gpf_pran, formData.directorate, armyNo,
            formData.designation, formData.faculty, formData.first_name, formData.middle_name,
            formData.last_name, formData.gender, formData.category, formData.religion,
            formData.date_of_birth, formData.date_of_appointment, formData.date_of_retirement,
            formData.mode_of_appointment, formData.fr56j, formData.employee_group, formData.ind,
            formData.education, formData.blood_group, formData.cat, formData.pan_number,
            formData.identification_marks, formData.police_verification_no, formData.police_verification_date,
            formData.marriage_do_ptii, formData.kindred_roll_do_ptii, formData.bank_account_number,
            formData.bank_name, formData.ifsc_code, formData.court_case, formData.court_name,
            formData.audit, formData.date_of_audit, formData.penalty, formData.penalty_emarks,
            formData.mobile_no, formData.email_id, formData.uid_no, formData.macp, formData.promotion,
            formData.permanent_address, formData.temporary_address, formData.discp_cases,
            formData.discp_remarks, formData.probation_period, formData.confirmed_date,
            formData.ltc_ta_da, formData.toa_sos_in_mceme, formData.pay_level, formData.basic_pay
        ];

        // Execute query to update the employee
        const employeeResult = await pool.query(employeeQuery, employeeValues);
        if (employeeResult.rows.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const gpfPran = employeeResult.rows[0].gpf_pran; // Get the updated employee's GPF PRAN

        // **Delete existing related records before inserting new ones**
        await pool.query(`DELETE FROM probations WHERE gpf_pran = $1`, [gpfPran]);
        await pool.query(`DELETE FROM promotions WHERE gpf_pran = $1`, [gpfPran]);
        await pool.query(`DELETE FROM postings WHERE gpf_pran = $1`, [gpfPran]);
        await pool.query(`DELETE FROM family_members WHERE gpf_pran = $1`, [gpfPran]);

        // **Insert Probations**
        for (const probation of formData.probations || []) {
            const probationQuery = `
                INSERT INTO probations (gpf_pran, year, date)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'))
            `;
            await pool.query(probationQuery, [formData.gpf_pran, probation.year, probation.date]);
        }

        // **Insert Promotions**
        for (const promotion of formData.promotions || []) {
            const promotionQuery = `
                INSERT INTO promotions (gpf_pran, name, date)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'))
            `;
            await pool.query(promotionQuery, [formData.gpf_pran, promotion.name, promotion.date]);
        }

        // **Insert Postings**
        for (const posting of formData.postings || []) {
            const postingQuery = `
                INSERT INTO postings (gpf_pran, unit, from_date, to_date)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), TO_DATE($4, 'YYYY-MM-DD'))
            `;
            await pool.query(postingQuery, [formData.gpf_pran, posting.unit, posting.from_date, posting.to_date]);
        }

        // **Insert Family Members**
        for (const familyMember of formData.familyMembers || []) {
            const familyMemberQuery = `
                INSERT INTO family_members (gpf_pran, name, dob, relationship, category, remarks)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), $4, $5, $6)
            `;
            await pool.query(familyMemberQuery, [
                formData.gpf_pran, familyMember.name, familyMember.dob, familyMember.relationship,
                familyMember.category, familyMember.remarks
            ]);
        }

        res.status(200).json({ message: "Employee updated successfully" });

    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};
