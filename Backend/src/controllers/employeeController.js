import pool from "../db.js"; // Import your pool from db.js

export const createEmployee = async (req, res) => {
    const formData = req.body;

    try {
        // Ensure the formData contains all necessary fields
        const employeeQuery = `
            INSERT INTO employees (
                command, gpf_pran, directorate, army_no, designation, faculty,
                first_name, middle_name, last_name, gender, category, religion,
                date_of_birth, date_of_appointment, date_of_retirement, 
                mode_of_appointment, fr56j, employee_group, ind, education, 
                blood_group,cat, pan_number, identification_marks, police_verification_no, 
                police_verification_date, marriage_do_ptii, kindred_roll_do_ptii, 
                bank_account_number, bank_name, ifsc_code, court_case, court_name, 
                audit_,date_of_audit,penalty, penalty_remarks, mobile_no, email_id, uid_no, macp, 
                promotion, permanent_address, temporary_address, discp_cases, 
                discp_remarks, probation_period, confirmed_date, ltc_ta_da, 
                toa_sos_in_mceme, pay_level, basic_pay
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
                TO_DATE($13, 'YYYY-MM-DD'),TO_DATE($14, 'YYYY-MM-DD'),TO_DATE($15, 'YYYY-MM-DD'),
                $16,$17,$18,$19,$20,$21,$50,$22,$23,$24,TO_DATE($25, 'YYYY-MM-DD'),
                $26,$27,$28,$29,$30,$31,$32,$51,TO_DATE($52, 'YYYY-MM-DD'),$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,
                TO_DATE($45, 'YYYY-MM-DD'),$46,$47,$48,$49
            ) RETURNING gpf_pran`;

        // Ensure all the necessary values are passed
        const employeeValues = [
            formData.command, formData.gpfPran, formData.directorate, formData.armyNo,
            formData.designation, formData.faculty, formData.firstName, formData.middleName,
            formData.lastName, formData.gender, formData.category, formData.religion,
            formData.dateOfBirth, formData.dateOfAppointment, formData.dateOfRetirement,
            formData.modeOfAppointment, formData.fr56j, formData.group, formData.ind,
            formData.education, formData.bloodGroup, formData.panNumber,
            formData.identificationMarks, formData.policeVerificationNo, formData.policeVerificationDate,
            formData.marriageDoPtII, formData.kindredRollDoPtII, formData.bankAccountNumber,
            formData.bankName, formData.ifscCode, formData.courtCase, formData.courtName,
            formData.penalty, formData.penaltyRemarks, formData.mobileNo, formData.emailId,
            formData.uidNo, formData.macp, formData.promotion, formData.permanentAddress,
            formData.temporaryAddress, formData.discpCases, formData.discpRemarks,
            formData.probationPeriod, formData.confirmedDate, formData.ltcTaDa,
            formData.toaSosInMceme, formData.payLevel, formData.basicPay,formData.cat, formData.audit,
            formData.dateofaudit
        ];

        // Execute query to insert the employee
        const employeeResult = await pool.query(employeeQuery, employeeValues);

        const gpfPran = employeeResult.rows[0].gpf_pran; // Get the inserted employee's GPF PRAN (or primary key)

        // Handle related data (e.g. promotions, postings, probations, family members) here...
        for (const probation of formData.probations) {
            const probationQuery = `
                INSERT INTO probations (gpf_pran, year, date)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'))
            `;
            const probationValues = [gpfPran, probation.year, probation.date];
            await pool.query(probationQuery, probationValues);
        }

        // Insert Promotions
        for (const promotion of formData.promotions) {
            const promotionQuery = `
                INSERT INTO promotions (gpf_pran, name, date)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'))
            `;
            const promotionValues = [gpfPran, promotion.name, promotion.date];
            await pool.query(promotionQuery, promotionValues);
        }

        // Insert Postings
        for (const posting of formData.postings) {
            const postingQuery = `
                INSERT INTO postings (gpf_pran, unit, from_date, to_date)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), TO_DATE($4, 'YYYY-MM-DD'))
            `;
            const postingValues = [gpfPran, posting.unit, posting.fromDate, posting.toDate];
            await pool.query(postingQuery, postingValues);
        }

        // Insert Family Members
        for (const familyMember of formData.familyMembers) {
            const familyMemberQuery = `
                INSERT INTO family_members (gpf_pran, name, dob, relationship, category, remarks)
                VALUES ($1, $2, TO_DATE($3, 'YYYY-MM-DD'), $4, $5, $6)
            `;
            const familyMemberValues = [
                gpfPran, familyMember.name, familyMember.dob, familyMember.relationship, 
                familyMember.category, familyMember.remarks
            ];
            await pool.query(familyMemberQuery, familyMemberValues);
        }

        res.status(201).json({ message: 'Employee inserted successfully', gpfPran });

    } catch (err) {
        if (err.code === "23505") { // PostgreSQL unique constraint violation
            return res.status(400).json({ error: "Record already exists" });
          }
        console.error('Error inserting employee:', err);
        res.status(500).json({ error: 'Internal Server Error1234' });
    }
};
