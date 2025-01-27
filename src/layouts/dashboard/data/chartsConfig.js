export const chartsConfig = {
  charts: [
    {
      type: "bar",
      color: "info",
      title: "User Count",
      visible: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Last Campaign Performance",
        date: "campaign sent 2 days ago",
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: [
          {
            label: "Views",
            data: [50, 20, 10, 22, 50, 10, 40],
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 4,
            maxBarThickness: 10,
          },
        ],
      },
    },
    {
      type: "line",
      color: "success",
      title: "Avg DL Latency",
      visible: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "15% increase in today sales",
        date: "updated 4 min ago",
        labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: {
          label: "Sales",
          data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
        },
      },
    },
    {
      type: "line",
      color: "dark",
      title: "Completed Tasks",
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
};
