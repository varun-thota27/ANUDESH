import axios from "axios";

const API_URL = "http://localhost:5000/leave";

const leaveService = {
  fetchEmployees : async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-employees`,{
        withCredentials: true, // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  },
  submitForm : async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/submit-form`,formData,{
        withCredentials: true, // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw new Error("Form submission failed");
    }
  },
  getRequests : async() => {
    try {
      const response = await axios.get(`${API_URL}/getRequests`,{
        withCredentials: true, //  Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  },
  fetchAtAdmin : async() => {
    try {
      const response = await axios.get(`${API_URL}/fetch-at-admin`,{
        withCredentials: true, //  Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  },
  getDataAtAdmin : async(army_no) => {
    try {
      const response = await axios.get(`${API_URL}/get-data-at-admin/${army_no}`,{
        withCredentials: true, //  Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  },
  updateDetails: async (id, decision) => {
    try {
      const response = await axios.post(
        `${API_URL}/update-details/${id}`,
        { decision }, //  Send decision in the request body
        {
          withCredentials: true, //  Ensure cookies (JWT) are sent
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("HTTP Request Failed:", error.response ? error.response.data : error);
      throw error; // Always throw error to handle it properly in the caller function
    }
  },
  fetchRecords: async ({ army_no,fromDate,toDate, leave_type }) => {
    try {
      const response = await axios.get(`${API_URL}/leave-records`, {
        params: { army_no,fromDate,toDate, leave_type }, //  Correct way to send query params
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching leave records:", error.response?.data || error.message);
      return [];
    }
  }  
  
}

export default leaveService;