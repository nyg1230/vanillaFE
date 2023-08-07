/* inherit */
import { NMChart, define } from "main/component/chart/base/NMChart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";

class NMAxisChart extends NMChart {
    static get name() {
        return "nm-axis-chart";
    }

    get clsName() {
        return NMAxisChart.name;
    }

    get layerList() {
        return [`graphic`, `hover`];
    }

    parseOption(obj) {
        let option = {
            chart: {},
            styles: {
                xAsix: {
                    font: "bold 12px auto"
                },
                yAxis: {
                    font: "bold 12px auto"
                }
            },
            animate: {
                type: "normal"
            }
        };

        option = util.CommonUtil.shallowMerge(option, obj);

        return option;
    }

    parseData(data) {
        const { palertte, styels: optionStyles } = { ...this.option };
        const { chart: chartStyles } = { ...optionStyles };
        const { width, height } = this.rect;

        const { styles } = { ...this.options };
        const { yAxis: yAxisStyles } = { ...styles };
        const { ctx } = { ...this.layers["graphic"] };

        let total = 0;
        const xAxisSet = new Set();
        const len = util.CommonUtil.length(data);
        let maxTextWidth = 0;
        let min = 0;
        let max = 0;

        // 사전 작업
        data.forEach((d) => {
            Object.entries(d).forEach(([k, v]) => {
                xAxisSet.add(k);
                total += Number(v);
                const mtx = util.CanvasUtil.getTextSize(k, yAxisStyles);
                const { width } = { ...mtx };
                min = min < v ? min : v;
                max = max > v ? max : v;
                maxTextWidth = maxTextWidth > width ? maxTextWidth : width;
            });
        });

        const parseData = {};
        xAxisSet.forEach((d) => {
            parseData[d] = new Array(len).fill(0);
        });
        
        const chartData = {
            data: parseData,
            min,
            max,
            total
        };

        console.log(chartData);
    }
    
    draw() {
        this.drawAixsChart();
    }

    drawAixsChart() {
        this.drawAsisX();
        this.drawAsisY();
    }

    drawAsisX() {}
    drawAsisY() {}
}

define(NMAxisChart);

export { NMAxisChart, define };
