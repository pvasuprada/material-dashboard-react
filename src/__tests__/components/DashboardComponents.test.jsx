import { render, screen } from "@testing-library/react";
import { mockData } from "../mockData";

// Import components from their correct paths
import StatisticsCard from "../../components/StatisticsCard";
import ChartComponent from "../../components/ChartComponent";
import FiltersComponent from "../../components/FiltersComponent";
import MapComponent from "../../components/MapComponent";
import GridComponent from "../../components/GridComponent";

describe("Statistics Card Component", () => {
  test("renders statistics card with correct data", () => {
    const statData = mockData.statistics[0];
    render(<StatisticsCard {...statData} />);

    expect(screen.getByText(statData.title)).toBeInTheDocument();
    expect(screen.getByText(statData.count.toString())).toBeInTheDocument();
    expect(screen.getByText(statData.percentage.amount)).toBeInTheDocument();
  });
});

describe("Chart Component", () => {
  test("renders chart with correct data", () => {
    const chartData = mockData.charts;
    render(<ChartComponent data={chartData} />);

    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    // Add more specific chart assertions
  });
});

describe("Filters Component", () => {
  test("renders all filter options", () => {
    render(<FiltersComponent />);
    expect(screen.getByTestId("filters-section")).toBeInTheDocument();
    // Add specific filter assertions
  });
});

describe("Map Component", () => {
  test("renders map with correct markers", () => {
    const mapData = mockData.gridData;
    render(<MapComponent data={mapData} />);

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    // Add specific map assertions
  });
});

describe("Grid Component", () => {
  test("renders grid with correct data", () => {
    render(<GridComponent data={mockData.gridData} />);

    expect(screen.getByTestId("grid-container")).toBeInTheDocument();
    mockData.gridData.forEach((row) => {
      expect(screen.getByText(row.nwfid)).toBeInTheDocument();
      expect(screen.getByText(row.sitetype)).toBeInTheDocument();
    });
  });
});
