/* inherit */
import AxisChart from "main/chart/axis/AxisChart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import option from "main/chart/option/PieOption.js";

class ColumnChart extends AxisChart {
    #oldIndex;
    #toottipHTML;

    get chartType() {
        return "column";
    }

    parseData() {
        const { data, chart } = { ...this.data };
        const { area } = { ...chart };
        console.log(data);

        const preData = this.#getPreData();
        const { max, axisMax, nameList, groupCount } = { ...preData };
        const parseChart = {};
        nameList.forEach((name) => {
            parseChart[name] = new Array(groupCount).fill(0);
        });

        data.forEach((group, groupIdx) => {
            Object.entries(group).forEach(([name, value]) => {
                parseChart[name][groupIdx] = value;
            });
        });

        const axis = this.#getAxisData(preData);

        const chartData = {
            axis
        };

        return chartData;
    }

    #getPreData() {
        const { data } = { ...this.data };

        let max = 0;
        const nameList = new Set();
        const groupCount = data.length;

        data.forEach((group) => {
            Object.entries(group).forEach(([name, value]) => {
                max = Math.max(max, value);
                nameList.add(name);
            });
        });

        const axisMax = util.CommonUtil.ceil(max, -`${max}`.length + 1);

        return { max, axisMax, nameList, groupCount };
    }

    #getAxisData(param) {
        const { chart, axis } = { ...this.data };
        const { area } = { ...chart };
        const { x, y, width: aw, height: ah } = { ...area };
        const { axisMax, nameList, groupCount } = { ...param };
        const { major, minor } = { ...axis };
        const { unit: majorUnit, count: majorCount } = { ...major };
        const w = util.CanvasUtil.getTextSize(axisMax, {});
        let { width: tw, height: th } = { ...w };
        tw += 10;
        const padding = [ah / 40, aw / 40, ah / 5, aw / 40];
        const [t, r, b, l] = [...padding];

        const startX = x + l + tw;
        const endX = x + aw - r;
        const startY = y + ah - b ;
        const endY = y + t;

        const axisY = this.#getYAxisData();

        const axisData = {
            x: [util.CanvasUtil.line([[startX, startY], [endX, startY]])],
            y: [util.CanvasUtil.line([[startX, startY], [startX, endY]])]
        };

        return axisData;
    }

    #getYAxisData(prama) {
        /**
         * x
         * start y
         * end y
         * maxValue
         */
        let unit = util.CommonUtil.find(this.data, "axis.major.unit");
        const majorLength = 5;
        console.log(unit);
    }

    draw() {
        this.#drawChart();
    }

    #drawChart() {
        const { canvas, ctx } = { ...this.mainLayer };
        this.drawTitle(ctx);
        this.#drawAxis(ctx);
    }

    #drawAxis(ctx) {
        const { axis } = { ...this.chartData };
        
        Object.values(axis).forEach((list) => {
            list.forEach((a) => {
                a.draw(ctx);
            });
        });
    }
}

export default ColumnChart;
