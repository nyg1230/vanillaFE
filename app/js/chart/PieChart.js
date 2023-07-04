import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

const color = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#000080", "#6A0DAD"];
class PieChart extends Chart {
    #info;
	#option = {
		useLegend: false,
		useTooltip: true
	}

    get startAngle() {
        return -Math.PI / 2;
    }

    parseChartData() {
        const totalCount = this.data.reduce((acc, val) => acc += Number(val.value), 0);
        const data = [];
        let tmpAngle = this.startAngle;
        this.data.sort((a, b) => (a.value < b.value)).forEach((d, idx) => {
            const { name, value } = { ...d };
            const ratio = util.CommonUtil.round(value / totalCount, 5);
            const stAngle = tmpAngle;
            const angle = Math.PI * 2 * ratio;
            tmpAngle = stAngle + angle;
            const tmp = {
                name: name,
                value: value,
                ratio: ratio,
                st: stAngle,
                ag: angle,
                degree: {
                    st: (stAngle - this.startAngle) * 180 / Math.PI,
                    ed: (stAngle + angle - this.startAngle) * 180 / Math.PI
                },
                index: idx
            };
            data.push(tmp);
        });

        const chartData = {
            total: totalCount,
            data: data
        };

        return chartData;
    }

    draw() {
        this.drawChart();
    }

    drawChart(useAnimation = true, option) {
        this.clear();

        const { data } = { ...this.chartData };
        const { pie, label } = { ...option };
        const { all: commonPieOption } = { ...pie };

        const canvasRect = util.StyleUtil.getBoundingClientRect(this.builder.canvas);
        const { width, height } = canvasRect;
        const _width = width;
        let size = _width > height ? height : _width;
        size = size / 2 * 0.9;
        const point = [_width / 2, height / 2];

        let cnt = 1;
        let repeat = useAnimation ? 70 : 1;

        const fn = () => {
            this.clear();
            data.forEach((d, idx) => {
                const { st, ag } = { ...d };
                const _pieOption = util.CommonUtil.find(pie, `${idx}`);
				const { mag = 1, ...pieOption } = { ..._pieOption };
                const opt = { ...commonPieOption, ...pieOption };
                this.builder.arc(point, size * mag, [st, st + ag * cnt / repeat], "fill", { style: { fillStyle: color[idx], ...opt } });
            });

            if (++cnt > repeat) {
                const [x, y] = [...point];
                this.#info = { x: x, y: y, r: size };
                this.drawDataLabel(data, label);
                window.cancelAnimationFrame(fn);
            } else {
                window.requestAnimationFrame(fn);
            }
        }

        window.requestAnimationFrame(fn);
    }

    drawDataLabel(data = [], option) {
        const { x, y, r } = { ...this.#info };
        const { all } = { ...option };

        data.forEach((d, idx) => {
            const { name, value, ratio, st, ag } = { ...d };

            if (ratio < 0.05) return;

            const labelOption = util.CommonUtil.find(option, `${idx}`);
            const opt = { ...all, ...labelOption };

            const text = this.getDataLabelText(d);
            const fSize = this.builder.getTextSize(text, opt);
            const { width: fw, height: fh } = { ...fSize };

            const tmp = st + ag / 2;
            const tx = Math.cos(tmp) * r * 0.7 + x - (fw / 2);
            const ty = Math.sin(tmp) * r * 0.7 + y - (fh / 2);
            
            this.builder.text(text, [tx, ty], "stroke", opt);
        });
    }

    getDataLabelText(data) {
        const { name, value, ratio = 0} = { ...data };
        return `${name}`;
    }

    drawPiece(data, option) {
        const { x, y, r } = { ...this.#info };
        const { index, st, ag } = { ...data };
        const point = [x, y];

        const text = this.getDataLabelText(data);
        const fSize = this.builder.getTextSize(text);
        const { width: fw, height: fh } = { ...fSize };

        const tmp = st + ag / 2;
        const tx = Math.cos(tmp) * r * 0.7 + x - (fw / 2);
        const ty = Math.sin(tmp) * r * 0.7 + y - (fh / 2);

        this.builder.arc(point, r, [st, st + ag], "fill", { fillStyle: color[index], ...option });
        this.builder.text(text, [tx, ty]);
    }

    drawDataLegend() {
        const canvas = this.builder.canvas;
        const height = canvas.height;
        const width = canvas.width;

        const x = width * 0.8;
        this.builder.lines([
            [x, 0],
            [x, height]
        ], "stroke", { strokeStyle: "black"} );
    }

    setTooltipContent(e, x, y) {
        let html;

        if (this.checkInPie(x, y)) {
            const data = this.#getTooltipData(x, y);
            const { name, value, ratio, index } = { ...data };
            const { name: oName } = { ...this._old };
            const percentage = (ratio * 100).toFixed(1);

            html = `<div>
                        <span>${name}</span>
                        <span>${value}</span>
                        <span>${percentage}%</span>
                    </div>`;
            
            if (name !== oName) {
                const option = {
                    pie : {
                        [`${index}`]: {
                            fillStyle: `rgba(${util.StyleUtil.getHexColorToDecimal(color[index])}, 0.6)`,
							mag: 1.05
                        }
                    }
                };
                this.drawChart(false, option);
                this._old = data;
            }
        } else {
            if (this._old) {
                this.drawChart(false);
                this._old = null;
            }
        }
        

        return html
    }

    checkInPie(x, y) {
        const { x: _x, y: _y, r } = { ...this.#info };
        const gapX = Math.abs(x - _x);
        const gapY = Math.abs(y - _y);

        let result = false;
        if (gapX + gapY <= r) {
            result = true;
        } else if (gapX > r || gapY > r) {
        } else if (gapX ** 2 + gapY ** 2 <= r ** 2) {
            result = true;
        }

        return result;
    }

    
    #getTooltipData(x, y) {
        const degree = this.#getDegree(x, y);
        const { data: _data } = { ...this.chartData };
        const data = _data.find((d) => {
            const { degree: { st, ed } } = { ...d };
            return st <= degree && degree < ed;
        });

        return data;
    }

    #getDegree(x, y) {
        const { x: _x, y: _y } = { ...this.#info };
        const radian = (Math.atan2(y - _y, x - _x) - this.startAngle) * 180 / Math.PI;
        return radian < 0 ? radian + 360 : radian;
    }
}

export default PieChart;