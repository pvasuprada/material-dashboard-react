import axios from "axios";

const API_BASE_URL = "https://your-api-base-url.com/api"; // Replace with your actual API base URL

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
      // For development with mock data
      await mockDelay();
      return { data: mockMarkets };

      // For actual API implementation:
      // const response = await apiClient.get('/markets');
      // return response.data;
    } catch (error) {
      console.error("Error fetching markets:", error);
      throw error;
    }
  },

  // Sectors
  getSectors: async () => {
    try {
      // For development with mock data
      await mockDelay();
      return { data: mockSectors };

      // For actual API implementation:
      // const response = await apiClient.get('/sites');
      // return response.data;
    } catch (error) {
      console.error("Error fetching sectors:", error);
      throw error;
    }
  },
};
