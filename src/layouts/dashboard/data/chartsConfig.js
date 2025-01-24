export const chartsConfig = {
  charts: [
    {
      type: "bar",
      color: "info",
      title: "Website Views",
      visible: true,
      gridSize: { xs: 12, md: 6, lg: 4 },
      data: {
        description: "Last Campaign Performance",
        date: "campaign sent 2 days ago",
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: {
          label: "Views",
          data: [50, 20, 10, 22, 50, 10, 40],
        },
      },
    },
    {
      type: "line",
      color: "success",
      title: "Daily Sales",
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
  ],
};
