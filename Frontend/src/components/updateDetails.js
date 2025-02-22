import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Registration.css';
import employeeService from '../services/employeeService';
import infoService from '../services/infoService';
import NavBar from './NavBar';

const Notification = ({ message }) => {
    return (
        <div className="notification">
            {message}
        </div>
    );
};

const UpdateRegistration = ({onBack}) => {
  const { id } = useParams(); // Get ID from URL
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/employeesAll/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log("Fetched Employee Data:", data);
        setEmployeeData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

    const [notificationMessage, setNotificationMessage] = useState('');

    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        const fetchFaculties = async () => {
          try {
            const data = await infoService.dept(); // Fetch faculty list from API
            setFaculties(data);
          } catch (error) {
            console.error("Error fetching faculties:", error);
          }
        };
    
        fetchFaculties();
      }, []);


    const [trade, setTrade] = useState([]);

    useEffect(() => {
        const fetchTrades = async () => {
          try {
            const data = await infoService.trade(); // Fetch faculty list from API
            setTrade(data);
          } catch (error) {
            console.error("Error fetching faculties:", error);
          }
        };
    
        fetchTrades();
      }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePromotionAdd = () => {
        setFormData(prev => ({
            ...prev,
            promotions: [...prev.promotions, initialPromotionData]
        }));
    };

    const handlePromotionChange = (index, field, value) => {
        setFormData(prev => {
            const newPromotions = [...prev.promotions];
            newPromotions[index] = { ...newPromotions[index], [field]: value };
            return { ...prev, promotions: newPromotions };
        });
    };

    const handlePromotionDelete = (indexToDelete) => {
        setFormData(prev => ({
            ...prev,
            promotions: prev.promotions.filter((_, index) => index !== indexToDelete)
        }));
    };

    const handlePostingAdd = () => {
        setFormData(prev => ({
            ...prev,
            postings: [...prev.postings, initialPostingData]
        }));
    };

    const handlePostingChange = (index, field, value) => {
        setFormData(prev => {
            const newPostings = [...prev.postings];
            newPostings[index] = { ...newPostings[index], [field]: value };
            return { ...prev, postings: newPostings };
        });
    };

    const handlePostingDelete = (indexToDelete) => {
        setFormData(prev => ({
            ...prev,
            postings: prev.postings.filter((_, index) => index !== indexToDelete)
        }));
    };

    const handleProbationAdd = () => {
        setFormData(prev => ({
            ...prev,
            probations: [...prev.probations, initialProbationData]
        }));
    };

    const handleProbationChange = (index, field, value) => {
        setFormData(prev => {
            const newProbations = [...prev.probations];
            newProbations[index] = { ...newProbations[index], [field]: value };
            return { ...prev, probations: newProbations };
        });
    };

    const handleProbationDelete = (indexToDelete) => {
        setFormData(prev => ({
            ...prev,
            probations: prev.probations.filter((_, index) => index !== indexToDelete)
        }));
    };

    const handleFamilyMemberAdd = () => {
        setFormData(prev => ({
            ...prev,
            familyMembers: [...prev.familyMembers, initialFamilyMemberData]
        }));
    };

    const handleFamilyMemberChange = (index, field, value) => {
        setFormData(prev => {
            const newFamilyMembers = [...prev.familyMembers];
            newFamilyMembers[index] = { ...newFamilyMembers[index], [field]: value };
            return { ...prev, familyMembers: newFamilyMembers };
        });
    };

    const handleFamilyMemberDelete = (indexToDelete) => {
        setFormData(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.filter((_, index) => index !== indexToDelete)
        }));
    };

    const initialPromotionData = { name: '', date: '' };
            const initialPostingData = { unit: '', from_date: '', to_date: '' };
            const initialProbationData = { year: '', date: '' };
            const initialFamilyMemberData = { 
                name: '', 
                dob: '', 
                relationship: '',
                category: '',
                remarks: ''
            };

            const [formData, setFormData] = useState({
            command: '',
            gpf_pran: '',
            directorate: '',
            army_no: '',
            designation: '',
            faculty: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            gender: '',
            category: '',
            religion: '',
            date_of_birth: null,  // Use null for date values
            date_of_appointment: null,
            date_of_retirement: null,
            mode_of_appointment: '',
            fr56j: '',
            employee_group: '',
            ind: '',
            education: '',
            blood_group: '',
            cat: '',
            pan_number: '',
            identification_marks: '',
            police_verification_no: '',
            police_verification_date: null,
            marriage_do_ptii: '',
            kindred_roll_do_ptii: '',
            bank_account_number: '',
            bank_name: '',
            ifsc_code: '',
            court_case: false,  // Boolean instead of 'no'
            court_name: '',
            audit: false,
            date_of_audit: null,
            penalty: false,
            penalty_remarks: '',
            mobile_no: '',
            email_id: '',
            uid_no: '',
            macp: '',
            promotion: false,
            promotions: [initialPromotionData],
            permanent_address: '',
            temporary_address: '',
            discp_cases: false,
            discp_remarks: '',
            probation_period: false,
            probations: [initialProbationData],
            confirmed_date: null,
            familyMembers: [initialFamilyMemberData],
            ltc_ta_da: '',
            toa_sos_mceme: '',
            pay_level: '',
            basic_pay: '',
            postings: [initialPostingData]
            });

  
  const formatDateForInput = (dateString) => {
    if (!dateString || dateString.startsWith("-000001")) return ""; // Handle invalid dates
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // Prevent errors if date is invalid
    return date.toISOString().split("T")[0]; // Convert to "yyyy-MM-dd"
};
  // Update state when employeeData is available
  useEffect(() => {
    if (employeeData) {
        const formattedData = { ...employeeData };

        // ✅ Ensure arrays are not undefined before calling `.map()`
        formattedData.probations = employeeData.probations ?? [];
        formattedData.promotions = employeeData.promotions ?? [];
        formattedData.postings = employeeData.postings ?? [];
        formattedData.familyMembers = employeeData.familyMembers ?? [];

        // ✅ List of fields to convert to "yyyy-MM-dd"
        const dateFields = [
            "date_of_birth",
            "date_of_appointment",
            "date_of_retirement",
            "police_verification_date",
            "marriage_do_ptii",
            "confirmed_date",
            "date_of_audit"
        ];

        dateFields.forEach((field) => {
            if (formattedData[field]) {
                formattedData[field] = formatDateForInput(formattedData[field]);
            }
        });

        // ✅ Convert date fields inside nested objects (probations, promotions, postings, familyMembers)
        formattedData.probations = formattedData.probations.map((p) => ({
            ...p,
            date: formatDateForInput(p.date)
        }));

        formattedData.promotions = formattedData.promotions.map((p) => ({
            ...p,
            date: formatDateForInput(p.date)
        }));

        formattedData.postings = formattedData.postings.map((p) => ({
            ...p,
            from_date: formatDateForInput(p.from_date),
            to_date: formatDateForInput(p.to_date)
        }));

        formattedData.familyMembers = formattedData.familyMembers.map((fm) => ({
            ...fm,
            dob: formatDateForInput(fm.dob)
        }));

        setFormData(formattedData);
    }
}, [employeeData]); // Runs when employeeData updates
  
    const handleUpdate = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        const { pan_number, mobile_no, uid_no, basic_pay, email_id, bank_account_number } = formData;
        const panRegex = /^[A-Za-z0-9]{10}$/;
        const mobileRegex = /^[0-9]{10}$/;
        const uidRegex = /^[0-9]{12}$/;
        const basic_payRegex = /^[0-9]+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const accountNumberRegex = /^[0-9]{12}$/;

        if (!panRegex.test(pan_number)) {
            alert('PAN Number must be 10 alphanumeric characters.');
            return;
        }
        if (!mobileRegex.test(mobile_no)) {
            alert('Mobile Number must be 10 digits.');
            return;
        }
        if (!uidRegex.test(uid_no)) {
            alert('UID Number must be 12 digits.');
            return;
        }
        if (!basic_payRegex.test(basic_pay)) {
            alert('Basic Pay must be a number.');
            return;
        }
        if (!emailRegex.test(email_id)) {
            alert('Email ID must be a valid email address.');
            return;
        }
        if (!accountNumberRegex.test(bank_account_number)) {
            alert('Account Number must be 12 digits.');
            return;
        }

        if (
            formData.command &&
            formData.gpf_pran &&
            formData.directorate &&
            formData.army_no &&
            formData.designation &&
            formData.faculty &&
            formData.first_name &&
            formData.last_name &&
            formData.gender &&
            formData.category &&
            formData.religion &&
            formData.date_of_birth &&
            formData.date_of_appointment &&
            formData.mode_of_appointment &&
            formData.pan_number &&
            formData.mobile_no &&
            formData.uid_no &&
            formData.basic_pay
        ) {
            setNotificationMessage('Form Submitted Successfully!');
            setTimeout(() => setNotificationMessage(''), 2000); // Hide after 3 seconds
            setFormData({
                command: '',
                gpf_pran: '',
                directorate: '',
                army_no: '',
                designation: '',
                faculty: '',
                first_name: '',
                middle_name: '',
                last_name: '',
                gender: '',
                category: '',
                religion: '',
                date_of_birth: '',
                date_of_appointment: '',
                date_of_retirement: '',
                mode_of_appointment: '',
                fr56j: '',
                employee_group: '',
                ind: '',
                education: '',
                blood_group: '',
                cat: '',
                pan_number: '',
                identification_marks: '',
                police_verification_no: '',
                police_verification_date: '',
                marriage_do_ptii: '',
                kindred_roll_do_ptii: '',
                bank_account_number: '',
                bank_name: '',
                ifsc_code: '',
                court_case: 'no',
                court_name: '',
                audit: 'no',
                date_of_audit: '',
                penalty: 'no',
                penalty_remarks: '',
                mobile_no: '',
                email_id: '',
                uid_no: '',
                macp: '',
                promotion: 'no',
                promotions: [initialPromotionData],
                permanent_address: '',
                temporary_address: '',
                discp_cases: 'no',
                discp_remarks: '',
                probation_period: 'no',
                probations: [initialProbationData],
                confirmed_date: '',
                familyMembers: [initialFamilyMemberData],
                ltc_ta_da: '',
                toa_sos_mceme: '',
                pay_level: '',
                basic_pay: '',
                postings: [initialPostingData]
            });
        }

        try {
          // Call the employeeService function to submit form data
          await employeeService.empUpdate(id,formData);
          console.log('successful');
          setNotificationMessage('Form Updated Successfully!'); // Show success notification
          setTimeout(() => setNotificationMessage(''), 2000); // Hide the notification after 2 seconds
        } catch (err) {
         // console.log(err.message); // If there is an error, display it
        }
      };


    const handleretir = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // If date of appointment or date of birth is selected, calculate retirement date
    if (name === "date_of_appointment" || name === "date_of_birth") {
        if (updatedFormData.date_of_appointment && updatedFormData.date_of_birth) {
            let birthDate = new Date(updatedFormData.date_of_birth);
            let appointmentDate = new Date(updatedFormData.date_of_appointment);

            // Set retirement year to birth year + 60, but keep appointment's month and day
            let retirementYear = birthDate.getFullYear() + 60;
            let retirementDate = new Date(appointmentDate);
            retirementDate.setFullYear(retirementYear);

            updatedFormData.date_of_retirement = retirementDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        } else {
            // If either field is missing, clear retirement date
            updatedFormData.date_of_retirement = "";
        }
    }

    setFormData(updatedFormData);
};

  
    if (loading) return <p>Loading...</p>;
    if (!employeeData) return <p>No employee data found.</p>;

    return (
        <div>
            <NavBar/>
            {notificationMessage && <Notification message={notificationMessage} />}
            <div className="registration-container">
                <form  className="registration-form">
                    <h2>Employee Details</h2>

                    {/* Line 1 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Command</label>
                            <input type="text" name="command" value={formData.command} onChange={(e) => setFormData({ ...formData, command: e.target.value })} required/>
                        </div>
                        <div className="form-group">
                            <label>GPF/PRAN</label>
                            <input type="text" name="gpf_pran" value={formData.gpf_pran} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Directorate</label>
                            <input type="text" name="directorate" value={formData.directorate} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Group</label>
                            <select name="group" value={formData.employee_group} onChange={handleChange} required>
                                <option value="">Select Group</option>
                                <option value="A">A</option>
                                <option value="B(Gazetted)">B(Gazetted)</option>
                                <option value="B(Non-Gazetted)">B(Non-Gazetted)</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                    </div>

                    {/* Line 2 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Army Number</label>
                            <input type="text" name="army_no" value={formData.army_no} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <select name="designation" value={formData.designation} onChange={handleChange}>
                                <option value="">Select Designation</option>
                                    {trade.map((tra, index) => (
                                <option key={index} value={tra.trade}>
                                    {tra.trade}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Faculty</label>
                            <select name="faculty" value={formData.faculty} onChange={handleChange}>
                                <option value="">Select Faculty</option>
                                    {faculties.map((fac, index) => (
                                <option key={index} value={fac.dept_name}>
                                    {fac.dept_name}
                                </option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Ind/Non-Ind</label>
                            <select name="ind" value={formData.ind} onChange={handleChange}>
                                <option value="">Select </option>
                                <option value="Industrial">Industrial</option>
                                <option value="Non-Industrial">Non-Industrial</option>
                            </select>
                        </div>
                    </div>

                    {/* Line 3 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>
                    </div>

                    {/* Line 4 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="m">Male</option>
                                <option value="f">Female</option>
                                <option value="not-prefer">Prefer not to say</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Caste</label>
                            <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="">Select Caste</option>
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Religion</label>
                            <select name="religion" value={formData.religion} onChange={handleChange}required>
                                <option value="">Select Religion</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Christian">Christian</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Buddhist">Buddhist</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>PH</label>
                            <select name="cat" value={formData.cat} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                                </select>
                        </div>
                    </div>

                    {/* Line 5 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleretir} required/>
                        </div>
                        <div className="form-group">
                            <label>Date of Appointment</label>
                            <input type="date" name="date_of_appointment" value={formData.date_of_appointment} onChange={handleretir} required/>
                        </div>
                        <div className="form-group">
                            <label>Date of Retirement</label>
                            <input type="date" name="date_of_retirement" value={formData.date_of_retirement} onChange={handleChange}/>
                        </div>
                        
                    </div>

                    {/* New Personal Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Education</label>
                            <input type="text" name="education" value={formData.education} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Blood Group</label>
                            <select name="blood_group" value={formData.blood_group} onChange={handleChange}>
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="B+">B+</option>
                                <option value="O+">O+</option>
                                <option value="A-">A-</option>
                                <option value="B-">B-</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>PAN Number</label>
                            <input type="text" name="pan_number" value={formData.pan_number} onChange={handleChange} required/>
                        </div>
                    </div>

                    {/* Line 9 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Email ID</label>
                            <input type="email" name="email_id" value={formData.email_id} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>UID Number</label>
                            <input type="text" name="uid_no" value={formData.uid_no} onChange={handleChange} required/>
                        </div>
                    </div>
                    {/* Identification Marks */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Identification Marks</label>
                            <textarea 
                                name="identification_marks" 
                                value={formData.identification_marks} 
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                    {/* Line 12 - Addresses */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Permanent Address</label>
                            <textarea name="permanent_address" value={formData.permanent_address} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group full-width">
                            <label>Temporary Address</label>
                            <textarea name="temporary_address" value={formData.temporary_address} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    {/* Bank Details */}
                    <div className="form-section">
                        <h3>Bank Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Account Number</label>
                                <input type="text" name="bank_account_number" value={formData.bank_account_number} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>IFSC Code</label>
                                <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    {/* Line 6 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mode of Appointment</label>
                            <select name="mode_of_appointment" value={formData.mode_of_appointment} onChange={handleChange} required>
                                <option value="">Select Mode</option>
                                <option value="direct">Direct</option>
                                <option value="compassionate">compassionate</option>
                                <option value="Re-employed">Re-employed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>FR56(J)</label>
                            <input type="text" name="fr56j" value={formData.fr56j} onChange={handleChange} placeholder="If applicable" />
                        </div>
                        
                    </div>
                    {/* Verification Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Police Verification No</label>
                            <input type="text" name="police_verification_no" value={formData.police_verification_no} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Police Verification Date</label>
                            <input type="date" name="police_verification_date" value={formData.police_verification_date} onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Marriage DO Pt II</label>
                            <input type="text" name="marriage_do_ptii" value={formData.marriage_do_ptii} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Kindred Roll DO Pt II</label>
                            <input type="text" name="kindred_roll_do_ptii" value={formData.kindred_roll_do_ptii} onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Audit</label>
                            <select name="audit" value={formData.audit} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        {formData.audit === 'yes' && (
                            <div className="form-group">
                                <label>Date of Audit</label>
                                <input type="date" name="date_of_audit" value={formData.date_of_audit} onChange={handleChange} />
                            </div>
                        )}
                    </div>

                    {/* Line 7 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Court Case against GOI</label>
                            <select name="court_case" value={formData.court_case} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        {formData.court_case === 'yes' && (
                            <div className="form-group">
                                <label>Name of Court</label>
                                <input type="text" name="court_name" value={formData.court_name} onChange={handleChange} />
                            </div>
                        )}
                    </div>
                    {/* Line 13 - DISCP Cases */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>DISCP Cases</label>
                            <select name="discp_cases" value={formData.discp_cases} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        {formData.discp_cases === 'yes' && (
                            <div className="form-group full-width">
                                <label>DISCP Remarks</label>
                                <textarea name="discp_remarks" value={formData.discp_remarks} onChange={handleChange}></textarea>
                            </div>
                        )}
                    </div>
                    {/* Line 8 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Penalty</label>
                            <select name="penalty" value={formData.penalty} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        {formData.penalty === 'yes' && (
                            <div className="form-group full-width">
                                <label>Penalty Remarks</label>
                                <textarea name="penalty_remarks" value={formData.penalty_remarks} onChange={handleChange}></textarea>
                            </div>
                        )}
                    </div>


                    {/* Line 10 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>MACP</label>
                            <select name="macp" value={formData.macp} onChange={handleChange}>
                                <option value="">Select MACP</option>
                                <option value="a">1st MACP</option>
                                <option value="b">2st MACP</option>
                                <option value="c">3st MACP</option>
                            </select>
                        </div>
                    </div>

                    {/* Line 11 - Promotions */}
                    <div className="form-section">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Promotion</label>
                                <select name="promotion" value={formData.promotion} onChange={handleChange}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                        {formData.promotion === 'yes' && (
                            <div className="promotions-container">
                                {formData.promotions.map((promotion, index) => (
                                    <div key={index} className="dynamic-row">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Promotion Name</label>
                                                <input
                                                    type="text"
                                                    value={promotion.name}
                                                    onChange={(e) => handlePromotionChange(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Date of Promotion</label>
                                                <input
                                                    type="date"
                                                    value={promotion.date}
                                                    onChange={(e) => handlePromotionChange(index, 'date', e.target.value)}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                className="delete-button"
                                                onClick={() => handlePromotionDelete(index)}
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={handlePromotionAdd} className="add-button">
                                    Add Promotion
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Line 14 - Probation */}
                    <div className="form-section">
                        <h3>Probation Period</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Probation Period</label>
                                <select name="probation_period" value={formData.probation_period} onChange={handleChange}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                        {formData.probation_period === 'yes' && (
                            <div className="probation-container">
                                {formData.probations.map((probation, index) => (
                                    <div key={index} className="dynamic-row">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>{`Year ${index + 1} of Probation`}</label>
                                                <input
                                                    type="date"
                                                    value={probation.date}
                                                    onChange={(e) => handleProbationChange(index, 'date', e.target.value)}
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                className="delete-button"
                                                onClick={() => handleProbationDelete(index)}
                                                title="Delete"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={handleProbationAdd} className="add-button">
                                    Add Probation Year
                                </button>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Confirmed Date</label>
                                        <input type="date" name="confirmed_date" value={formData.confirmed_date} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Line 15 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>LTC/TA/DA</label>
                            <input type="text" name="ltc_ta_da" value={formData.ltc_ta_da} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>TOA/SOS in MCEME</label>
                            <input type="text" name="toa_sos_mceme" value={formData.toa_sos_mceme} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Pay Level</label>
                            <select name="pay_level" value={formData.pay_level || ""} onChange={handleChange}>
                                {[...Array(9)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Basic Pay</label>
                            <input type="number" name="basic_pay" value={formData.basic_pay} onChange={handleChange} required/>
                        </div>
                    </div>

                    {/* Line 16 - Postings */}
                    <div className="form-section">
                        <h3>Postings</h3>
                        {formData.postings.map((posting, index) => (
                            <div key={index} className="dynamic-row posting-row">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Unit</label>
                                        <input
                                            type="text"
                                            value={posting.unit}
                                            onChange={(e) => handlePostingChange(index, 'unit', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>From Date</label>
                                        <input
                                            type="date"
                                            value={posting.fromDate}
                                            onChange={(e) => handlePostingChange(index, 'fromDate', e.target.value)} required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>To Date</label>
                                        <input
                                            type="date"
                                            value={posting.toDate}
                                            onChange={(e) => handlePostingChange(index, 'toDate', e.target.value)} required
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        className="delete-button"
                                        onClick={() => handlePostingDelete(index)}
                                        title="Delete"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handlePostingAdd} className="add-button">
                            Add Posting
                        </button>
                    </div>

                    {/* Family Details Section */}
                    <div className="form-section">
                        <h3>Family Details</h3>
                        {formData.familyMembers.map((member, index) => (
                            <div key={index} className="family-member-container">
                                <div className="section-header">
                                    <h4>Family Member {index + 1}</h4>
                                    <div className="spacer"></div>
                                    <button 
                                        type="button" 
                                        className="delete-button"
                                        onClick={() => handleFamilyMemberDelete(index)}
                                        title="Delete"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={member.name}
                                            onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            value={member.dob}
                                            onChange={(e) => handleFamilyMemberChange(index, 'dob', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Relationship</label>
                                        <select
                                            value={member.relationship}
                                            onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                                        >
                                            <option value="">Select Relationship</option>
                                            <option value="spouse">Spouse</option>
                                            <option value="child">Child</option>
                                            <option value="parent">Parent</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={member.category}
                                            onChange={(e) => handleFamilyMemberChange(index, 'category', e.target.value)}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="general">General</option>
                                            <option value="obc">OBC</option>
                                            <option value="sc">SC</option>
                                            <option value="st">ST</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row remarks-row">
                                    <div className="form-group full-width">
                                        <label>Remarks</label>
                                        <textarea
                                            value={member.remarks}
                                            onChange={(e) => handleFamilyMemberChange(index, 'remarks', e.target.value)}
                                            rows="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleFamilyMemberAdd} className="add-button">
                            Add Family Member
                        </button>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="update-button" onClick={handleUpdate}>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateRegistration;