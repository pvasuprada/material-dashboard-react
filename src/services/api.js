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

  // Get Population WMS Layer
  getPopulationWmsLayer: async (params) => {
    try {
      const response = await apiClient.post("layers/mv-extent", params);
      return response.data.layersResponse;
    } catch (error) {
      console.error("Error fetching population WMS layer:", error);
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
        trafficType: params.trafficType,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sectors:", error);
      throw error;
    }
  },

  // Sites
  getSiteData: async (params) => {
    try {
      const response = await apiClient.post("/dynamic-query-executor/sector-360/sites-mv", {
        market: params?.market_id?.value,
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
        sect_id: params?.sector?.value || "104",
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
        sect_id: params?.sector?.value || "104",
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
      const response = await apiClient.post("/ntwgenie/tools", {
        message: message,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },

  getRawCoverageCapacityData: async (params) => {
    try {
      const response = await apiClient.post("/raw-coverage", {
        gnbId: params?.gnodeb,
        sector: params?.sector,
        fuze_site_id: params?.fuze_site_id,
        band: "Bn77",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching coverage capacity data:", error);
      throw error;
    }
  },

  getInterpolationData: async (params) => {
    try {
      const response = await apiClient.post("/interpolation", {
        market_id: params?.market_id || "131",
        gnb_id: params?.gnodeb,
        sector: params?.sector || "104",
        lat: params?.lat || 37.7749,
        lon: params?.lon || -122.4194,
        azimuth_deg: params?.azimuth_deg || 0,
        beamwidth: params?.beamwidth || 120,
        cell_radius_km: params?.cell_radius_km || 10,
        resolution: 0,
        date_range: params?.date_range || "2024-12-27;2025-01-08",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching coverage capacity data:", error);
      throw error;
    }
  },

  getPops: async () => {
    try {
      const response = await apiClient.post("/pops");
      return response.data;
    } catch (error) {
      console.error("Error fetching pops data:", error);
      throw error;
    }
  },

  getTruecallData: async (params) => {
    try {
      const response = await apiClient.post("/dynamic_truecall_data", {
        market: params?.market || "138",
        gnodeb: params?.gnodeb || "138242",
        kpiname: params?.kpi_name || "rec_cnt",
        startdate: params?.startdate,
        enddate: params?.enddate,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching truecall data:", error);
      throw error;
    }
  },

  getVPIData: async () => {
    console.log("Starting VPI data fetch...");
    try {
      // For testing, return sample data
      const sampleData = [
        { sect: 1, bandgrp: "SUB1", computilcurr: 45.5 },
        { sect: 1, bandgrp: "SUB3", computilcurr: 62.3 },
        { sect: 1, bandgrp: "MB", computilcurr: 78.1 },
        { sect: 2, bandgrp: "SUB1", computilcurr: 55.2 },
        { sect: 2, bandgrp: "SUB3", computilcurr: 68.9 },
        { sect: 2, bandgrp: "MB", computilcurr: 82.4 },
        { sect: 3, bandgrp: "SUB1", computilcurr: 48.7 },
        { sect: 3, bandgrp: "SUB3", computilcurr: 65.1 },
        { sect: 3, bandgrp: "MB", computilcurr: 79.8 },
      ];

      console.log("Sample VPI data:", sampleData);
      return sampleData;
    } catch (error) {
      console.error("Error in getVPIData:", error);
      throw error;
    }
  },

  getNQESScores: async (params) => {
    console.log("Getting nQES scores with params:", params);
    try {
      // Sample data generator based on KPI name
      const generateSampleData = (kpiName) => {
        const dates = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"];
        let baseValue;

        // Set base value based on KPI type
        switch (kpiName) {
          case "gnb_du_sect_carr_score":
            baseValue = 4; // Good range
            break;
          case "gnb_du_sect_carr_subscore_5g":
            baseValue = 5; // Very good range
            break;
          case "gnb_du_sect_carr_subscore_capacity":
            baseValue = 6; // Bad range
            break;
          case "gnb_du_sect_carr_subscore_ethernet_backhaul":
            baseValue = 8; // Very good range
            break;
          case "gnb_du_sect_carr_subscore_reliability":
            baseValue = 8.5; // Excellent range
            break;
          default:
            baseValue = 7.0; // Good range
        }

        // Generate data points with smaller variations to stay within ranges
        return dates.map((date) => ({
          rpt_dt: date,
          score_name: kpiName,
          score_value: Math.min(10, Math.max(1, baseValue + (Math.random() * 0.4 - 0.2))), // Add random variation of ±0.2, clamped between 1 and 10
        }));
      };

      // Generate data only for the requested KPI
      const sampleData = {
        data: generateSampleData(params.kpiName),
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Returning sample nQES data for KPI:", params.kpiName, sampleData);
      return sampleData;

      // Original API call code commented out
      /*const response = await apiClient.post("/nqes-scores-analysis", {
        market: params?.market || "0",
        gnbId: params?.gnbId || "00000001",
        sector: params?.sector || "1",
        carrier: params?.carrier || "1",
        startDate: params?.startDate,
        endDate: params?.endDate,
        kpiName: params?.kpiName || "gnb_du_sect_carr",
      });
      return response.data;*/
    } catch (error) {
      console.error("Error fetching nQES scores:", error);
      throw error;
    }
  },
};

export default api;
