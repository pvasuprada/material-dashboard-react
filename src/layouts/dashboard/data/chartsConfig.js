export const getChartsConfig = (chartData = [], xData = []) => ({
  charts: [
    {
      type: "line",
      color: "info",
      title: "User Count",
      visible: true,
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
      color: "success",
      title: "Avg DL Latency",
      visible: true,
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
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Last Campaign Performance",
        date: "just updated",
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: {
          label: "Tasks",
          data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
        },
      },
    },
    // {
    //   type: "line",
    //   color: "dark",
    //   title: "Total UL Volume",
    //   visible: true,
    //   gridSize: { xs: 12, md: 6, lg: 4 },
    //   data: {
    //     description: "Last Campaign Performance",
    //     date: "just updated",
    //     labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    //     datasets: {
    //       label: "Tasks",
    //       data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    //     },
    //   },
    // },
    // {
    //   type: "doughnut",
    //   color: "warning",
    //   title: "Traffic Sources",
    //   visible: true,
    //   gridSize: { xs: 12, md: 6, lg: 4 },
    //   data: {
    //     description: "Last month traffic sources",
    //     date: "updated yesterday",
    //     labels: ["Direct", "Organic", "Referral", "Social"],
    //     datasets: {
    //       label: "Traffic",
    //       data: [40, 30, 20, 10],
    //       backgroundColors: ["info", "primary", "dark", "secondary"],
    //     },
    //   },
    // },
    // {
    //   type: "bubble",
    //   color: "dark",
    //   title: "User Engagement",
    //   visible: true,
    //   gridSize: { xs: 12, md: 6, lg: 4 },
    //   data: {
    //     description: "User activity metrics",
    //     date: "updated daily",
    //     labels: ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90"],
    //     datasets: [
    //       {
    //         label: "Dataset 1",
    //         data: [
    //           { x: 20, y: 30, r: 15 },
    //           { x: 40, y: 10, r: 10 },
    //           { x: 60, y: 40, r: 20 },
    //         ],
    //       },
    //     ],
    //   },
    // },
    // {
    //   type: "progressLine",
    //   color: "info",
    //   title: "Project Completion",
    //   visible: true,
    //   gridSize: { xs: 12, md: 6, lg: 4 },
    //   data: {
    //     description: "Project progress tracking",
    //     date: "updated hourly",
    //     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //     datasets: {
    //       label: "Progress",
    //       data: [20, 30, 35, 45, 60, 75, 90],
    //     },
    //   },
    // },
    // {
    //   type: "radar",
    //   color: "success",
    //   title: "Skill Distribution",
    //   visible: true,
    //   gridSize: { xs: 12, md: 6, lg: 4 },
    //   data: {
    //     description: "Team skills overview",
    //     date: "last updated 1 week ago",
    //     labels: ["Technical", "Communication", "Teamwork", "Leadership", "Innovation"],
    //     datasets: [
    //       {
    //         label: "Current",
    //         data: [65, 75, 70, 80, 60],
    //       },
    //       {
    //         label: "Target",
    //         data: [80, 80, 80, 90, 70],
    //       },
    //     ],
    //   },
    // },
  ],
});
