import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/attendance`;

const attendanceService = {
  faculties: async () => {
    try {
      const response = await axios.get(`${API_URL}/faculties`, {
        withCredentials: true, // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Return parsed response
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return []; 
    }
  },
  getAttendance: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAttendance`, {
        withCredentials: true, // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Return parsed response
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return []; 
    }
  },
  getMembers: async () => {
    try {
      const response = await axios.get(`${API_URL}/getMembers`, {
        withCredentials: true, // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Return parsed response
    } catch (error) {
      console.error("Error fetching faculties:", error);
      return []; 
    }
  },
  getData: async (userFaculty) => {
    try {
      const response = await axios.get(`${API_URL}/getData/${userFaculty}`, {
        withCredentials: true, // Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Return parsed response
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; 
    }
  },
  submitAttendance: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/submit`, formData, {
        withCredentials: true, // ✅ Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // ✅ Return parsed response
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create employee"); // ✅ Improved error handling
    }
  },
  checkAttendanceExists: async (selectedFac) => {
    try {
      const response = await axios.get(`${API_URL}/check`, {
        params: { faculty: selectedFac }, // ✅ Use params for GET request
        withCredentials: true, // ✅ Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // ✅ Return parsed response
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to check attendance"); // ✅ Improved error handling
    }
  }
  
};

export default attendanceService;
