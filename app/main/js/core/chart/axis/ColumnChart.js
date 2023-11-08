/* inherit */
import AxisChart from "js/core/chart/axis/AxisChart.js";
/* common */
import * as util from "js/core/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "js/core/constant/NMConstant.js";

class ColumnChart extends AxisChart {
    #oldIndex;
    #toottipHTML;
    #data = [];

    get chartType() {
        return "column";
    }

    add(data) {
        this.#data.push(data);
    }

    parseAxisChartData() {
        const preData = this.#getPreData();
        const { palette } = { ...this.data };

        const { axisData, drawArea } = this.#getAxisData(preData);
        const { chartData, tooltipData } = this.#getChartData(preData, drawArea);

        const result = {
            axis: axisData,
            chart: chartData,
            tooltip: {
                name: util.CommonUtil.find(this.data, "axis.x.tooltip.text", []),
                data: tooltipData,
                length: tooltipData.length
            },
            drawArea,
            palette
        };

        return result;
    }

    #getPreData() {
        const { data } = { ...this.data };

        let max = 0;
        let nameList = new Set();
        const groupCount = data.length;

        data.forEach((group) => {
            Object.entries(group).forEach(([name, value]) => {
                max = Math.max(max, value);
                nameList.add(name);
            });
        });
        nameList = [...nameList];

        const axisMax = util.CommonUtil.ceil(max, -`${max}`.length + 1);

        return { max, axisMax, nameList, groupCount };
    }

    #getChartData(param, area) {
        const { data, palette } = { ...this.data };
        const { axisMax, nameList, groupCount } = { ...param };
        const { x: ax, y: ay, width: aw, height: ah } = { ...area } ;

        const parseChart = {};
        nameList.forEach((name) => {
            parseChart[name] = new Array(groupCount).fill(0);
        });

        data.forEach((group, groupIdx) => {
            Object.entries(group).forEach(([name, value]) => {
                parseChart[name][groupIdx] = value;
            });
        });

        const chartData = [];
        const nameWidthTick = aw / nameList.length;
        const columnPadding = nameWidthTick * 0.1  / 2;
        const columnWidhTick = (nameWidthTick - columnPadding * 2) / groupCount;

        const tooltipData = [];
        nameList.forEach((name, nameIdx) => {
            const d = parseChart[name];
            const startX = ax + nameWidthTick * nameIdx;

            const tData = { name, value: d };
            d.forEach((v, groupIdx) => {
                const ratio = v / axisMax;
                const columnHeight = ah * ratio;
                const columnX = startX + columnPadding + columnWidhTick * groupIdx;
                const columnY = ay - columnHeight;
                const color = util.ColorUtil.getPaletteColor(palette, groupIdx);
                const param = { style: { fillStyle: color } };

                const rect = util.CanvasUtil.rect(columnX, columnY, columnWidhTick, columnHeight, param);
                chartData.push(rect);
            });

            tooltipData.push(tData);
        });

        const result = { chartData, tooltipData };

        return result;
    }

    #getAxisData(param) {
        const { chart } = { ...this.data };
        const { area } = { ...chart };
        const { x, y, width: aw, height: ah } = { ...area };
        const { axisMax, nameList } = { ...param };
        const labelParam = util.CommonUtil.find(this.data, "axis.y.label");
        const nameWidthList = nameList.map((name) => util.CanvasUtil.getTextSize(name, labelParam).width);
        const maxNameWidth = Math.max.call(null, ...nameWidthList);
        const w = util.CanvasUtil.getTextSize(axisMax, labelParam);
        let { width: tw, height: th } = { ...w };
        tw += 10;
        const padding = [ah * 0.02, aw * 0.025, maxNameWidth, aw * 0.02];
        this.a = util.CanvasUtil.rect(x, y, aw, ah);
        const [t, r, b, l] = [...padding];

        const startX = x + l + tw;
        const endX = x + aw - r;
        const startY = y + ah - b ;
        const endY = y + t;

        const axisY = this.#getYAxisData(axisMax, startX, startY, endY);
        const axisX = this.#getXAxisData(nameList, startY, startX, endX);

        const axisData = {
            x: [
                util.CanvasUtil.line([[startX, startY], [endX, startY]]),
                ...axisX
            ],
            y: [
                util.CanvasUtil.line([[startX, startY], [startX, endY]]),
                ...axisY
            ]
        };

        const drawWidth = endX - startX;
        const drawHeight = startY - endY;
        const drawArea = { x: startX, y: startY, width: drawWidth, height: drawHeight };

        return { axisData, drawArea };
    }

    #getXAxisData(list, y, startX, endX) {
        const labelParam = util.CommonUtil.find(this.data, "axis.x.label");
        const width = endX - startX;
        const widthTick = width / list.length;

        const axisData = [];
        y += 10;
        list.forEach((name, idx) => {
            const x = startX + widthTick * idx + widthTick / 2;
            const text = util.CanvasUtil.text(x, y, name, labelParam);
            axisData.push(text);
        });

        return axisData;
    }

    #getYAxisData(maxValue, x, startY, endY) {
        const height = startY - endY;
        const dataY = util.CommonUtil.find(this.data, "axis.y");
        const drawWidth = util.CommonUtil.find(this.data, "chart.area.width");
        const { label, mark } = { ...dataY };
        const { minor, major } = { ...mark };
        const { style, option } = { ...label };
        const param = { style, option };

        const axisData = [];

        // major 눈금 계산 start
        let { unit: majorUnit = -1 } = { ...major };
        if (majorUnit <= 0) {
            const pow = `${maxValue}`.length - 1;
            const refValue = 5 * 10 ** pow;
            majorUnit = maxValue < refValue ? 5 * 10 ** (pow - 1) : 10 ** pow;
        }

        const majorMtx = util.CanvasUtil.getTextSize(maxValue, param);
        const { height: majorTextHeight } = { ...majorMtx };
        const count = maxValue / majorUnit;
        const majorMarkTick = util.CommonUtil.round(height / count, 12);
        const majorMarkWidth = 5;
        const majorMarkPadding = 5
        const majorTextX = x - majorMarkWidth - majorMarkPadding;

        const len = util.CommonUtil.ceil(count);
        let textMod = util.CommonUtil.floor(majorTextHeight / (majorMarkTick / 2), 0);
        textMod = textMod === 0 ? 1 : textMod;
        for (let idx = 0; idx < len; idx++) {
            const value = majorUnit * idx;
            const y = startY - majorMarkTick * idx;
            const gapY = util.CommonUtil.round(y - endY, 12);
            
            if (
                util.CommonUtil.modulo(idx, textMod) === 0 &&
                gapY >= (majorTextHeight + 1)
            ) {
                const majorText = util.CanvasUtil.text(majorTextX, y, value, param);
                axisData.push(majorText);
            }
            const majorMark = util.CanvasUtil.line([[x, y], [x - majorMarkWidth, y]]);
            const majorLine = util.CanvasUtil.line([[x, y], [x + drawWidth, y]]);

            axisData.push(majorMark, majorLine);
        }
        
        const lastMajorText = util.CanvasUtil.text(majorTextX, endY, maxValue, param);
        const lastMajorMark = util.CanvasUtil.line([[x, endY], [x - majorMarkWidth, endY]]);
        const lastMajorLine = util.CanvasUtil.line([[x, endY], [x + drawWidth, endY]], { style: { font: "bold 24px auto" } });
        axisData.push(lastMajorText, lastMajorMark, lastMajorLine);
        // major 눈금 계산 end

        // minor 눈금 계산 start
        let { use: minorUse, unit: minorUnit = -1 } = { ...minor };
        if (minorUse) {
            minorUnit = minorUnit > 0 ? minorUnit : majorUnit / 5;
            const multipie = minorUnit > 0 ? majorUnit / minorUnit : 5;
            const minorMarkTick = util.CommonUtil.round(majorMarkTick / multipie, 12);
            const minorMarkWidth = majorMarkWidth * 0.6;

            const minorMarkEndX = x - minorMarkWidth;
            for (let idx = 1;;idx++) {
                const minorValue = minorUnit * idx;

                if (minorValue >= maxValue) {
                    break;
                } else if (util.CommonUtil.modulo(minorValue, majorUnit) === 0) {
                    continue;
                }

                const y = startY - minorMarkTick * idx;
                const minorMark = util.CanvasUtil.line([[x, y], [minorMarkEndX, y]]);
                axisData.push(minorMark);
            }
        }
        // minor 눈금 계산 end

        return axisData;
    }

    draw() {
        this.#drawChart();
    }

    #drawChart() {
        const { chart } = { ...this.chartData };
        const { canvas, ctx } = { ...this.mainLayer };

        const { animate, tooltip } = { ...this.data };
        const { use: animateUse, delay: _delay = 1000 } = { ...animate };
        const delay = animateUse === true ? _delay : 1;
        const aniFn = util.AnimateUtil.getFunction("speedly");

        const start = performance.now();
        const fn = (now) => {
            util.CanvasUtil.clear(canvas);
            let ratio = (now - start) / delay;
            ratio = ratio < 1 ? ratio : 1
            const progress = aniFn(ratio);

            this.#drawAxis(ctx);
            chart.forEach((c) => {
                c.draw(ctx, progress);
            });
            this.drawTitle(ctx);

            if (ratio < 1) {
                window.requestAnimationFrame(fn);
            } else {
                window.cancelAnimationFrame(fn);
                util.EventUtil.dispatchEvent(this.container, NMConst.eventName.CHART_DRAW_COMPLETE, { tooltip: tooltip.use });
            }
        };

        window.requestAnimationFrame(fn);
    }

    #drawAxis(ctx) {
        const { axis } = { ...this.chartData };
        
        Object.values(axis).forEach((list) => {
            list.forEach((a) => {
                a.draw(ctx);
            });
        });
    }

    /* tooltip function start */
    isContain(mx, my) {
        const { drawArea } = { ...this.chartData };
        const { x, y, width, height } = { ...drawArea };
        let result = true;
        if (mx < x || mx > x + width) {
            result = false;
        } else if (my > y || my < y - height) {
            result = false;
        }
        return result;
    }

    getDataIndex(mx, my) {
        const { drawArea, tooltip } = { ...this.chartData };
        const { length: tLength = 1 } = { ...tooltip };
        const { x, width } = { ...drawArea };
        const tick = width / tLength;
        const idx = util.CommonUtil.floor((mx - x) / tick, 0);

        return { idx, tick };
    }

    getDim(idx, tick) {
        const { drawArea } = { ...this.chartData };
        const { x, y, width, height } = { ...drawArea };

        const dimX = x + tick * idx;
        const param = {
            style: {
                fillStyle: "#000000",
                globalAlpha: 0.2
            }
        };
        const dim = util.CanvasUtil.rect(dimX, y, tick, -height, param);
        return dim;
    }

    getAxisTooltipHTML(idx) {
        const { tooltip, palette } = { ...this.chartData };
        const { data: tData, name: tName } = { ...tooltip };
        const data = tData[idx];
        const { name, value } = { ...data };

        const html = `
            <div>
                <div>${name}</div>
                ${value.map((v, idx) => {
                    const color = util.ColorUtil.getPaletteColor(palette, idx);
                    return `<div style="display: flex;">
                                <div style="margin: auto 0px; width: 10px; height: 10px; background-color: ${color};"></div>
                                <div style="margin-left: 5px;">${tName[idx] || ""}</div>
                                <div style="margin-left: 5px;">${v}</div>
                            </div>`;
                }).join("")}
            </div>
        `;

        return html;
    }
    /* tooltip function end */
}

export default ColumnChart;
