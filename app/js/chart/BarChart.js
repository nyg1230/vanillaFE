import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

class BarChart extends Chart {
	#info;

	parseChartData() {
		const dataArray = this.data.map((d) => d.value || 0);
		const maxValue = Math.max.apply(null, dataArray);
		const minValue = Math.min.apply(null, dataArray);

		const data = this.data.sort((a, b) => (a.value < b.value))

		const chartData = {
			min: minValue,
			max: maxValue,
			data: data
		};

		return chartData;
	}

	draw() {
		this.drawChart();
	}

	drawChart(useAnimation = true, option) {
		const canvasRect = util.StyleUtil.getBoundingClientRect(this.builder.canvas);
		const { width, height } = canvasRect;
		const ratio = 0.05;

		const x = width * ratio;
		const y = height * (1 - ratio);
		const xl = width * (1 - ratio * 2);
		const yl = height * (1 - ratio * 2);

		console.log(width, x, xl);
		console.log(height, y, yl);

		const fn = () => {
			this.clear();
			xAxis(x, y, xl);
			yAxis(x, y, yl);
		};

		const xAxis = (x, y, l) => {
			const st = [x, y];
			const ed = [x + l, y];
			this.builder.lines([st, ed]);
		};
		const yAxis = (x, y, ey) => {
			const st = [x, y];
			const ed = [x, height - y];
			this.builder.lines([st, ed]);
		};

		window.requestAnimationFrame(fn);
	}

	drawDataLabel() {}

	setTooltipContent(e, x, y) {}
}

export default BarChart;