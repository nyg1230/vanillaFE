/* inherit */
import Chart from "main/chart/base/Chart.js";
/* common */
import * as util from "main/util/utils.js";
/* component */
/* model */
/* constant */
import NMConst from "main/constant/NMConstant.js";
/* option */
import option from "main/chart/option/AxisOption.js";

class AxisChart extends Chart {
    #oldIndex;
    #toottipHTML;

    get chartType() {
        return "axis";
    }

    get option() {
        return option[this.chartType];
    }

    parseData() {
        this.#calculationArea();
        const chartData = this.parseAxisChartData();
        const { axis, drawArea } = { ...chartData };
        const axisTitle = this.#getAxisTitle(drawArea);
        axis.title = axisTitle;

        return chartData;
    }

    parseAxisChartData() { return []; };

    #calculationArea() {
        const area = util.CommonUtil.find(this.data, "chart.area");

        // x축 제목 영역 사전 계산
        const titleX = util.CommonUtil.find(this.data, "axis.x.title");
        const { text: textX, param: paramX } = { ...titleX };
        const mtxX = util.CanvasUtil.getTextSize(textX, paramX);
        let { height: xh } = { ...mtxX };
        xh += 2;
        area.height -= xh;

        // y축 제목 영역 사전 계산
        const titleY = util.CommonUtil.find(this.data, "axis.y.title");
        const { text: textY, param: paramY } = { ...titleY };
        const mtxY = util.CanvasUtil.getTextSize(textY, paramY);
        let { height: yh } = { ...mtxY };
        yh += 4;
        area.x += yh;
        area.width -= yh;
    }

    #getAxisTitle(area) {
        const titleX = this.#getAxisXTitle(area);
        const titleY = this.#getAxisYTitle(area);
        
        return [titleX, titleY];
    }

    #getAxisYTitle(drawArea) {
        const { axis } = { ...this.data };
        const area = util.CommonUtil.find(this.data, "chart.area");
        const { y: ay, height: ah } = { ...drawArea };
        const { x: ax } = { ...area };
        const { text, param } = { ...util.CommonUtil.find(axis, "y.title") };
        const { style } = { ...param };
        param.option = {
            position: "cc",
            rotate: -90
        }

        const mtx = util.CanvasUtil.getTextSize(text, param);
        const { height: tw } = { ...mtx };

        const x = ax - tw / 2;
        const y = ay - ah / 2;
        const titleX = util.CanvasUtil.text(x, y, text, param);

        return titleX;
    }

    #getAxisXTitle(drawArea) {
        const { axis } = { ...this.data };
        const area = util.CommonUtil.find(this.data, "chart.area");
        const { x: ax, width: aw } = { ...drawArea };
        const { y: ay, height: ah } = { ...area };
        const { text, param } = { ...util.CommonUtil.find(axis, "x.title") };

        const mtx = util.CanvasUtil.getTextSize(text, param);
        const { height: th } = { ...mtx };

        const x = ax + aw / 2;
        const y = ay + ah + th / 2
        const title = util.CanvasUtil.text(x, y, text, param);
        
        return title;
    }

    getTooltipHTML(mx, my) {
        const isContain = this.#isContain(mx, my);
        let html;
        const { canvas, ctx } = { ...this.subLayer };
        util.CanvasUtil.clear(canvas);
        if (isContain) {
            const { tooltipData = [] } = { ...this.chartData };
            if (util.CommonUtil.isEmpty(tooltipData)) return;

            const { idx, tick } = this.#getDataIndex(mx, my);

            if (this.#oldIndex !== idx) {
                this.#oldIndex = idx;
                this.#toottipHTML = this.getAxisTooltipHTML(idx);
            }

            this.#setDim(ctx, idx, tick);
            html = this.#toottipHTML;
        } else {
            if (this.#oldIndex > -1) {
                this.#oldIndex = null;
                this.#toottipHTML = null;
            }
        }

        return html;
    }

    #isContain(mx, my) {
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

    #getDataIndex(mx, my) {
        const { drawArea, tooltipData = [] } = { ...this.chartData };
        const { x, width } = { ...drawArea };
        const tick = width / tooltipData.length;
        const idx = util.CommonUtil.floor((mx - x) / tick, 0);

        return { idx, tick };
    }

    #setDim(ctx, idx, tick) {
        const { drawArea } = { ...this.chartData };
        const { x, y, width, height } = { ...drawArea };

        const dimX = x + tick * idx;
        const param = {
            style: {
                fillStyle: "#000000",
                globalAlpha: 0.1
            }
        };
        const dim = util.CanvasUtil.rect(dimX, y, tick, -height, param);
        dim.draw(ctx);
    }

    getAxisTooltipHTML(idx) {
        const { tooltipData = [], palette } = { ...this.chartData };
        const data = tooltipData[idx];
        const { name, value } = { ...data };

        const html = `
            <div>
                <div>${name}</div>
                ${value.map((v, idx) => {
                    const color = util.ColorUtil.getPaletteColor(palette, idx);
                    return `<div style="display: flex;">
                                <div style="margin: auto 0px; width: 10px; height: 10px; background-color: ${color};"></div>
                                <div style="margin-left: 5px;">${v}</div>
                            </div>`;
                }).join("")}
            </div>
        `;

        return html;
    }
}

export default AxisChart;
