import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/part2`;

const part2orderService = {
  fetchLeaveRecords: async ({ army_no,fromDate,toDate, leave_type }) => {
    try {
      const response = await axios.get(`${API_URL}/leave-records`, {
        params: { army_no,fromDate,toDate, leave_type }, //  Correct way to send query params
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
     console.log("hi")
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching leave records:", error.response?.data || error.message);
      return [];
    }
  }
}

export default part2orderService;