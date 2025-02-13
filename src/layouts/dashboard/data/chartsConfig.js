export const getChartsConfig = (chartData = [], xData = []) => ({
  charts: [
    {
      type: "line",
      color: "dark",
      title: "User Count",
      visible: true,
      showLabels: false,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "User count over time",
        date: "updated daily",
        labels: xData,
        datasets: {
          label: "Users",
          data: chartData.find((chart) => chart.categoryName === "Users Count")?.data || [],
        },
      },
    },
    {
      type: "line",
      color: "error",
      title: "Avg DL Latency",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Average download latency",
        date: "updated daily",
        labels: xData,
        datasets: {
          label: "Latency",
          data: chartData.find((chart) => chart.categoryName === "DL")?.data || [],
        },
      },
    },
    {
      type: "line",
      color: "dark",
      title: "Total DL Volume",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Download volume over time",
        date: "updated daily",
        labels: xData,
        datasets: {
          label: "Volume",
          data: chartData.find((chart) => chart.name === "Total DL Volume")?.data || [],
        },
      },
    },
    {
      type: "line",
      color: "error",
      title: "Total UL Volume",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Upload volume over time",
        date: "updated daily",
        labels: xData,
        datasets: {
          label: "Volume",
          data: chartData.find((chart) => chart.name === "Total UL Volume")?.data || [],
        },
      },
    },
    {
      type: "doughnut",
      color: "dark",
      title: "Traffic Sources",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Last month traffic sources",
        date: "updated yesterday",
        labels: ["Direct", "Organic", "Referral", "Social"],
        datasets: {
          label: "Traffic",
          data: [40, 30, 20, 10],
          backgroundColors: ["info", "primary", "dark", "secondary"],
        },
      },
      height: "10rem",
    },
    {
      type: "bubble",
      color: "light",
      title: "User Engagement",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "User activity metrics",
        date: "updated daily",
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
      color: "dark",
      title: "Project Completion",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Project progress tracking",
        date: "updated hourly",
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
      color: "dark",
      title: "Monthly Revenue",
      visible: true,
      showLabels: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Monthly revenue breakdown",
        date: "updated monthly",
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
  ],
});
