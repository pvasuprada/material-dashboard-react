import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "../components/Dashboard";

// Mock your data
const mockData = {
  statistics: [
    {
      color: "dark",
      id: "Users",
      icon: "group",
      title: "Users",
      count: 281,
      visible: false,
      percentage: {
        color: "success",
        amount: "+55%",
        label: "than lask week",
      },
    },
    // ... other statistics items
  ],
  charts: {
    chartData: [
      {
        categoryName: "Users Count",
        data: [70, 70, 70, 70, 70, 70, 70, 70, 70, 71, 80, 74],
        name: "Users Count",
        type: "area",
        unit: "Number",
        valueDecimals: 1,
      },
      // ... other chart items
    ],
    xData: [
      "01-01",
      "01-02",
      "01-03",
      "01-04",
      "01-05",
      "01-06",
      "01-07",
      "12-27",
      "12-28",
      "12-29",
      "12-30",
      "12-31",
    ],
    loading: false,
    error: null,
  },
  gridData: [
    {
      nwfid: "1000000",
      latitude: 47.9982979541504,
      longitude: -124.38262508089106,
      sitetype: "MACRO",
      sect: "2",
      azimuth: "120",
      technology: "4G",
      bandgrp: "SUB1",
      oprband: "13",
      sitename: "TIMB",
    },
    // ... other grid items
  ],
};

// Mock any API calls or data fetching functions
jest.mock("../api/dataService", () => ({
  fetchDashboardData: jest.fn(() => Promise.resolve(mockData)),
  updateDashboardData: jest.fn(() => Promise.resolve(mockData)),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // 1. Dashboard Rendering
  test("renders dashboard component successfully", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("dashboard-container")).toBeInTheDocument();
  });

  // 2. Statistics and Charts Rendering
  test("renders statistics section with correct data", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("statistics-section")).toBeInTheDocument();
    // Add specific assertions for your statistics content
  });

  test("renders charts with provided data", async () => {
    render(<Dashboard />);
    const charts = await screen.findByTestId("charts-container");
    expect(charts).toBeInTheDocument();
    // Add specific assertions for your charts
  });

  // 3. Filters Rendering
  test("renders filters with correct options", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("filters-section")).toBeInTheDocument();
    // Test specific filter options are present
    expect(screen.getByLabelText("Date Range")).toBeInTheDocument();
    // Add more filter-specific assertions
  });

  // 4. Map Rendering
  test("renders map component", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  // 5. Grid Rendering
  test("renders grid with correct data", async () => {
    render(<Dashboard />);
    const grid = await screen.findByTestId("grid-container");
    expect(grid).toBeInTheDocument();
    // Test grid headers and data are present
  });

  // 6. Apply Button Functionality
  test("updates dashboard components when apply button is clicked", async () => {
    render(<Dashboard />);

    // Simulate filter changes
    const dateFilter = screen.getByLabelText("Date Range");
    await userEvent.type(dateFilter, "2024-01-01");

    // Click apply button
    const applyButton = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyButton);

    // Wait for updates and verify changes
    await waitFor(() => {
      expect(screen.getByTestId("statistics-section")).toHaveBeenUpdated();
      expect(screen.getByTestId("charts-container")).toHaveBeenUpdated();
      expect(screen.getByTestId("grid-container")).toHaveBeenUpdated();
    });
  });

  // Error handling tests
  test("displays error message when data fetching fails", async () => {
    // Mock API failure
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.mock("../api/dataService", () => ({
      fetchDashboardData: jest.fn(() => Promise.reject(new Error("Failed to fetch"))),
    }));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
    });
  });

  // Loading state tests
  test("displays loading state while fetching data", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  // Add specific test cases for your data structure
  test("renders statistics cards with correct data", () => {
    render(<Dashboard />);

    // Check for specific statistics
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("281")).toBeInTheDocument();
    expect(screen.getByText("+55%")).toBeInTheDocument();

    // Check for icons
    expect(screen.getByTestId("stats-icon-group")).toBeInTheDocument();
  });

  test("renders charts with correct data series", async () => {
    render(<Dashboard />);

    // Check for chart series
    expect(screen.getByText("Users Count")).toBeInTheDocument();
    expect(screen.getByText("AVG DL Latency")).toBeInTheDocument();
    expect(screen.getByText("Total DL Volume")).toBeInTheDocument();
    expect(screen.getByText("Total UL Volume")).toBeInTheDocument();
  });

  test("renders grid with correct columns and data", async () => {
    render(<Dashboard />);

    // Check for grid columns
    expect(screen.getByText("NWFID")).toBeInTheDocument();
    expect(screen.getByText("Site Type")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();

    // Check for grid data
    expect(screen.getByText("1000000")).toBeInTheDocument();
    expect(screen.getByText("MACRO")).toBeInTheDocument();
    expect(screen.getByText("4G")).toBeInTheDocument();
  });
});
