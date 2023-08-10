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
            axis: {
                major: {
                    unit: 1333
                },
                minor: {
                    use: true,
                    unit: -1
                }
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

        const preParseData = this.#getPreParseData(data);
        const parseAxisData = this.#parseAxis(preParseData);
        console.log(preParseData);
        console.log(parseAxisData);

        if (type === "vertical") {
            Object.entries(preParseData.data).forEach(([name, list]) => {
                list.forEach((d) => {
                    console.log(d);
                })
            });
        } else {

        }
        
        const chartData = {
            axis: parseAxisData
            // data: parseData,
            // min,
            // max,
            // dataLength,
            // total
        };

        console.log(chartData);
        return chartData
    }

    #parseAxis(preData) {
        const { chart, axis, styles } = { ...this.option };
        const { major, minor } = { ...axis };
        const { xAxis: xAxisStyles, yAxis: yAxisStyles } = { ...styles };
        const { type } = { ...chart };
        const { width, height } = this.rect;
        const { data, axisMax, maxNameWidth, maxValueWidth } = { ...preData };
        const isVertical = type === "vertical";

        let lPad = 10;
        lPad += isVertical ? maxValueWidth : maxNameWidth;

        const padding = [width / 20, width / 20, width / 10, lPad];
        const [t, r, b, l] = [...padding];

        const xAxisY = height - b;
        const axisX = util.CanvasUtil.line([[l, xAxisY], [width - r, xAxisY]]);
        const lenX = width - r - l;
        const yAxisX = l;
        const axisY = util.CanvasUtil.line([[yAxisX, t], [yAxisX, height - b]]);;
        const lenY = height - b - t;

        const nameList = Object.keys(data);
        const nameCount = util.CommonUtil.length(nameList);

        let { unit: majorUnit } = { ...major };
        let { use, unit: minorUnit } = { ...minor };

        if (majorUnit <= 0) {
            majorUnit = axisMax / 5;
        } else if (majorUnit > axisMax) {
            majorUnit = axisMax
        }

        const majorCount = axisMax / majorUnit;

        let datalabelX = [];
        let datalabelY = [];
        let nameOption = {}
        let valueOption = {};
        let unitX;
        let unitY
        if (isVertical) {
            unitX = lenX / nameCount;
            unitY = lenY / majorCount;
            nameOption = { option: { rotate: 45, position: "cc" } };
        } else {
            unitX = lenX / majorCount;
            unitY = lenY / nameCount;
        }

        // data axis
        for(let idx = 0; idx < majorCount + 1; idx++) {
            let value = majorUnit * idx;
            let y = xAxisY - unitY * (idx);
            
            if (value > axisMax) {
                value = axisMax;
                y = t;
            }
            const text = util.CanvasUtil.text(yAxisX - 10, y, `${value}`, valueOption)
            const line = util.CanvasUtil.line([[yAxisX, y], [yAxisX - 5, y]]);
            datalabelY.push(text, line);
        }

        // name axis
        nameList.forEach((n, idx) => {
            const x = l + (unitX * idx) + unitX / 2;
            const text = util.CanvasUtil.text(x, height - b + 15, `${n}`, nameOption);
            datalabelX.push(text);
        });

        console.log(datalabelX);
        console.log(datalabelY);

        const parseAxisData = {
            x: {
                axis: axisX,
                datalabel: datalabelX,
                unit: unitX
            },
            y: {
                axis: axisY,
                datalabel: datalabelY,
                unit: unitY
            }
        };

        return parseAxisData;
    }
    
    draw() {
        const { ctx } = { ...this.layers["graphic"] };
        this.drawAixsChart(ctx);
    }

    drawAixsChart(ctx) {
        const { axis } = { ...this.chartData };
        Object.values(axis).forEach((a) => {
            const { axis, datalabel } = { ...a };
            axis.draw(ctx);
            datalabel.forEach((dl) => {
                dl.draw(ctx);
            });
        });
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
