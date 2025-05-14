export const getChartsConfig = (chartData = [], xData = [], vpiData, isDarkMode = false) => ({
  charts: [
    {
      type: "line",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "User Count",
      visible: false,
      showLabels: false,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: xData,
        datasets: {
          label: "Users",
          data: chartData.find((chart) => chart.categoryName === "Users Count")?.data || [],
        },
      },
    },
    {
      type: "line",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "Avg DL Latency",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: xData,
        datasets: {
          label: "Latency",
          data: chartData.find((chart) => chart.categoryName === "DL")?.data || [],
        },
      },
    },
    {
      type: "line",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "Total DL Volume",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: xData,
        datasets: {
          label: "Volume",
          data: chartData.find((chart) => chart.name === "Total DL Volume")?.data || [],
        },
      },
    },
    {
      type: "line",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "Total UL Volume",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: xData,
        datasets: {
          label: "Volume",
          data: chartData.find((chart) => chart.name === "Total UL Volume")?.data || [],
        },
      },
    },
    {
      type: "doughnut",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "Traffic Sources",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: ["Direct", "Organic", "Referral", "Social"],
        datasets: {
          label: "Traffic",
          data: [40, 30, 20, 10],
          backgroundColors: ["info", "primary", "light", "secondary"],
        },
      },
      height: "10rem",
    },
    {
      type: "bubble",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "User Engagement",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"],
        datasets: [
          {
            label: "Dataset 1",
            data: [
              { x: 20, y: 30, r: 15 },
              { x: 40, y: 10, r: 10 },
              { x: 60, y: 40, r: 20 },
            ],
          },
        ],
      },
      height: "10rem",
    },
    {
      type: "progressLine",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "Project Completion",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: {
          label: "Progress",
          data: [20, 30, 35, 45, 60, 75, 90],
        },
      },
      height: "10rem",
    },
    {
      type: "bar",
      color: isDarkMode ? "dark" : "light",
      fontColor: isDarkMode ? "white" : "dark",
      title: "Monthly Revenue",
      visible: false,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [30, 45, 32, 70, 40, 85],
          },
        ],
      },
      height: "10rem",
    },
    {
      type: "scatterPlot",
      title: "Computation Utilization by Band",
      color: "white",
      visible: true,
      data: {
        datasets: [
          {
            label: "Sector 1",
            data: [
              { x: 1, y: 45 },
              { x: 2, y: 32 },
              { x: 3, y: 25 },
            ],
            color: "#1976d2", // blue
          },
          {
            label: "Sector 2",
            data: [
              { x: 1, y: 40 },
              { x: 2, y: 35 },
              { x: 3, y: 17 },
            ],
            color: "#ff9800", // orange
          },
          {
            label: "Sector 3",
            data: [
              { x: 1, y: 38 },
              { x: 2, y: 45 },
              { x: 3, y: 45 },
            ],
            color: "#4caf50", // green
          },
        ],
      },
    },
    {
      type: "multiLine",
      title: "Sales vs Orders Analysis",
      color: "white",
      visible: true,
      data: {
        labels: ["$0", "$300", "$600", "$900", "$1,200", "$1,500"],
        datasets: [
          {
            label: "Cosmetic",
            data: [
              { x: 0, y: 12 },
              { x: 300, y: 25 },
              { x: 600, y: 45 },
              { x: 900, y: 32 },
              { x: 1200, y: 19 },
            ],
            color: "#1976d2",
          },
          {
            label: "Electronics",
            data: [
              { x: 300, y: 40 },
              { x: 600, y: 17 },
              { x: 900, y: 5 },
            ],
            color: "#ff9800",
          },
          {
            label: "Garments",
            data: [
              { x: 600, y: 11 },
              { x: 900, y: 45 },
              { x: 1200, y: 45 },
            ],
            color: "#4caf50",
          },
        ],
      },
    },
  ],
});
