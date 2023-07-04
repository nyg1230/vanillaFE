import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

class BarChart extends Chart {
	#info;

	parseChartData() {
		const dataArray = this.data.map((d) => d.value || 0);
		const maxValue = Math.max.apply(null, dataArray);
		const minValue = Math.min.apply(null, dataArray);

		const data = [];
		this.data.sort((a, b) => (a.value < b.value)).forEach((d, idx) => {
			const { value } = { ...d };
			const ratio = value / maxValue;
			data.push({ ...d, ratio });
		});

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
		const ratio = 0.1;

		const x = width * ratio;
		const y = height * (1 - ratio);
		const xl = width * (1 - ratio * 2);
		const yl = height * (1 - ratio * 2);

		const { data } = { ...this.chartData };
		const xDataAxis = xl / data.length;

		let cnt = 1;
		let repeat = useAnimation ? 70 : 1;

		const fn = () => {
			this.clear();
			xAxis(x, y, xl);
			yAxis(x, y, yl);

			data.forEach((d, idx) => {
				const { ratio } = { ...d };
				const sx = (x + xDataAxis * 0.1) + (xDataAxis * idx);
				const h = yl * ratio * cnt / repeat;
				const sy = y - h;
				this.builder.ctx.fillRect(sx, sy, xDataAxis * 0.8, h)
			});

			if (++cnt > repeat) {
				window.cancelAnimationFrame(fn);
			} else {
				window.requestAnimationFrame(fn);
			}
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