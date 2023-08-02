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
        return [`graphic`, `hover`, `dataLabel`];
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
        let rect = this.rect;
        if (rect) {
            rect = this.getBoundingClientRect();
        }
        console.log(rect)
        const { width, height } = rect;
        let entries = Object.entries(data);
        entries.sort((a, b) => a[1] < b[1]);

        const total = entries.reduce((acc, val) => acc += val[1], 0);
        let startAngle = util.CommonUtil.find(this.option, "chart.startAngle");
        console.log(startAngle);

        const list = [];
        entries.forEach((ent) => {
            const [name, value] = [...ent];
            const ratio = value / total;
            const angle = Math.PI * 2 * ratio;
            const endAngle = startAngle + angle;
            const max = width > height ? width : height;
            const r = max / 2 * 0.9;
            const arc = util.CanvasUtil.arc(width / 2, height / 2, r, startAngle, endAngle);
            startAngle += endAngle;

            list.push(arc);
        });

        const chartData = {
            data: list,
            total
        };
        return chartData;
    }

    draw() {
        this.#drawPie();
        console.log(this.chartData);
        const { data } = { ...this.chartData };
        data.forEach((d) => {
            console.log(d);
        });
        this.#drawDataLabel();
    }

    #drawDataLabel() {}
    #drawPie() {
        
    }
}

define(NMPieChart);

export { NMPieChart, define };
