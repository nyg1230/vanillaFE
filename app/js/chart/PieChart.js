import Chart from "./Chart.js";
import * as util from "../util/Utils.js";

class PieChart extends Chart {

    get startAngle() {
        return -Math.PI / 2;
    }

    parseChartData() {
        const totalCount = this.data.reduce((acc, val) => acc += Number(val.value), 0);
        const data = [];
        let tmpAngle = this.startAngle;
        this.data.sort((a, b) => (a.value < b.value)).forEach((d) => {
            const { name, value } = { ...d };
            const ratio = util.CommonUtil.round(value / totalCount, 2);
            const stAngle = tmpAngle;
            const angle = Math.PI * 2 * ratio;
            tmpAngle = stAngle + angle;
            const tmp = {
                name: name,
                value: value,
                ratio: ratio,
                st: stAngle,
                ag: angle
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
        window.qqq = this;
        window.ctx = this.builder.ctx;
        console.log(this.chartData);

        this.drawChart();
    }

    drawChart(n) {
        this.clear();

        const { data } = { ...this.chartData };

        const { width, height } = this.builder.canvas;
        const _width = width * 0.8;
        let size = _width > height ? height : _width;
        size = size / 2 * 0.9;
        const point = [_width / 2, height / 2];

        let cnt = 0;
        let repeat = 15;
        let color = ["red", "orange", "yellow", "green", "blue", "navy", "purple"];

        const fn = () => {
            this.clear();
            this.drawLabel();
            data.forEach((d, idx) => {
                const { st, ag } = { ...d };
                this.builder.arc(point, size, [st, st + ag * cnt / repeat], "fill", { fillStyle: color[idx] });
            });

            if (cnt++ > repeat) {
                createDataLabel();
                window.cancelAnimationFrame(fn);
            } else {
                window.requestAnimationFrame(fn);
            }
        }

        const createDataLabel = () => {
            data.forEach((d) => {
                const { name, value, ratio, st, ag } = { ...d };

				const text = `${name} (${value}, ${Math.floor(ratio * 100)}%)`;
				const fSize = this.builder.getTextSize(text);
				const { width: fw, height: fh } = { ...fSize };

                const [x, y] = [...point];
                const tmp = st + ag / 2;
                const tx = Math.cos(tmp) * size * 0.7 + x - (fw / 2);
                const ty = Math.sin(tmp) * size * 0.7 + y - (fh / 2);
                
                this.builder.text(text, [tx, ty]);
            });
        }

        window.requestAnimationFrame(fn);
    }

    drawPiece() {
        
    }

    drawLabel() {
        const canvas = this.builder.canvas;
        const height = canvas.height;
        const width = canvas.width;

        const x = width * 0.8;
        this.builder.lines([
            [x, 0],
            [x, height]
        ], "stroke", { strokeStyle: "black"} );
    }
}

export default PieChart;