import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/employees`;

const employeeService = {
  emp: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/emp`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data?.error || error.message);
      throw error; // Re-throw the error so the frontend can handle it
    }
  },
  empUpdate: async (id,formData) => {
    try {
      const response = await axios.post(`${API_URL}/empUpdate/${id}`, formData, {
        withCredentials: true, // ✅ Ensures cookies (JWT) are sent
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // ✅ Return parsed response
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update employee"); // ✅ Improved error handling
    }
  }
};

export default employeeService;
