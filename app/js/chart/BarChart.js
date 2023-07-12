import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

class BarChart extends Chart {
	#info;

	initOption() {
		const option = {
			space: {
				l: 0.075, r: 0.025, t: 0.05, b: 0.1
			},
			tooltip: {
				use: true,
				background: "rgba(170, 170, 170, 0.3)",
				opacity: 0.8
			},
			bar: {
				all: {
					fillStyle: "#EFD1C6"
				}
			}
		};

		return option;
	}
	
    parseOption(param) {
		return param;
	}

	/**
     * 현 차트를 그리기 위한 데이터로 파싱하는 함수
     * @param {Array} data 전처리 이전 데이터
     * @returns 차트에 사용할 파싱 데이터
     */
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

	/**
     * wrapping 함수
     */
	draw() {
		this.drawChart();
	}

	/**
     * 바 차트
     * @param {Boolean} useAnimation 에니메이션 사용 여부
     * @param {Object} option 단발성으로 사용할 옵션
     */
	drawChart(useAnimation = true, option) {
		option = util.CommonUtil.shallowMerge(option, this.option);

		const { bar, space, axis, animation: { type, speed } } = { ...option };
		const { all: allBarOption } = { ...bar };
		const animation = util.AnimationUtil.getAnimation(type, speed, useAnimation);

		const canvasRect = util.StyleUtil.getBoundingClientRect(this.builder.canvas);
		const { width, height } = canvasRect;
		const { l, r, t, b } = { ...space };

		const x = width * l;
		const y = height * (1 - b);
		const xl = width * (1 - (l + r));
		const yl = height * (1 - (b + t));

		const { data } = { ...this.chartData };
		const spaceRatio = 0.1;
		const xDataAxis = xl / data.length;
		const spaceWidth = xDataAxis * spaceRatio;
		const barWidth = xDataAxis * (1 - spaceRatio * 2);

		this.#info = {
			x, y, xl, yl, spaceRatio, xDataAxis
		}

		const fn = () => {
			this.clear();
			const progressRate = animation.shift();

			data.forEach((d, idx) => {
				const { ratio } = { ...d };
				const sx = (x + spaceWidth) + (xDataAxis * idx);
				const h = yl * ratio * progressRate;
				const sy = y - h;
				const barOption = util.CommonUtil.find(bar, `${idx}`);
				const { background, ...o } = { ...barOption }
				const opt = util.CommonUtil.shallowMerge(allBarOption, o);
				if (background) {
					const bx = x + xDataAxis * idx;
					const by = y - yl;
					this.builder.rect([bx, by], xDataAxis, yl, "fill", { style: { fillStyle: background } });
				}
				this.builder.rect([sx, sy], barWidth, h, "fill", { style: { ...opt } });
			});

			xAxis(x, y, xl);
			yAxis(x, y, yl);

			this.drawDataLabel(true, progressRate);
			if (util.CommonUtil.isEmpty(animation)) {
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

		const yAxis = (x, y, l) => {
			const st = [x, y];
			const ed = [x, y - l];
			this.builder.lines([st, ed]);
		};

		window.requestAnimationFrame(fn);
	}

	/**
     * 차트의 각 바 머리 위에 데이터 라벨을 그리는 함수
     * @param {Array} data 차트를 그리기 위한 파싱이 완료된 데이터
     * @param {Object} option 추가 옵션
     */
	drawDataLabel(useAni, progressRate) {
		const { data, max, major } = { ...this.chartData };
		const { x, y, xl, yl, spaceRatio, xDataAxis } = { ...this.#info };

		const xAxis = () => {
			data.forEach((d, idx) => {
				const { name } = { ...d };
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
		const data = this.#getTooltipData(x, y);
		let html;

		if (data) {
			const { name, value, index } = { ...data };
			const { index: oIndex } = { ...this._old };
			html = `<div>
						<span>${name}</span>
						<span>${value}</span>
					</div>`;

			if (index !== oIndex) {
				const { bar, tooltip } = { ...this.option };
				const { background, opacity } = { ...tooltip };
				const commonColor = util.CommonUtil.find(bar, "all.fillStyle");
				const indexColor = util.CommonUtil.find(bar, `${index}.fillStyle`);
				const color = indexColor || commonColor;
				const option = {
					bar: {
						[index]: {
							fillStyle: `rgba(${util.StyleUtil.getHexColorToDecimal(color)}, ${opacity})`,
							background
						}
					}
				};
				this.drawChart(false, option);
				this._old = data;
			}
		} else if (this._old) {
			this.drawChart(false);
			this._old = null;
		}

		return html;
	}

	#getTooltipData(x, y) {
		let tooltipData;

		const { x: sx, y: sy, xl, yl, xDataAxis } = { ...this.#info };

		if (sx > x || sx + xl < x ) {
		} else if (sy < y || sy - yl > y) {
		} else {
			const { data } = { ...this.chartData };
			const idx = util.CommonUtil.floor((x - sx) / xDataAxis, 0);
			tooltipData = { ...data[idx], index: idx };
		}


		return tooltipData;
	}
}

export default BarChart;