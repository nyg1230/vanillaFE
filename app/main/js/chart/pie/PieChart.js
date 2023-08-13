/* inherit */
import Chart from "main/chart/base/Chart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import option from "main/chart/option/PieOption.js";

class PieChart extends Chart {
    get option() {
        return option;
    }

    parseData() {
        const { data, chart, dataLabel, palette } = { ...this.data };
        const { startDegree } = { ...chart };
        const { style: dataLabelStyle } = { ...dataLabel };
        const total = Object.values(data).reduce((acc, val) => acc += val, 0);
        
        const [x, y, r] = this.#getXYR();

        const startRadian = this.#toRadian(startDegree);
        const parseChart = [];
        const parseDataLabel = [];
        let currentRadian = startRadian;
        console.log(currentRadian);
        Object.entries(data).forEach(([name, value]) => {
            const ratio = value / total;
            const angle = Math.PI * 2 * ratio;
            const endRadian = currentRadian + angle;
            // 파이 조각 하나
            const arc = util.CanvasUtil.arc(x, y, r, currentRadian, endRadian);
            parseChart.push(arc);

            // 데이터 라벨
            const d = { name, value, ratio };
            const text = this.#getDataLabelText(d);
            const centerRadian = currentRadian + (endRadian - currentRadian) / 2;
            const rr = r + 5;
            const tx = Math.cos(centerRadian) * rr + x;
            const ty = Math.sin(centerRadian) * rr + y;
            const dlPosition = this.#getDataLabelPosition(centerRadian - startRadian);
            const dlOption = { position: dlPosition };
            const dl = util.CanvasUtil.text(tx, ty, text, { style: dataLabelStyle, option: dlOption });
            parseDataLabel.push(dl);

            currentRadian = endRadian;
        });
        
        const chartData = {
            chart: parseChart,
            dataLabel: parseDataLabel
        };

        console.log(chartData);

        return chartData;
    }

    #getXYR() {
        const { chart } = { ...this.data };
        const { area, scale } = { ...chart };
        const { x, y, width, height } = { ...area };

        const centerX = width / 2 + x;
        const centerY = height / 2 + y;
        const r = Math.min(width, height) / 2 * scale / 100;

        return [centerX, centerY, r];
    }

    #toRadian(degree) {
        const dg = util.CommonUtil.modulo(degree, 360);
        let radian = dg / 180 * Math.PI;
        radian = radian < Math.PI ? radian : radian - 2 * Math.PI;
        return radian;
    }

    #toDegree(radian) {
        return radian / Math.PI * 180;
    }

    #getDataLabelText(data) {
        return util.CommonUtil.find(data, "name");
    }

    #getDataLabelPosition(radian) {
        let degree = this.#toDegree(radian);
        degree = util.CommonUtil.modulo(degree, 360);

        let position;
        if (degree > 270) {
            position = "lt";
        } else if (degree > 180) {
            position = "lb";
        } else if (degree > 90) {
            position = "rb";
        } else {
            position = "rt";
        }

        return position;
    }

    draw() {
        this.#draw();
    }

    #draw() {
        const { chart, dataLabel } = { ...this.chartData };
        const { ctx } = { ...this.mainLayer };

        chart.forEach((c) => {
            c.draw(ctx, 0.95);
        });

        dataLabel.forEach((dl) => {
            dl.draw(ctx);
        });
    }
}

export default PieChart;
