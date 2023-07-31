/* inherit */
import { NMChart, define } from "main/component/chart/base/NMChart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMPieChart extends NMChart {
    static get name() {
        return `nm-pie-chart`;
    }

    get clsName() {
        return NMPieChart.name;
    }
    
    get layerList() {
        window.qqq = this;
        return [`graphic`, `dataLabel`, `hover`];
    }
    
    parseOption(obj) {
        let option = {
            chart: {
                startAngle: -Math.PI / 2,
                scale: 0.9
            }
        };

        option = util.CommonUtil.shallowMerge(option, obj);

        return option;
    }

    parseData(data) {
        let entries = Object.entries(data);
        entries.sort((a, b) => a[1] < b[1]);

        const total = entries.reduce((acc, val) => acc += val[1], 0);
        const startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        console.log(startAngle);

        const list = [];
        entries.forEach((ent) => {
            const [name, value] = [...ent];
            const ratio = value / total;
            const d = { name, value, ratio }

            list.push(d);
        });

        const chartData = {
            data: list,
            total
        };
        return chartData;
    }

    draw() {
        console.log(this.chartData);
        this.#drawDataLabel();
        this.#drawPie();
    }

    #drawDataLabel() {}
    #drawPie() {}
}

define(NMPieChart);

export { NMPieChart, define };
