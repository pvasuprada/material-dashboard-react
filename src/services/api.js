import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request/response interceptors for debugging
if (process.env.NODE_ENV === "development") {
  apiClient.interceptors.request.use(
    (config) => {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      console.error("API Request Error:", error);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log("API Response:", {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error("API Response Error:", {
        message: error.message,
        response: error.response,
      });
      return Promise.reject(error);
    }
  );
}

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

  // GNODEBs
  getGnodebs: async () => {
    try {
      const response = await apiClient.get("/gnodebs");
      return response.data;
    } catch (error) {
      console.error("Error fetching gnodebs:", error);
      throw error;
    }
  },

  // Sectors
  getSectors: async (params) => {
    try {
      const response = await apiClient.post("/sectors", {
        nwfid: params.nwfid,
        du: params.du,
        trafficType: params.trafficType || ["FWA"]
      });
      return response.data;
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

  getChartData: async (params) => {
    try {
      const response = await apiClient.post("/time-series", {
        request_id: params?.request_id || 131,
        market_id: params?.market_id || "131",
        fuze_site_id: params?.fuze_site_id || "2214712",
        sect_id: params?.sect_id || "104",
        date_range: params?.date_range || "2024-12-27;2025-01-08",
        traffic_type: params?.traffic_type || "132.0",
        request_type: "Chart",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  },

  getMapData: async (params) => {
    try {
      const response = await apiClient.post("/dynamic-query-executor/sector-360/map", {
        request_id: params?.request_id || 131,
        market_id: params?.market_id || "131",
        fuze_site_id: params?.fuze_site_id || "2214712",
        sect_id: params?.sect_id || "104",
        date_range: params?.date_range || "2024-12-27;2025-01-08",
        traffic_type: params?.traffic_type || "132.0",
        request_type: "Chart",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  },

  getCoverageCapacityData: async (params) => {
    try {
      const response = await apiClient.post("/coverage-capacity-h3", {
        request_id: params?.request_id || 131,
        market_id: params?.market_id || "131",
        fuze_site_id: params?.fuze_site_id || "2214712",
        sect_id: params?.sect_id || "104",
        date_range: params?.date_range || "2024-12-27;2025-01-08",
        traffic_type: params?.traffic_type || "132.0",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching coverage capacity data:", error);
      throw error;
    }
  },

  getStatistics: async (params) => {
    try {
      const response = await apiClient.post("/dynamic-query-executor/sector-360/statistics", {
        request_id: params?.request_id || 131,
        market_id: params?.market_id || "131",
        fuze_site_id: params?.fuze_site_id || "2214712",
        sect_id: params?.sect_id || "104",
        date_range: params?.date_range || "2024-12-27;2025-01-08",
        traffic_type: params?.traffic_type || "132.0",
        request_type: "Chart",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  },

  // NetworkGenie Chat
  sendChatMessage: async (message) => {
    try {
      const response = await apiClient.post('/ntwgenie/tools', {
        message: message
      });
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },
};
