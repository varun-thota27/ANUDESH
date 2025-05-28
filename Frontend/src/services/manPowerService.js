import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/man-power`;

const manPowerService = {
  fetchCategory: async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-category`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      return [];
    }
  },
  fetchCategoryWing: async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-category-wing`,{
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category_wing:", error);
      return [];
    }
  },
  fetchNonIndCentral: async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-non-ind-central`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  },
  fetchNonIndUnit: async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-non-ind-unit`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  },
  fetchIndUnit: async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-ind-unit`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  },
  fetchFireStaff: async () => {
    try {
      const response = await axios.get(`${API_URL}/fetch-fire-staff`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
      return response.data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  },
  tradeInfo: async (category, faculty) => {
    try {
      const response = await axios.get(`${API_URL}/trade-info`, {
        params: { category, faculty }, // Pass parameters as query params
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  },
};

export default manPowerService;
