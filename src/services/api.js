import axios from "axios";

const API_BASE_URL = "http://localhost:2024/minerva-service"; // Replace with your actual API base URL

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For demo purposes, let's create mock data
const mockMarkets = ["1", "2", "3", "4", "5", "6", "7", "8"];
const mockSectors = ["115", "116", "117", "118"];

// Mock API response delay
const mockDelay = () => new Promise((resolve) => setTimeout(resolve, 1000));

export const api = {
  // Markets
  getMarkets: async () => {
    try {
      const response = await apiClient.get("/minerva-ug-dashboard/markets");
      return response.data;
    } catch (error) {
      console.error("Error fetching markets:", error);
      throw error;
    }
  },

  // Sectors
  getSectors: async () => {
    try {
      // For development with mock data
      const mockSectors = ["115", "116", "117", "118"];
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { data: mockSectors };

      // TODO: Replace with actual sectors endpoint when available
      // const response = await apiClient.get('/sites');
      // return response.data;
    } catch (error) {
      console.error("Error fetching sectors:", error);
      throw error;
    }
  },

  // Sites
  getSiteData: async (market) => {
    try {
      const response = await apiClient.post("/dynamic-query-executor/sector-360/sites-mv", {
        market: market || "131",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching site data:", error);
      throw error;
    }
  },

  exportSiteDataToCSV: async (market) => {
    try {
      const response = await apiClient.post(
        "/dynamic-query-executor/sector-360/sites-mv/export",
        {
          market: market || "131",
        },
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exporting site data:", error);
      throw error;
    }
  },
};
