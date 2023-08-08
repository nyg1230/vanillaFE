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
            chart: {
                type: "vertical"
            },
            styles: {
                xAxis: {
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
        const { chart, palertte, styles } = { ...this.option };
        const { type } = { ...chart };
        const { chart: chartStyles } = { ...styles };
        const { width, height } = this.rect;

        const { xAxis: xAxisStyles, yAxis: yAxisStyles } = { ...styles };
        const { ctx } = { ...this.layers["graphic"] };

        const axisData = this.#getPreParseData(data);
        const { maxNameWidth, maxValueWidth } = { ...axisData };
        let lPad = 10;
        lPad += type === "vertical" ? maxValueWidth : maxNameWidth;
        console.log(lPad);

        const padding = [
            width / 10,
            width / 20,
            width / 10,
            lPad
        ];
        const [t, r, b, l] = [...padding];

        const xAxisY = height - b;
        const axisX = util.CanvasUtil.line([[l, xAxisY, xAxisStyles], [width - r, xAxisY, xAxisStyles]]);
        const yAxisX = l;
        const axisY = util.CanvasUtil.line([[yAxisX, t, xAxisStyles], [yAxisX, height - b, xAxisStyles]]);;
        const axis = {
            axisX,
            axisY
        };

        if (type === "vertical") {
            Object.entries(axisData.data).forEach(([name, list]) => {
                list.forEach((d) => {
                    console.log(d);
                })
            });
        } else {

        }
        
        const chartData = {
            axis
            // data: parseData,
            // min,
            // max,
            // dataLength,
            // total
        };

        console.log(chartData);
        return chartData
    }
    
    draw() {
        const { ctx } = { ...this.layers["graphic"] };
        this.drawAixsChart(ctx);
    }

    drawAixsChart(ctx) {
        const { axis } = { ...this.chartData };
        const { axisX, axisY } = { ...axis };
        axisX.draw(ctx);
        axisY.draw(ctx);
    }

    #getPreParseData(data) {
        const { styles, chart } = { ...this.option };
        const { xAxis: xAxisStyles, yAxis: yAxisStyles } = { ...styles };
        const { type: chartType } = { ...chart };
        const [textStyles, valueStyles] = chartType === "vertical" ? [yAxisStyles, xAxisStyles] : [xAxisStyles, yAxisStyles];

        let maxNameWidth = 0;
        let min = 0;
        let max = 0;
        let total = 0;
        const dataLength = util.CommonUtil.length(data);

        const preData = {};
        data.forEach((d, idx) => {
            Object.entries(d).forEach(([k, v]) => {
                let temp;
                try {
                    temp = { value: v };
                    if (util.CommonUtil.isNull(preData[k])) throw new Error();
                } catch (e) {
                    preData[k] = new Array(dataLength).fill({ value: 0 });
                } finally {
                    preData[k][idx] = temp;
                    total += Number(v);
                    min = min < v ? min : v;
                    max = max > v ? max : v;
                    const nameMtx = util.CanvasUtil.getTextSize(k, textStyles);
                    const { width } = { ...nameMtx };
                    maxNameWidth = maxNameWidth > width ? maxNameWidth : width;
                }
            });
        });

        // 각 데이터 마다 전체값에 대한 비율값 추가
        const axisMax = util.CommonUtil.ceil(max, -util.CommonUtil.length(`${max}`) + 1);
        Object.values(preData).forEach((l) => {
            l.forEach((d) => {
                const { value } = { ...d };
                d.ratio = value / axisMax;
            });
        });

        const valueMtx = util.CanvasUtil.getTextSize(axisMax, valueStyles);
        const { width: maxValueWidth } = { ...valueMtx };

        const parseData = {
            data: preData,
            min,
            max,
            axisMax,
            maxNameWidth,
            maxValueWidth
        }

        return parseData;
    }
}

define(NMAxisChart);

export { NMAxisChart, define };
