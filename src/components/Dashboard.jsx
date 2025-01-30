// Main Dashboard component
<div data-testid="dashboard-container">
  {/* Statistics Section */}
  <div data-testid="statistics-section">
    {statistics.map((stat) => (
      <div key={stat.id} data-testid={`stat-card-${stat.id}`}>
        <span data-testid={`stats-icon-${stat.icon}`}>{stat.icon}</span>
        {/* ... rest of statistics card content */}
      </div>
    ))}
  </div>

  {/* Charts Section */}
  <div data-testid="charts-container">
    {charts.chartData.map((chart) => (
      <div key={chart.name} data-testid={`chart-${chart.name.replace(/\s+/g, "-").toLowerCase()}`}>
        {/* ... chart content */}
      </div>
    ))}
  </div>

  {/* Map Section */}
  <div data-testid="map-container">{/* ... map content */}</div>

  {/* Grid Section */}
  <div data-testid="grid-container">
    <table>
      <thead data-testid="grid-header">{/* ... grid headers */}</thead>
      <tbody data-testid="grid-body">
        {gridData.map((row) => (
          <tr key={row.nwfid} data-testid={`grid-row-${row.nwfid}`}>
            {/* ... grid row content */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Filters Section */}
  <div data-testid="filters-section">{/* ... filter content */}</div>

  {/* Loading Spinner */}
  {isLoading && <div data-testid="loading-spinner">{/* ... loading spinner content */}</div>}

  {/* Apply Button */}
  <button data-testid="apply-button" onClick={handleApply}>
    Apply
  </button>
</div>;
