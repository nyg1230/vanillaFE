import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

const color = ["#EFD1C6"];
class BarChart extends Chart {
	#info;

	parseChartData() {
		const dataArray = this.data.map((d) => d.value || 0);
		let maxValue = Math.max.apply(null, dataArray);
		maxValue = util.CommonUtil.ceil(maxValue, -util.CommonUtil.length(`${maxValue}`) + 1);
		const minValue = Math.min.apply(null, dataArray);

		const data = [];
		this.data.forEach((d, idx) => {
			const { value } = { ...d };
			const ratio = value / maxValue;
			data.push({ ...d, ratio });
		});

		const chartData = {
			min: minValue,
			max: maxValue,
			major: maxValue / 5,
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
		const wRatio = 0.075;
		const hRatio = 0.13;

		const x = width * wRatio;
		const y = height * (1 - hRatio);
		const xl = width * (1 - wRatio * 2);
		const yl = height * (1 - hRatio * 2);

		const { data } = { ...this.chartData };
		const spaceRatio = 0.1;
		const xDataAxis = xl / data.length;
		const spaceWidth = xDataAxis * spaceRatio;
		const barWidth = xDataAxis * (1 - spaceRatio * 2);

		let cnt = 1;
		let repeat = useAnimation ? 50 : 1;

		const fn = () => {
			this.clear();

			data.forEach((d, idx) => {
				const { ratio } = { ...d };
				const sx = (x + spaceWidth) + (xDataAxis * idx);
				const h = yl * ratio * cnt / repeat;
				const sy = y - h;
				this.builder.rect([sx, sy], barWidth, h, "fill", { style: { fillStyle: color[0] } })
			});

			xAxis(x, y, xl);
			yAxis(x, y, yl);

			if (++cnt > repeat) {
				this.#info = {
					x, y, xl, yl, spaceRatio, xDataAxis
				}
				this.drawDataLabel();
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

	drawDataLabel() {
		const { data, max, major } = { ...this.chartData };
		const { x, y, xl, yl, spaceRatio, xDataAxis } = { ...this.#info };

		const xAxis = () => {
			data.forEach((d, idx) => {
				const { name, value, ratio } = { ...d };
				const cx = x + (2 * idx + 1) * xDataAxis / 2;
				const nSize = this.builder.getTextSize(name);
				const { width: nw, height: nh } = { ...nSize };
				const point = [cx - nw / 2, y + 20];
				const tPoint = [cx, point[1]];
				const option = {
					setting: [
						{ prop: "translate", value: tPoint },
						{ prop: "rotate", value: [Math.PI / 4]},
						{ prop: "translate", value: tPoint.map((p) => p * -1) }
					]
				}
				this.builder.text(name, point, undefined, option);

				const vText = `${value}`;
				const vSize = this.builder.getTextSize(vText);
				const { width: vw, height: vh } = { ...vSize };
				const vPoint = [cx - vw / 2, y - yl * ratio - vh];
				this.builder.text(vText, vPoint);
			});
		};

		const yAxis = () => {
			const majorStep = util.CommonUtil.ceil(max / major);
			const majorTick = yl / majorStep;
			const majorTickWidth = 5;			
			for (let idx = 0; idx <= majorStep + 1; idx++) {
				const isOver = max < major * idx;
				const text = `${isOver ? max : major * idx}`;
				const yy = isOver ? y - yl : y - (majorTick * idx);
				const points = [
					[x, yy],
					[x - majorTickWidth, yy]
				];
				this.builder.lines(points);

				const fSize = this.builder.getTextSize(text);
				const { width: fw, height: fh } = { ...fSize };
				const textPoint = [x - majorTickWidth - fw - 2, yy + fh / 2];
				this.builder.text(text, textPoint);

				if (isOver) break;
			}
		};

		xAxis();
		yAxis();
	}

	setTooltipContent(e, x, y) {
		// console.log(e, x, y)
	}
}

export default BarChart;