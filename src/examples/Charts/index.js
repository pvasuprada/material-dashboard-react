import ReportsBarChart from "./BarCharts/ReportsBarChart";
import ReportsLineChart from "./LineCharts/ReportsLineChart";
import BubbleChart from "./BubbleChart/index";
import DoughnutChart from "./DoughnutCharts/DefaultDoughnutChart/index";
import PieChart from "./PieChart/index";
import VerticalBarChart from "./BarCharts/VerticalBarChart/index";
import ProgressLineChart from "./LineCharts/ProgressLineChart/index";
import GradientLineChart from "./LineCharts/GradientLineChart/index";
import MixedChart from "./MixedChart/index";
import PolarChart from "./PolarChart/index";
import RadarChart from "./RadarChart/index";

export const ChartComponents = {
  bar: ReportsBarChart,
  line: ReportsLineChart,
  bubble: BubbleChart,
  doughnut: DoughnutChart,
  pie: PieChart,
  verticalBar: VerticalBarChart,
  progressLine: ProgressLineChart,
  gradientLine: GradientLineChart,
  mixed: MixedChart,
  polar: PolarChart,
  radar: RadarChart,
};
