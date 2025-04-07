import React, { useState,useEffect } from 'react';
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

const Registration = () => {
    const initialPromotionData = { name: '', date: '' };
    const initialPostingData = { unit: '', fromDate: '', toDate: '' };
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
        gpfPran: '',
        directorate: '',
        armyNo: '',
        designation: '',
        faculty: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        category: '',
        religion: '',
        dateOfBirth: '',
        dateOfAppointment: '',
        dateOfRetirement: '',
        retirement: 'no',
        retirement_type :'',
        modeOfAppointment: '',
        fr56j: '',
        group: '',
        ind: '',
        education: '',
        bloodGroup: '',
        cat: '',
        panNumber: '',
        identificationMarks: '',
        policeVerificationNo: '',
        policeVerificationDate: '',
        marriageDoPtII: '',
        kindredRollDoPtII: '',
        bankAccountNumber: '',
        bankName: '',
        ifscCode: '',
        courtCase: 'no',
        courtName: '',
        audit: 'no',
        dateofaudit: '',
        penalty: 'no',
        penaltyRemarks: '',
        mobileNo: '',
        emailId: '',
        uidNo: '',
        macp: '',
        promotion: 'no',
        promotions: [initialPromotionData],
        permanentAddress: '',
        temporaryAddress: '',
        discpCases: 'no',
        discpRemarks: '',
        probationPeriod: 'no',
        probations: [initialProbationData],
        confirmedDate: '',
        familyMembers: [initialFamilyMemberData],
        ltcTaDa: '',
        toaSosInMceme: '',
        payLevel: '',
        basicPay: '',
        postings: [initialPostingData]
    });

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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        const { panNumber, mobileNo, uidNo, basicPay, emailId, bankAccountNumber } = formData;
        const panRegex = /^[A-Za-z0-9]{10}$/;
        const mobileRegex = /^[0-9]{10}$/;
        const uidRegex = /^[0-9]{12}$/;
        const basicPayRegex = /^[0-9]+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const accountNumberRegex = /^[0-9]{11}$/;

        if (!panRegex.test(panNumber)) {
            alert('PAN Number must be 10 alphanumeric characters.');
            return;
        }
        if (!mobileRegex.test(mobileNo)) {
            alert('Mobile Number must be 10 digits.');
            return;
        }
        if (!uidRegex.test(uidNo)) {
            alert('UID Number must be 12 digits.');
            return;
        }
        if (!basicPayRegex.test(basicPay)) {
            alert('Basic Pay must be a number.');
            return;
        }
        if (!emailRegex.test(emailId)) {
            alert('Email ID must be a valid email address.');
            return;
        }
        if (!accountNumberRegex.test(bankAccountNumber)) {
            alert('Account Number must be 12 digits.');
            return;
        }

        if (
            formData.command &&
            formData.gpfPran &&
            formData.directorate &&
            formData.armyNo &&
            formData.designation &&
            formData.faculty &&
            formData.firstName &&
            formData.lastName &&
            formData.gender &&
            formData.category &&
            formData.religion &&
            formData.dateOfBirth &&
            formData.dateOfAppointment &&
            formData.modeOfAppointment &&
            formData.panNumber &&
            formData.mobileNo &&
            formData.uidNo &&
            formData.basicPay
        ) {
            
            setNotificationMessage('Form Submitted Successfully!');
            setTimeout(() => setNotificationMessage(''), 2000); // Hide after 3 seconds
            setFormData({
                command: '',
                gpfPran: '',
                directorate: '',
                armyNo: '',
                designation: '',
                faculty: '',
                firstName: '',
                middleName: '',
                lastName: '',
                gender: '',
                category: '',
                religion: '',
                dateOfBirth: '',
                dateOfAppointment: '',
                dateOfRetirement: '',
                retirement: 'no',
                retirement_type :'',
                modeOfAppointment: '',
                fr56j: '',
                group: '',
                ind: '',
                education: '',
                bloodGroup: '',
                cat: '',
                panNumber: '',
                identificationMarks: '',
                policeVerificationNo: '',
                policeVerificationDate: '',
                marriageDoPtII: '',
                kindredRollDoPtII: '',
                bankAccountNumber: '',
                bankName: '',
                ifscCode: '',
                courtCase: 'no',
                courtName: '',
                audit: 'no',
                dateofaudit: '',
                penalty: 'no',
                penaltyRemarks: '',
                mobileNo: '',
                emailId: '',
                uidNo: '',
                macp: '',
                promotion: 'no',
                promotions: [initialPromotionData],
                permanentAddress: '',
                temporaryAddress: '',
                discpCases: 'no',
                discpRemarks: '',
                probationPeriod: 'no',
                probations: [initialProbationData],
                confirmedDate: '',
                familyMembers: [initialFamilyMemberData],
                ltcTaDa: '',
                toaSosInMceme: '',
                payLevel: '',
                basicPay: '',
                postings: [initialPostingData]
            });
        }

        try {
          // Call the employeeService function to submit form data
         // console.log(formData);
          await employeeService.emp(formData);
          console.log('successful');
          setNotificationMessage('Form Submitted Successfully!'); // Show success notification
          setTimeout(() => setNotificationMessage(''), 2000);
        } catch (err) {
         // console.log(err.message); 
         console.error("Form submission failed:", err);
    setNotificationMessage(err.response?.data?.error || "Failed to submit form. Please try again.");
    setTimeout(() => setNotificationMessage(''), 3000);
        }
      };

      const handleretir = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData, [name]: value };
    
        // If date of birth is selected, calculate retirement date
        if (name === "dateOfBirth") {
            if (updatedFormData.dateOfBirth) {
                let birthDate = new Date(updatedFormData.dateOfBirth);
                let retirementDate = new Date(birthDate);
                retirementDate.setFullYear(birthDate.getFullYear() + 60);
    
                updatedFormData.dateOfRetirement = retirementDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
            } else {
                updatedFormData.dateOfRetirement = "";
            }
        }
    
        setFormData(updatedFormData);
    };    

    return (
        <div>
            <NavBar/>
            {notificationMessage && <Notification message={notificationMessage} />}
            <div className="registration-container">
                <form onSubmit={handleSubmit} className="registration-form">
                    <h2>Employee Registration Form</h2>

                    {/* Line 1 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Command</label>
                            <input type="text" name="command" value={formData.command} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>GPF/PRAN</label>
                            <input type="text" name="gpfPran" value={formData.gpfPran} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Directorate</label>
                            <input type="text" name="directorate" value={formData.directorate} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Group</label>
                            <select name="group" value={formData.group} onChange={handleChange} required>
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
                            <input type="text" name="armyNo" value={formData.armyNo} onChange={handleChange} />
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
                            <label>Category</label>
                            <select name="ind" value={formData.ind} onChange={handleChange}>
                                <option value="">Select </option>
                                <option value="Non-Ind(Centrally Controlled)">Non-Ind(Centrally Controlled)</option>
                                <option value="Non-Ind(Unit Controlled)">Non-Ind(Unit Controlled)</option>
                                <option value="Ind(Unit Controlled)">Ind(Unit Controlled)</option>
                                <option value="Fire Staff">Fire Staff</option>
                            </select>
                        </div>
                    </div>

                    {/* Line 3 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
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
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleretir} required/>
                        </div>
                        <div className="form-group">
                            <label>Date of Appointment</label>
                            <input type="date" name="dateOfAppointment" value={formData.dateOfAppointment} onChange={handleretir} required/>
                        </div>
                        <div className="form-group">
                            <label>Date of Retirement</label>
                            <input type="date" name="dateOfRetirement" value={formData.dateOfRetirement} readOnly />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Retirement</label>
                            <select name="retirement" value={formData.retirement} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        {formData.retirement === 'yes' && (
                            <div className="form-group">
                                <label>Retirement type</label>
                                <select name="retirement_type" value={formData.retirement_type} onChange={handleChange} >
                                <option value="Death">Death</option>
                                <option value="Removal from Service">Removal from Service</option>
                                <option value="Superannuation">Superannuation</option>
                                <option value="Voluntary">Voluntary</option>
                                <option value="Premature">Premature</option>
                                <option value="Medically Boarded">Medically Boarded</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* New Personal Details */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Education</label>
                            <input type="text" name="education" value={formData.education} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Blood Group</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
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
                            <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} required/>
                        </div>
                    </div>

                    {/* Line 9 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Email ID</label>
                            <input type="email" name="emailId" value={formData.emailId} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>UID Number</label>
                            <input type="text" name="uidNo" value={formData.uidNo} onChange={handleChange} required/>
                        </div>
                    </div>
                    {/* Identification Marks */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Identification Marks</label>
                            <textarea 
                                name="identificationMarks" 
                                value={formData.identificationMarks} 
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                    {/* Line 12 - Addresses */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label>Permanent Address</label>
                            <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}></textarea>
                        </div>
                        <div className="form-group full-width">
                            <label>Temporary Address</label>
                            <textarea name="temporaryAddress" value={formData.temporaryAddress} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    {/* Bank Details */}
                    <div className="form-section">
                        <h3>Bank Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Account Number</label>
                                <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>IFSC Code</label>
                                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    {/* Line 6 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Mode of Appointment</label>
                            <select name="modeOfAppointment" value={formData.modeOfAppointment} onChange={handleChange} required>
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
                            <input type="text" name="policeVerificationNo" value={formData.policeVerificationNo} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Police Verification Date</label>
                            <input type="date" name="policeVerificationDate" value={formData.policeVerificationDate} onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Marriage DO Pt II</label>
                            <input type="text" name="marriageDoPtII" value={formData.marriageDoPtII} onChange={handleChange} required/>
                        </div>
                        <div className="form-group">
                            <label>Kindred Roll DO Pt II</label>
                            <input type="text" name="kindredRollDoPtII" value={formData.kindredRollDoPtII} onChange={handleChange} required/>
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
                                <input type="date" name="dateofaudit" value={formData.dateofaudit} onChange={handleChange} />
                            </div>
                        )}
                    </div>

                    {/* Line 7 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Court Case against GOI</label>
                            <select name="courtCase" value={formData.courtCase} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                        {formData.courtCase === 'yes' && (
                            <div className="form-group">
                                <label>Name of Court</label>
                                <input type="text" name="courtName" value={formData.courtName} onChange={handleChange} />
                            </div>
                        )}
                    </div>
                    {/* Line 13 - DISCP Cases */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>DISCP Cases</label>
                            <select name="discpCases" value={formData.discpCases} onChange={handleChange}>
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        {formData.discpCases === 'yes' && (
                            <div className="form-group full-width">
                                <label>DISCP Remarks</label>
                                <textarea name="discpRemarks" value={formData.discpRemarks} onChange={handleChange}></textarea>
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
                                <textarea name="penaltyRemarks" value={formData.penaltyRemarks} onChange={handleChange}></textarea>
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
                                <select name="probationPeriod" value={formData.probationPeriod} onChange={handleChange}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>
                        {formData.probationPeriod === 'yes' && (
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
                                        <input type="date" name="confirmedDate" value={formData.confirmedDate} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Line 15 */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>LTC/TA/DA</label>
                            <input type="text" name="ltcTaDa" value={formData.ltcTaDa} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>TOA/SOS in MCEME</label>
                            <input type="text" name="toaSosInMceme" value={formData.toaSosInMceme} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Pay Level</label>
                            <select name="payLevel" value={formData.payLevel} onChange={handleChange}>
                                {[...Array(9)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Basic Pay</label>
                            <input type="number" name="basicPay" value={formData.basicPay} onChange={handleChange} required/>
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
                        <button type="submit" className="submit-button">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;