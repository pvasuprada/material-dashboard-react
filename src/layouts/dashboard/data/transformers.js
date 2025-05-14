export const transformVPIData = (data) => {
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid VPI data received:", data);
    return {
      labels: [],
      datasets: [],
    };
  }

  // Get unique band groups and sectors
  const bandGroups = [...new Set(data.map((item) => item.bandgrp))];
  const sectors = [...new Set(data.map((item) => item.sect))].sort();

  // Map band groups to x-axis values
  const bandGroupMap = {
    SUB1: 1,
    SUB3: 2,
    MB: 3,
  };

  // Create datasets for each sector
  const datasets = sectors.map((sect) => {
    const sectorData = data.filter((item) => item.sect === sect);
    return {
      label: `Sector ${sect}`,
      data: sectorData.map((item) => ({
        x: bandGroupMap[item.bandgrp],
        y: item.computilcurr,
      })),
      backgroundColor: `hsl(${sect * 120}, 70%, 50%)`, // Different color for each sector
      borderColor: `hsl(${sect * 120}, 70%, 50%)`,
    };
  });

  return {
    labels: bandGroups,
    datasets: datasets,
  };
};
