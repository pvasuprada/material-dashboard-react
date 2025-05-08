export const transformVPIData = (data) => {
  if (!data || !Array.isArray(data)) {
    console.warn("Invalid VPI data received:", data);
    return {
      labels: [],
      datasets: [],
    };
  }

  // Group data by sector
  const sectorGroups = data.reduce((acc, item) => {
    const sect = item.sect || "unknown";
    if (!acc[sect]) {
      acc[sect] = [];
    }
    acc[sect].push(item);
    return acc;
  }, {});

  // Get unique bandgrps for labels
  const labels = [...new Set(data.map((item) => item.bandgrp))].sort();

  // Create datasets for each sector
  const datasets = Object.entries(sectorGroups).map(([sect, items]) => {
    const sectorData = labels.map((bandgrp) => {
      const item = items.find((i) => i.bandgrp === bandgrp);
      return item ? item.computilcurr : null;
    });

    return {
      label: `Sector ${sect}`,
      data: sectorData,
      borderColor: `hsl(${parseInt(sect) * 30}, 70%, 50%)`,
      backgroundColor: `hsla(${parseInt(sect) * 30}, 70%, 50%, 0.1)`,
      tension: 0.4,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  return {
    labels,
    datasets,
  };
};
